package com.backend.service;

import java.util.List;

import com.backend.dtos.NurseDto;
import com.backend.dtos.NurseUpdateDto;
import com.backend.entities.NurseEntity;

public interface NurseService {

	//Add new Nurse --> ADMIN (NURSE)
	Long addNewNurse(NurseDto nurseDto);

	//Get all Nurses
	List<NurseEntity> getAllNurses();

	//Get Nurse according to Departments --> ADMIN (NURSES)
	List<NurseEntity> getNursesByDepartment(Long departmentId);

	
	//Get Nurse is Active or Inactive --> ADMIN (NURSES)
	List<NurseEntity> getNursesByStatus(boolean isActive);

	
	//Search Nurse By Name, Department
	List<NurseEntity> searchNurses(String keyword);

	
	//DELETE (deactivate) - soft delete nurse
	void deleteNurse(Long nurseId);

	
	//Update Nurse Details
	void updateNurse(Long nurseId, NurseUpdateDto nurseUpdateDto);

}
