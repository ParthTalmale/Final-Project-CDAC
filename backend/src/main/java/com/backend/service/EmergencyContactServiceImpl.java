package com.backend.service;

import java.security.Identity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dtos.EmergencyContactDto;
import com.backend.dtos.EmergencyContactResponseDto;
import com.backend.entities.EmergencyContact;
import com.backend.entities.PatientEntity;
import com.backend.repository.EmergencyContactRepository;
import com.backend.repository.PatientRepository;

import io.swagger.v3.oas.annotations.info.Contact;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class EmergencyContactServiceImpl implements EmergencyContactService {
	
	@Autowired
	private final EmergencyContactRepository emergencyContactRepository;
	
	@Autowired
	private final PatientRepository patientRepository;

	@Override
	public EmergencyContact addContact(Long patientId, EmergencyContactDto dto) {
		// TODO Auto-generated method stub
		
		PatientEntity patientEntity = patientRepository.findById(patientId)
														.orElseThrow(() -> new RuntimeException("Patient not found"));
		
		EmergencyContact contact = new EmergencyContact();
		contact.setName(dto.getName());
		contact.setRelation(dto.getRelation());
        contact.setPhone(dto.getPhone());
        contact.setPrimaryContact(dto.isPrimaryContact());
        contact.setPatient(patientEntity);
		
        
        return emergencyContactRepository.save(contact);
	}

	@Override
	public void deleteContact(Long contactId) {
		// TODO Auto-generated method stub
		
//		System.out.println("Deleting Contact Id : " + contactId);
		
		EmergencyContact patientEntity = emergencyContactRepository.findById(contactId)
													   .orElseThrow(() -> new RuntimeException("Emergency Contact not found"));
		
		emergencyContactRepository.deleteById(contactId);
	}

	@Override
	public void setPrimaryContact(Long contactId) {
		// TODO Auto-generated method stub
		EmergencyContact contact = emergencyContactRepository.findById(contactId)
														.orElseThrow(() -> new RuntimeException("Emergency Contact not found"));
		
		Long patientId = contact.getPatient().getId();
		
		//unset old primary for this patient
		emergencyContactRepository.unSetPrimaryForPatient(patientId);
		
		
		//set contact as primary
		contact.setPrimaryContact(true);
		
		emergencyContactRepository.save(contact);
	}

	@Override
	public java.util.List<EmergencyContact> getContacts(Long patientId) {
		return emergencyContactRepository.findByPatientId(patientId);
	}

}
