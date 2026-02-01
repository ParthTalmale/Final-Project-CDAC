package com.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.AvialableSlotRequestDto;
import com.backend.dtos.HoldSlotRequestDto;
import com.backend.dtos.HoldSlotResponseDto;
import com.backend.dtos.SlotResponseDto;
import com.backend.service.AppointmentService;
import com.backend.service.PatientService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    @Autowired
    private final AppointmentService appointmentService;

    // http://localhost:8080/appointments/patient/1/completed/count
    @GetMapping("/patient/{patientId}/completed/count")
    public ResponseEntity<Long> getCompletedAppointmentsCount(
            @PathVariable Long patientId) {
        long count = appointmentService.getCompletedAppointmentsCountByPatient(patientId);
        return ResponseEntity.ok(count);
    }

    // http://localhost:8080/appointments/patient/1/doctors/count
    @GetMapping("/patient/{patientId}/doctors/count")
    public ResponseEntity<Long> getTotalDoctorsConsulted(
            @PathVariable Long patientId) {
        long count = appointmentService.getTotalDoctorsConsultedByPatient(patientId);
        return ResponseEntity.ok(count);
    }

    // http://localhost:8080/appointments/patient/1/upcoming
    @GetMapping("/patient/{patientId}/upcoming")
    public ResponseEntity<List<com.backend.dtos.AppointmentViewDTO>> getUpcomingAppointments(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getUpcomingAppointments(patientId));
    }

    @PostMapping("/slot")
    public ResponseEntity<?> getAvailableSlot(@RequestBody AvialableSlotRequestDto request) {
        System.out.println("Entered Controller");
        System.out.println(request.getDate());
        List<SlotResponseDto> res = appointmentService.getAvailableSot(request.getDoctorId(), request.getDate());

        for (SlotResponseDto dto : res) {
            System.out.println(dto.getStartTime());
        }

        return ResponseEntity.ok(res);

    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<com.backend.dtos.AppointmentViewDTO>> getAppointmentsForDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForDoctor(doctorId));
    }

    @PostMapping("/cancel/{appointmentId}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(appointmentId));
    }

    @PostMapping("/complete/{appointmentId}")
    public ResponseEntity<?> completeAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(appointmentService.completeAppointment(appointmentId));
    }

    @PostMapping("holdSlot")
    public ResponseEntity<?> holdSlot(@RequestBody @Valid HoldSlotRequestDto req) {

        HoldSlotResponseDto res = appointmentService.holdSlot(req);

        return ResponseEntity.ok(res);

    }

}
