package com.backend.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.dtos.RegisterDto;
import com.backend.dtos.UserDto;
import com.backend.entities.User;
import com.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final com.backend.repository.PatientRepository patientRepository;
    private final com.backend.repository.DoctorRepository doctorRepository;
    private final com.backend.repository.NurseRepository nurseRepository;
    private final com.backend.repository.AdminRepository adminRepository;
    private final com.backend.repository.DepartmentRepository departmentRepository; 
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto registerUser(RegisterDto registerDto) {
        if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = modelMapper.map(registerDto, User.class);
        user.setUserRole(registerDto.getUserRole()); // Manual mapping to ensure it's not null
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setActive(true); // Default to active

        User savedUser = userRepository.save(user);

        // Handle Role Specific Entity Creation
        switch (registerDto.getUserRole()) {
            case ROLE_DOCTOR:
                com.backend.entities.Department docDept = departmentRepository.findById(registerDto.getDepartmentId())
                        .orElseThrow(() -> new RuntimeException("Department not found"));
                
                com.backend.entities.DoctorEntity doctor = new com.backend.entities.DoctorEntity();
                doctor.setUser(savedUser);
                doctor.setDepartment(docDept);
                doctor.setSpecialization(registerDto.getSpecialization());
                doctor.setLicenseNumber(registerDto.getLicenseNumber());
                doctor.setYearsOfExperience(registerDto.getYearsOfExperience());
                doctor.setRating(registerDto.getRating());
                doctor.setDateOfJoining(registerDto.getDateOfJoining() != null ? registerDto.getDateOfJoining() : java.time.LocalDate.now());
                
                doctorRepository.save(doctor);
                break;

            case ROLE_NURSE:
                com.backend.entities.Department nurseDept = departmentRepository.findById(registerDto.getDepartmentId())
                        .orElseThrow(() -> new RuntimeException("Department not found"));
                
                com.backend.entities.NurseEntity nurse = new com.backend.entities.NurseEntity();
                nurse.setUser(savedUser);
                nurse.setDepartment(nurseDept);
                nurse.setDateOfJoining(registerDto.getDateOfJoining() != null ? registerDto.getDateOfJoining() : java.time.LocalDate.now());

                nurseRepository.save(nurse);
                break;

            case ROLE_ADMIN:
                com.backend.entities.Admin admin = new com.backend.entities.Admin();
                admin.setUser(savedUser);
                
                // Audit Trail: Link to the Admin who created this account
                try {
                    org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
                    if (auth != null && auth.getPrincipal() instanceof com.backend.security.CustomUserDetails) {
                        com.backend.security.CustomUserDetails currentUser = (com.backend.security.CustomUserDetails) auth.getPrincipal();
                        
                        // Check if the creator is indeed an Admin
                         if (currentUser.getUser().getUserRole() == com.backend.entities.UserRole.ROLE_ADMIN) {
                            Long creatorAdminId = currentUser.getRoleId();
                            if (creatorAdminId != null) {
                                adminRepository.findById(creatorAdminId).ifPresent(admin::setCreatedBy);
                            }
                         }
                    }
                } catch (Exception e) {
                    // Log error but don't fail registration
                    System.err.println("Failed to set created_by_admin_id: " + e.getMessage());
                }

                adminRepository.save(admin);
                break;
                
             // ROLE_PATIENT is handled in registerPatient method specifically, 
             // but if registerUser is called for patient, we skip extra entity creation here 
             // to avoid duplication if the flow isn't unified.
             // However, for safety, if called directly:
             case ROLE_PATIENT:
                 // Ideally handled by registerPatient, doing nothing here prevents error.
                 break;
        }

        return modelMapper.map(savedUser, UserDto.class);
    }

    @Override
    public UserDto registerPatient(RegisterDto registerDto) {
        // 1. Create and Save User
        registerDto.setUserRole(com.backend.entities.UserRole.ROLE_PATIENT);
        UserDto savedUserDto = registerUser(registerDto);

        // 2. Retrieve the full User entity (needed for relationship)
        User user = userRepository.findById(savedUserDto.getId())
                .orElseThrow(() -> new RuntimeException("User registration failed"));

        // 3. Create and Save Patient Entity
        com.backend.entities.PatientEntity patient = new com.backend.entities.PatientEntity();
        patient.setUser(user);
        patient.setGender(registerDto.getGender()); 
        patient.setBloodGroup(registerDto.getBloodGroup());
        patient.setAddress(registerDto.getAddress()); 
        
        patientRepository.save(patient);

        return savedUserDto;
    }

    @Override
    public java.util.List<UserDto> getStaffMembers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getUserRole() != com.backend.entities.UserRole.ROLE_PATIENT)
                .map(u -> modelMapper.map(u, UserDto.class))
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public com.backend.dtos.AdminDashboardStatsDto getAdminDashboardStats() {
        // 1. Total Counts
        long totalDoctors = doctorRepository.count();
        long totalNurses = nurseRepository.count();

        // 2. Recent Staff
        java.util.List<com.backend.entities.UserRole> roles = java.util.List.of(
            com.backend.entities.UserRole.ROLE_DOCTOR, 
            com.backend.entities.UserRole.ROLE_NURSE
        );
        java.util.List<User> recentUsers = userRepository.findTop4ByUserRoleInOrderByCreatedOnDesc(roles);
        
        java.util.List<com.backend.dtos.RecentStaffDto> recentStaff = recentUsers.stream()
            .map(u -> new com.backend.dtos.RecentStaffDto(
                u.getName(),
                u.getUserRole().name().replace("ROLE_", ""), // Friendly Name
                u.getCreatedOn().toLocalDate(),
                "Added" // Assuming Added for now
            ))
            .collect(java.util.stream.Collectors.toList());

        // 3. Department Stats
        java.util.List<com.backend.dtos.DepartmentStatDto> deptStats = departmentRepository.findAll().stream()
            .map(dept -> {
                long dCount = doctorRepository.countByDepartment(dept);
                long nCount = nurseRepository.countByDepartment(dept);
                return new com.backend.dtos.DepartmentStatDto(dept.getDeptName(), dCount, nCount);
            })
            .collect(java.util.stream.Collectors.toList());

        return new com.backend.dtos.AdminDashboardStatsDto(totalDoctors, totalNurses, recentStaff, deptStats);
    }
}
