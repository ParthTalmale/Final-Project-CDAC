package com.backend.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.AppointmentDto;
import com.backend.dtos.DoctorResponseDto;
import com.backend.dtos.EmergencyContactDto;
import com.backend.dtos.MedicalRecordDto;
import com.backend.dtos.PrescriptionDto;
import com.backend.entities.EmergencyContact;
import com.backend.entities.PatientEntity;
import com.backend.repository.PatientRepository;
import com.backend.service.AppointmentService;
import com.backend.service.DoctorService;
import com.backend.service.EmergencyContactService;
import com.backend.service.MedicalRecordService;
import com.backend.service.PrescriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/patient") // Singular to match patientApi.js
@RequiredArgsConstructor
public class PatientApiController {

    private final AppointmentService appointmentService;
    private final MedicalRecordService medicalRecordService;
    private final PrescriptionService prescriptionService;
    private final EmergencyContactService emergencyContactService;
    private final DoctorService doctorService;
    private final PatientRepository patientRepository;

    private Long getPatientId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        
        PatientEntity patient = patientRepository.findByUserEmail(email)
        		.orElseThrow(() -> new RuntimeException("Patient not found for user: " + email));
        
        return patient.getId();
    }
    
    // Better implementation if repository supports it, but for now filtering ok if dataset small.
    // Actually PatientRepository doesn't have findByUserEmail, so I use the stream approach for safety or add it.
    // Added findByUser(User) in repo earlier.
    
    @GetMapping("/upcomingAppointments")
    public ResponseEntity<List<com.backend.dtos.AppointmentViewDTO>> getUpcomingAppointments() {
        return ResponseEntity.ok(appointmentService.getUpcomingAppointments(getPatientId()));
    }

    @GetMapping("/medicalRecords")
    public ResponseEntity<List<MedicalRecordDto>> getMedicalRecords() {
        return ResponseEntity.ok(medicalRecordService.getRecordsByPatientId(getPatientId()));
    }

    @GetMapping("/activePrescriptions")
    public ResponseEntity<List<PrescriptionDto>> getActivePrescriptions() {
        // Assuming all prescriptions returned are "active" or filtered in service.
        // Current service returns all. Future: Filter by date.
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByPatientId(getPatientId()));
    }
    
    @GetMapping("/recentReports")
    public ResponseEntity<List<MedicalRecordDto>> getRecentReports() {
        // Reuse medical records for now
        return ResponseEntity.ok(medicalRecordService.getRecordsByPatientId(getPatientId())); 
    }

    @GetMapping("/allDoctors")
    public ResponseEntity<List<DoctorResponseDto>> getAllDoctors() {
        // Use the dedicated method for patients to avoid Admin filter conflicts
        return ResponseEntity.ok(doctorService.getActiveDoctorsOnly());
    }

    @GetMapping("/emergencyContacts")
    public ResponseEntity<List<EmergencyContact>> getEmergencyContacts() {
        return ResponseEntity.ok(emergencyContactService.getContacts(getPatientId()));
    }

    @PostMapping("/emergencyContacts")
    public ResponseEntity<EmergencyContact> addEmergencyContact(@RequestBody EmergencyContactDto dto) {
        return ResponseEntity.ok(emergencyContactService.addContact(getPatientId(), dto));
    }
    
    @PutMapping("/emergencyContacts/{contactId}")
    public ResponseEntity<EmergencyContact> updateEmergencyContact(@PathVariable Long contactId, @RequestBody EmergencyContactDto dto) {
        // Implement update if service supports it? Service only has add/delete/primary.
        // For now, maybe re-add? Or throw unsupported.
        // emergencyContactService.updateContact(contactId, dto); 
        return ResponseEntity.badRequest().build(); // Not implemented yet
    }

    @DeleteMapping("/emergencyContacts/{contactId}")
    public ResponseEntity<Void> deleteEmergencyContact(@PathVariable Long contactId) {
        emergencyContactService.deleteContact(contactId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/lastVisitDate")
    public ResponseEntity<String> getLastVisitDate() {
        LocalDate date = appointmentService.getLastVisit(getPatientId());
        return ResponseEntity.ok(date != null ? date.format(DateTimeFormatter.ISO_DATE) : "");
    }
    
    @GetMapping("/labReportsCount")
    public ResponseEntity<Integer> getLabReportsCount() {
        return ResponseEntity.ok(medicalRecordService.getRecordsByPatientId(getPatientId()).size());
    }
    
    // Dashboard Aggregate - Optional, frontend calls individual stats mostly?
    // patientApi.js has getPatientDashboard(id) which calls /patient/{id}/dashboard.
    // But getting individual stats is also there.
    
    @GetMapping("/{patientId}/dashboard")
    public ResponseEntity<?> getDashboard(@PathVariable Long patientId) {
         // Return some aggregate if needed, or just let frontend call individual.
         return ResponseEntity.ok().build();
    }
    
}
