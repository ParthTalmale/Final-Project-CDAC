package com.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.backend.dtos.MedicalRecordDetailsDto;
import com.backend.dtos.MedicalRecordDto;
import com.backend.dtos.MedicalRecordResponseDTO;
import com.backend.entities.MedicalRecordEntity;


public interface MedicalRecordService {

	List<MedicalRecordResponseDTO> searchRecordsByDoctorName(String name);

	Page<MedicalRecordDto> getMedicalRecordsByPrescription(Long prescriptionId, int page);

	//Add Medical Records --> ADMIN
	void saveMedicalRecord(Long appointmentId, String recordType, MultipartFile file);

	//Search Medical Records by patient, doctor or title --> ADMIN
	List<MedicalRecordEntity> searchMedicalRecords(String patientName, String doctorName, String recordType);

	//Search Patient's - ALL TYPES (UI) --> ADMIN
	List<String> getAllRecordTypes();

	//Get Particular Medical Records to be shown on UI after clicking --> ADMIN
	//Get Particular Medical Records to be shown on UI after clicking --> ADMIN
	MedicalRecordDetailsDto getMedicalRecordDetails(Long id);

    MedicalRecordEntity getFile(Long id);
    
    List<MedicalRecordDto> getRecordsByPatientId(Long patientId);
}
