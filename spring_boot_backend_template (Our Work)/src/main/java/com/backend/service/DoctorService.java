package com.backend.service;

import java.time.LocalDate;
import java.util.List;

import com.backend.dtos.DoctorAvailabilityResponseDto;
import com.backend.dtos.DoctorResponseDto;
import com.backend.entities.DoctorAvailability;

public interface DoctorService {
	org.springframework.data.domain.Page<DoctorResponseDto> getAllDoctors(String keyword, String department, org.springframework.data.domain.Pageable pageable);

    java.util.List<DoctorResponseDto> getActiveDoctorsOnly();

	List<DoctorAvailabilityResponseDto> getAvailabilityForDates(Long doctor_id, LocalDate date);

    com.backend.dtos.DoctorDashboardDto getDashboardStats(Long doctorId);

    void updateAvailability(com.backend.dtos.UpdateAvailabilityRequest request);

    java.util.List<com.backend.dtos.WeeklyAvailabilityDto> getWeeklyAvailability(Long doctorId);
}
