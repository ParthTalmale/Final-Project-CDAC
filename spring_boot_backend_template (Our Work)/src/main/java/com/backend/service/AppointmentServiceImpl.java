package com.backend.service;

import java.awt.desktop.UserSessionEvent.Reason;
import java.io.Console;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dtos.DoctorAvailabilityResponseDto;
import com.backend.dtos.HoldSlotRequestDto;
import com.backend.dtos.HoldSlotResponseDto;
import com.backend.dtos.SlotResponseDto;
import com.backend.entities.AppointmentEntity;
import com.backend.entities.AppointmentStatus;
import com.backend.entities.AppointmentType;
import com.backend.repository.AppointmentRepository;
import com.backend.repository.DoctorRepository;
import com.backend.repository.PatientRepository;
import com.backend.security.SecurityConfiguration;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

	@Autowired
	private final SecurityConfiguration securityConfiguration;

	@Autowired
	private final AppointmentRepository appointmentRepository;

	@Autowired
	private final DoctorRepository doctorRepository;

	@Autowired
	private final PatientRepository patientRepository;

	private static final int SLOT_DURATION_MINUTES = 30;

	@Autowired
	private final DoctorService doctorService;

	@Override
	public LocalDate getLastVisit(Long patientId) {
		// TODO Auto-generated method stub
		return appointmentRepository.findLastVisitDate(patientId);
	}

	@Override
	public long getCompletedAppointmentsCountByPatient(Long patientId) {
		return appointmentRepository.countByPatient_IdAndStatus(
				patientId,
				AppointmentStatus.COMPLETED);
	}

	@Override
	public long getTotalDoctorsConsultedByPatient(Long patientId) {
		return appointmentRepository.countDistinctDoctorsByPatientId(patientId);
	}

	@Override
	public List<SlotResponseDto> getAvailableSot(Long doctorId, LocalDate date) {

		List<DoctorAvailabilityResponseDto> avail = doctorService.getAvailabilityForDates(doctorId, date);
		for (DoctorAvailabilityResponseDto doctorAvailabilityResponseDto : avail) {
			System.out.println(doctorAvailabilityResponseDto);
		}
		System.out.println("Availability Slots:");
		for (DoctorAvailabilityResponseDto doctorAvailabilityResponseDto : avail) {
			System.out.println(doctorAvailabilityResponseDto);
		}

		if (avail.isEmpty()) {
			return List.of();
		}

		LocalDateTime start = date.atStartOfDay();
		LocalDateTime end = date.plusDays(1).atStartOfDay();

		List<AppointmentEntity> app = appointmentRepository.findByDoctorIdAndAppointmentDateAndStatusIn(
				doctorId, date, List.of(AppointmentStatus.PENDING, AppointmentStatus.SCHEDULED));

		List<SlotResponseDto> res = new ArrayList<>();

		for (DoctorAvailabilityResponseDto a : avail) {

			LocalTime slotStart = a.getStartTime();

			while (slotStart.plusMinutes(SLOT_DURATION_MINUTES).isBefore(a.getEndTime())
					|| slotStart.plusMinutes(SLOT_DURATION_MINUTES).equals(a.getEndTime())) {
				LocalTime slotEnd = slotStart.plusMinutes(SLOT_DURATION_MINUTES);

				final LocalTime currentSlotStart = slotStart;
				final LocalTime currentSlotEnd = slotEnd;

				boolean isAvailable = app.stream().noneMatch(
						ap -> currentSlotStart.isBefore(ap.getEndTime()) && currentSlotEnd.isAfter(ap.getStartTime()));

				res.add(new SlotResponseDto(slotStart, isAvailable));

				slotStart = slotEnd;
			}
		}

		return res;
	}

	@Override
	public HoldSlotResponseDto holdSlot(@Valid HoldSlotRequestDto req) {

		if (appointmentRepository.existsByDoctorIdAndAppointmentDateAndStartTimeAndEndTimeAndStatusIn(
				req.getDoctorId(), req.getDate(), req.getStartTime(), req.getEndTime(),
				List.of(AppointmentStatus.PENDING, AppointmentStatus.SCHEDULED))) {
			throw new RuntimeException("Slot already booked");
		}

		AppointmentEntity newAppointmentEntity = new AppointmentEntity();
		newAppointmentEntity.setAppointmentDate(req.getDate());
		newAppointmentEntity.setEndTime(req.getEndTime());
		newAppointmentEntity.setStartTime(req.getStartTime());
		newAppointmentEntity.setDoctor(doctorRepository.getReferenceById(req.getDoctorId()));
		newAppointmentEntity.setPatient(patientRepository.getReferenceById(req.getPatientId()));
		newAppointmentEntity.setAppointmentType(AppointmentType.valueOf(req.getAppointmentType().toUpperCase()));
		newAppointmentEntity.setStatus(AppointmentStatus.PENDING);

		appointmentRepository.save(newAppointmentEntity);
		return new HoldSlotResponseDto(newAppointmentEntity.getId(), newAppointmentEntity.getStatus().name());
	}

	@Override
	public boolean markAsScheduled(Long appointmentId) {

		AppointmentEntity appointmentEntity = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("No Such Appointment Found"));

		appointmentEntity.setStatus(AppointmentStatus.SCHEDULED);

		appointmentRepository.save(appointmentEntity);

		return true;
	}

	@Override
	public List<com.backend.dtos.AppointmentViewDTO> getUpcomingAppointments(Long patientId) {
		LocalDate today = LocalDate.now();
		LocalTime now = LocalTime.now();

		List<AppointmentEntity> appointments = appointmentRepository.findUpcomingAppointments(
				patientId,
				List.of(AppointmentStatus.SCHEDULED),
				today,
				now);

		List<com.backend.dtos.AppointmentViewDTO> appDtos = new ArrayList<>();
		for (AppointmentEntity app : appointments) {

			com.backend.dtos.AppointmentViewDTO dto = new com.backend.dtos.AppointmentViewDTO();
			dto.setAppointmentId(app.getId());
			dto.setPatientId(app.getPatient().getId());
			dto.setPatientName(app.getPatient().getUser().getName());
			dto.setDoctorId(app.getDoctor().getId());
			dto.setDoctorName(app.getDoctor().getUser().getName());
			dto.setAppointmentDate(app.getAppointmentDate());
			dto.setStartTime(app.getStartTime());

			appDtos.add(dto);
		}

		return appDtos;
	}

	@Override
	public List<com.backend.dtos.AppointmentViewDTO> getAppointmentsForDoctor(Long doctorId) {
		List<AppointmentEntity> appointments = appointmentRepository.findAllByDoctorId(doctorId);

		List<com.backend.dtos.AppointmentViewDTO> appDtos = new ArrayList<>();
		for (AppointmentEntity app : appointments) {
			com.backend.dtos.AppointmentViewDTO dto = new com.backend.dtos.AppointmentViewDTO();
			dto.setAppointmentId(app.getId());
			dto.setPatientId(app.getPatient().getId());
			dto.setPatientName(app.getPatient().getUser().getName());
			dto.setDoctorId(app.getDoctor().getId());
			dto.setDoctorName(app.getDoctor().getUser().getName());
			dto.setAppointmentDate(app.getAppointmentDate());
			dto.setStartTime(app.getStartTime());
			dto.setStatus(app.getStatus().name());
			dto.setAppointmentType(app.getAppointmentType().name());
			
			appDtos.add(dto);
		}
		return appDtos;
	}

	@Override
	public boolean cancelAppointment(Long appointmentId) {
		AppointmentEntity appointmentEntity = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("No Such Appointment Found"));
		appointmentEntity.setStatus(AppointmentStatus.CANCELLED);
		appointmentRepository.save(appointmentEntity);
		return true;
	}

	@Override
	public boolean completeAppointment(Long appointmentId) {
		AppointmentEntity appointmentEntity = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new RuntimeException("No Such Appointment Found"));
		appointmentEntity.setStatus(AppointmentStatus.COMPLETED);
		appointmentRepository.save(appointmentEntity);
		return true;
	}

}
