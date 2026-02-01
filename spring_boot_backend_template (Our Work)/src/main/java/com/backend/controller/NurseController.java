package com.backend.controller;


import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.NurseDto;
import com.backend.dtos.NurseUpdateDto;
import com.backend.entities.NurseEntity;
import com.backend.service.NurseService;

import lombok.Delegate;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/nurse")
@RequiredArgsConstructor
public class NurseController {
	
	private final NurseService nurseService;
	
	//Get All Nurses
	@GetMapping
	public ResponseEntity<List<NurseEntity>> getAllNurses(){
		return ResponseEntity.ok(nurseService.getAllNurses());
	}
	@PostMapping(value = "add-nurse")
	public ResponseEntity<?> addNurse(@RequestBody NurseDto nurseDto){
		Long nurseId = nurseService.addNewNurse(nurseDto);
		
		return ResponseEntity.ok(
						Map.of(
								"Message", "Nurse Added Successfully",
								"NurseId", nurseId
								)
				);
	}

	
	//Get Nurse according to Departments --> ADMIN (NURSES)
	@GetMapping("/by-department/{departmentId}")
	public List<NurseEntity> getNursesByDepartment(@PathVariable Long departmentId){
		
		return nurseService.getNursesByDepartment(departmentId);
	}
	
	
	//Get Nurse is Active or Inactive --> ADMIN (NURSES)
	@GetMapping("/status/{status}")
	public List<NurseEntity> getNursesByStatus(@PathVariable String status){
		
		boolean isActive = status.equalsIgnoreCase("active");
		
		return nurseService.getNursesByStatus(isActive);
	}
	
	
	//Search Nurse By Name, Department
	@GetMapping("/search")
	public List<NurseEntity> searchNurses(
            @RequestParam String keyword) {

        return nurseService.searchNurses(keyword);
    }
	
	
	//DELETE (deactivate) - soft delete nurse
	@DeleteMapping("/delete/{nurseId}")
	public ResponseEntity<?> deleteNurse(@PathVariable Long nurseId){
		
		nurseService.deleteNurse(nurseId);
		
		return ResponseEntity.ok().body("Nurse Deleted Successfully!");
	}
	
	
	//Update Nurse Details
	@PutMapping("/update/{nurseId}")
	public ResponseEntity<?> updateNurse(@PathVariable Long nurseId, @RequestBody NurseUpdateDto nurseUpdateDto){
		
		nurseService.updateNurse(nurseId, nurseUpdateDto);
		
		return ResponseEntity.ok("Nurse Updated Successfully!");
	}
}
