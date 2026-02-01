package com.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.entities.MedicalRecordEntity;
import com.backend.service.MedicalRecordService;
import com.backend.service.PatientService;


@RestController
@RequestMapping("/api/admin")
public class AdminController {

	
	@Autowired
	private MedicalRecordService medicalRecordService;
	
	@Autowired
	private PatientService patientService;
	
	@Autowired
	private com.backend.service.UserService userService;

	
	//Add Medical Records - Admin
	
	@PostMapping(value = "/add-medical-record", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> addMedicalRecord(@RequestParam Long appointmentId, @RequestParam String recordType, @RequestParam MultipartFile file){
		
		medicalRecordService.saveMedicalRecord(appointmentId, recordType, file);
		
		return ResponseEntity.ok("Medical record added successfully");
	}
	
	//Search Medical Records by patient, doctor or title --> ADMIN
	@GetMapping("/search")
	public ResponseEntity<List<MedicalRecordEntity>> searchRecords(
            @RequestParam(required = false) String patientName,
            @RequestParam(required = false) String doctorName,
            @RequestParam(required = false) String recordType) {

        return ResponseEntity.ok(
                medicalRecordService.searchMedicalRecords(
                        patientName,
                        doctorName,
                        recordType
                )
        );
    }
	
	@GetMapping("/staff")
    public ResponseEntity<List<com.backend.dtos.UserDto>> getStaffMembers() {
        return ResponseEntity.ok(userService.getStaffMembers());
    }

	//Search Patient's - ALL (UI) --> ADMIN
	//Search Patient's - ALL (UI) --> ADMIN
	@GetMapping("/patients/name")
	public ResponseEntity<List<String>> getPatientNames(){
		return ResponseEntity.ok(patientService.getAllPatientNames());
	}

    // Dashboard Stats --> ADMIN
    @GetMapping("/dashboard/stats")
    public ResponseEntity<com.backend.dtos.AdminDashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(userService.getAdminDashboardStats());
    }
}
