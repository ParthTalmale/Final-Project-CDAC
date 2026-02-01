package com.backend.service;

import com.backend.dtos.EmergencyContactDto;
import com.backend.entities.EmergencyContact;


public interface EmergencyContactService {

	EmergencyContact addContact(Long patientId, EmergencyContactDto dto);

	void deleteContact(Long contactId);

	void setPrimaryContact(Long contactId);

	java.util.List<EmergencyContact> getContacts(Long patientId);
}
