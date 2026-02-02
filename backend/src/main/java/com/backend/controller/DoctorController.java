package com.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.dtos.*;

import com.backend.service.DoctorService;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {
	
	@Autowired
	private final DoctorService doctorService;
	
	// http://localhost:8080/api/doctor?page=0&size=4
    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<DoctorResponseDto>> getAllDoctors(
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "6") int size,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String keyword,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String department
    ) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        System.out.println("Fetching Doctors - Page: " + page + ", Keyword: " + keyword + ", Dept: " + department);
        return ResponseEntity.ok(doctorService.getAllDoctors(keyword, department, pageable));
    }
    
    
    @PostMapping("/doctor_available")
    public ResponseEntity<?> getDoctorSlotDayWise(@RequestBody @Valid DoctorAvailableRequestDto request){
    	return ResponseEntity.ok(doctorService.getAvailabilityForDates(request.getDoctorId(),request.getDate()));
    }
    
    @PostMapping("/updateAvailability")
    public ResponseEntity<?> updateAvailability(@RequestBody @Valid UpdateAvailabilityRequest request) {
        doctorService.updateAvailability(request);
        return ResponseEntity.ok("Availability Updated Successfully");
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DoctorDashboardDto> getDashboardStats() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        com.backend.security.CustomUserDetails user = (com.backend.security.CustomUserDetails) auth.getPrincipal();
        Long doctorId = user.getRoleId();
        return ResponseEntity.ok(doctorService.getDashboardStats(doctorId));
    }

    @GetMapping("/availability/{doctorId}")
    public ResponseEntity<List<WeeklyAvailabilityDto>> getWeeklyAvailability(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorService.getWeeklyAvailability(doctorId));
    }
}
