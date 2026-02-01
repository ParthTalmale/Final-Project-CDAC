package com.backend.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.service.AppointmentService;
import com.backend.service.PatientService;
import com.backend.service.PrescriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {
	 private final PatientService patientService;

	 private final AppointmentService appointmentService;
	 
	 private final PrescriptionService prescriptionService;
	 
	 @GetMapping("/last-visit/{patientId}")
	 public String getLastVisit(@PathVariable Long patientId) {
		 LocalDate lastVisit = appointmentService.getLastVisit(patientId);
		 
		 return lastVisit != null ? 
				 lastVisit.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "No visits yet";
	 }
	 
}
