package com.backend.service;


public interface PrescriptionService {

	long countActivePrescriptions(Long patientId);
	
	java.util.List<com.backend.dtos.PrescriptionDto> getPrescriptionsByDoctor(String doctorEmail);

	void createPrescription(com.backend.dtos.PrescriptionRequestDto request);
	
	java.util.List<com.backend.dtos.PrescriptionDto> getPrescriptionsByPatientId(Long patientId);
}
