package com.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dtos.NurseDto;
import com.backend.dtos.NurseUpdateDto;
import com.backend.entities.Department;
import com.backend.entities.NurseEntity;
import com.backend.entities.User;
import com.backend.entities.UserRole;
import com.backend.repository.DepartmentRepository;
import com.backend.repository.NurseRepository;
import com.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class NurseServiceImpl implements NurseService {

	private final NurseRepository nurseRepository;

	private final UserRepository userRepository;
	
	private final DepartmentRepository departmentRepository;
	
	@Override
	public Long addNewNurse(NurseDto nurseDto) {
		//Check email uniqueness
        if (userRepository.findByEmail(nurseDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
		
        //Fetching department
        Department department = departmentRepository
                .findById(nurseDto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        //Create USER
        User user = new User();
        user.setName(nurseDto.getName());
        user.setEmail(nurseDto.getEmail());
        user.setPhone(nurseDto.getPhone());
        user.setPassword("pass123");
        user.setActive(nurseDto.isActive());
        user.setUserRole(UserRole.ROLE_NURSE);
        user.setDob(LocalDate.of(1995, 1, 1));

        userRepository.save(user);

        //Create NURSE
        NurseEntity nurse = new NurseEntity();
        nurse.setUser(user);
        nurse.setDepartment(department);
        nurse.setDateOfJoining(LocalDate.now());

        nurseRepository.save(nurse);

        return nurse.getId(); // BaseEntity ID
	}
    
    // Get all Nurses
    @Override
    public List<NurseEntity> getAllNurses() {
        return nurseRepository.findAll();
    }

	
	//Get Nurse according to Departments --> ADMIN (NURSES)
	@Override
	public List<NurseEntity> getNursesByDepartment(Long departmentId) {
		// TODO Auto-generated method stub
		return nurseRepository.findByDepartment_Id(departmentId);
	}

	
	//Get Nurse is Active or Inactive --> ADMIN (NURSES)
	@Override
	public List<NurseEntity> getNursesByStatus(boolean isActive) {
		// TODO Auto-generated method stub
		return nurseRepository.findByUser_IsActive(isActive);
	}
	
	
	//Search Nurse By Name, Department
	public List<NurseEntity> searchNurses(String keyword) {
        return nurseRepository.searchNurses(keyword);
    }


	//DELETE (deactivate) - soft delete nurse
	@Override
	public void deleteNurse(Long nurseId) {
		// TODO Auto-generated method stub
		NurseEntity nurseEntity = nurseRepository.findById(nurseId)
												  .orElseThrow(() -> new RuntimeException("Nurse Not Found!"));
		
		//Soft Delete
		nurseEntity.getUser().setActive(false);
		
		nurseRepository.save(nurseEntity);
	}


	//Update Nurse Details
	@Override
	public void updateNurse(Long nurseId, NurseUpdateDto nurseUpdateDto) {
		// TODO Auto-generated method stub
		NurseEntity nurseEntity = nurseRepository.findById(nurseId)
												 .orElseThrow(() -> new RuntimeException("NUrse Not Found!"));
		
		//Update User Details
		User user = nurseEntity.getUser();
		
		user.setName(nurseUpdateDto.getName());
		user.setEmail(nurseUpdateDto.getEmail());
		user.setPhone(nurseUpdateDto.getPhone());
		user.setActive(nurseUpdateDto.isActive());
		
		//Update Department
		Department department = departmentRepository
	            .findById(nurseUpdateDto.getDepartmentId())
	            .orElseThrow(() -> new RuntimeException("Department not found"));

	    nurseEntity.setDepartment(department);

	    nurseRepository.save(nurseEntity);
		
	}
	
	
}
