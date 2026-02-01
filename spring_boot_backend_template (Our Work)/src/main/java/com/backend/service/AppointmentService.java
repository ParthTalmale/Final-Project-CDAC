package com.backend.service;

import java.time.LocalDate;
import java.util.List;

import com.backend.dtos.HoldSlotRequestDto;
import com.backend.dtos.HoldSlotResponseDto;
import com.backend.dtos.SlotResponseDto;
import com.backend.entities.AppointmentEntity;

import jakarta.validation.Valid;

public interface AppointmentService {

	LocalDate getLastVisit(Long patientId);

	long getCompletedAppointmentsCountByPatient(Long patientId);

	long getTotalDoctorsConsultedByPatient(Long patientId);

	List<SlotResponseDto> getAvailableSot(Long doctorId, LocalDate date);

	HoldSlotResponseDto holdSlot(@Valid HoldSlotRequestDto req);

	boolean markAsScheduled(Long appointmentId);

	List<com.backend.dtos.AppointmentViewDTO> getUpcomingAppointments(Long patientId);
	
	List<com.backend.dtos.AppointmentViewDTO> getAppointmentsForDoctor(Long doctorId);

	boolean cancelAppointment(Long appointmentId);

	boolean completeAppointment(Long appointmentId);
}
