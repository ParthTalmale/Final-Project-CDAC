package com.backend.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.MedicalRecordDetailsDto;
import com.backend.dtos.MedicalRecordResponseDTO;
import com.backend.service.MedicalRecordService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class PatientMedicalRecordsController {
	
	private final MedicalRecordService medicalRecordsService;

	
	@GetMapping("/doctor/{name}")
	public List<MedicalRecordResponseDTO> searchDoctorByName(@PathVariable String name) {
		System.out.println("Request received to fetch reports for Doctor: " + name);
		return medicalRecordsService.searchRecordsByDoctorName(name);
	}
	
	//Get Medical Records of ALL TYPES --> ADMIN
	@GetMapping("/types")
	public ResponseEntity<List<String>> getRecordTypes(){
		
		return ResponseEntity.ok(medicalRecordsService.getAllRecordTypes());
	}
	
	//Get Particular Medical Records to be shown on UI after clicking --> ADMIN
	@GetMapping(value =  "{id}",
				produces = MediaType.APPLICATION_JSON_VALUE
			)
	public ResponseEntity<MedicalRecordDetailsDto> getRecordDetails(@PathVariable Long id){
		
		return ResponseEntity.ok(medicalRecordsService.getMedicalRecordDetails(id));
	}

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        com.backend.entities.MedicalRecordEntity record = medicalRecordsService.getFile(id);
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + record.getFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(record.getFileData());
    }

    @org.springframework.web.bind.annotation.PostMapping("/upload")
    public ResponseEntity<?> uploadMedicalRecord(
            @org.springframework.web.bind.annotation.RequestParam("appointmentId") Long appointmentId,
            @org.springframework.web.bind.annotation.RequestParam("recordType") String recordType,
            @org.springframework.web.bind.annotation.RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            medicalRecordsService.saveMedicalRecord(appointmentId, recordType, file);
            return ResponseEntity.ok("File uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }
}
