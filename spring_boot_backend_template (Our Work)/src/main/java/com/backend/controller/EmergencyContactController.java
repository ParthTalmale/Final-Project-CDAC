package com.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.EmergencyContactDto;
import com.backend.dtos.EmergencyContactResponseDto;
import com.backend.entities.EmergencyContact;
import com.backend.service.EmergencyContactService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyContactController {
	
	private final EmergencyContactService emergencyContactService;
	
	//Add Contact
	@PostMapping("/add/{patientId}")
	public EmergencyContact addContact(@PathVariable Long patientId, @RequestBody EmergencyContactDto dto) {
		
		return emergencyContactService.addContact(patientId, dto);
	}
	
	//Delete Contact
	@DeleteMapping("/delete/{contactId}")
	public void deleteContact(@PathVariable Long contactId) {
		emergencyContactService.deleteContact(contactId);
	}
	
	//Set Primary Contact
	@PutMapping("/set-primary/{contactId}")
	public void setPrimaryContact(@PathVariable Long contactId) {
		emergencyContactService.setPrimaryContact(contactId);
	}
	
}
