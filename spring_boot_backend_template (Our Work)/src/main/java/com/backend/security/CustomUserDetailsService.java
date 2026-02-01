package com.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.entities.User;
import com.backend.repository.UserRepository;

@Service
@Transactional
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private com.backend.repository.PatientRepository patientRepository;
    @Autowired
    private com.backend.repository.DoctorRepository doctorRepository;
    @Autowired
    private com.backend.repository.NurseRepository nurseRepository;
    @Autowired
    private com.backend.repository.AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        Long roleId = null;
        
        // Fetch specific ID based on Role
        switch (user.getUserRole()) {
            case ROLE_PATIENT:
                roleId = patientRepository.findByUser(user)
                        .map(com.backend.entities.PatientEntity::getId)
                        .orElse(null);
                break;
            case ROLE_DOCTOR:
                roleId = doctorRepository.findByUser(user)
                        .map(com.backend.entities.DoctorEntity::getId)
                        .orElse(null);
                break;
            case ROLE_NURSE:
                roleId = nurseRepository.findByUser(user)
                        .map(com.backend.entities.NurseEntity::getId)
                        .orElse(null);
                break;
            case ROLE_ADMIN:
                roleId = adminRepository.findByUser(user)
                        .map(com.backend.entities.Admin::getId)
                        .orElse(null);
                break;
        }
        
        return new CustomUserDetails(user, roleId);
    }
}
