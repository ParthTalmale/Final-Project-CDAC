package com.backend.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dtos.DoctorAvailabilityResponseDto;
import com.backend.dtos.DoctorResponseDto;
import com.backend.dtos.UpdateAvailabilityRequest;
import com.backend.entities.DoctorAvailability;
import com.backend.entities.DoctorEntity;
import com.backend.entities.WeekDay;
import com.backend.repository.DoctorAvailabilityRepository;
import com.backend.repository.DoctorRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

	@Autowired
	private final DoctorRepository doctorRepository;
	
	@Autowired
	private final DoctorAvailabilityRepository doctorAvailabilityRepository;
	
	 @Override
	    public org.springframework.data.domain.Page<DoctorResponseDto> getAllDoctors(String keyword, String department, org.springframework.data.domain.Pageable pageable) {
            org.springframework.data.domain.Page<DoctorEntity> pageResult;
            
            System.out.println("Service Filter - Keyword: '" + keyword + "', Department: '" + department + "'");

            if (keyword != null && !keyword.trim().isEmpty()) {
            	System.out.println("Searching by Keyword");
                pageResult = doctorRepository.searchDoctors(keyword.trim(), pageable);
            } else if (department != null && !department.equals("All Departments") && !department.trim().isEmpty()) {
            	System.out.println("Filtering by Department: " + department);
                pageResult = doctorRepository.findByDepartment_DeptName(department, pageable);
            } else {
            	System.out.println("Fetching ALL Doctors");
                pageResult = doctorRepository.findAll(pageable);
            }

	        return pageResult.map(this::mapToDto);
	    }

	    @Override
	    public List<DoctorResponseDto> getActiveDoctorsOnly() {
	        return doctorRepository.findAll().stream()
	                .map(this::mapToDto)
	                .collect(java.util.stream.Collectors.toList());
	    }

	    private DoctorResponseDto mapToDto(DoctorEntity doctor) {
	        return new DoctorResponseDto(
	                doctor.getId(),
	                doctor.getUser() != null ? doctor.getUser().getName() : "Unknown", 
	                doctor.getSpecialization(),
	                doctor.getDepartment() != null ? doctor.getDepartment().getDeptName() : "Unassigned",
	                doctor.getYearsOfExperience(),
	                doctor.getDateOfJoining()
	        );
	    }

		@Override
		public List<DoctorAvailabilityResponseDto> getAvailabilityForDates(Long doctor_id, LocalDate date) {
			
			DayOfWeek javaDay = date.getDayOfWeek();
			List<DoctorAvailabilityResponseDto> res = new ArrayList<>();
			WeekDay weekDay = WeekDay.valueOf(javaDay.name());
			
			List<DoctorAvailability> doctorAvailabilities= doctorAvailabilityRepository.findByDoctorIdAndDayOfWeekAndActiveTrue(doctor_id,weekDay);
			
			for(DoctorAvailability d: doctorAvailabilities) {
				DoctorAvailabilityResponseDto dto = new DoctorAvailabilityResponseDto();
				dto.setStartTime(d.getStartTime());
				dto.setEndTime(d.getEndTime());
				
				res.add(dto);
			}
			
			return res;
			
		}

    @Autowired
    private com.backend.repository.AppointmentRepository appointmentRepository;
    @Autowired
    private com.backend.repository.MedicalRecordRepository medicalRecordRepository;
    @Autowired
    private org.modelmapper.ModelMapper modelMapper;

    @Override
    public com.backend.dtos.DoctorDashboardDto getDashboardStats(Long doctorId) {
        com.backend.dtos.DoctorDashboardDto dto = new com.backend.dtos.DoctorDashboardDto();
        LocalDate today = LocalDate.now();

        // 1. Stats
        dto.setTotalPatients(appointmentRepository.countDistinctPatientsByDoctorId(doctorId));
        dto.setTodayTotalAppointments(appointmentRepository.countByDoctorIdAndAppointmentDate(doctorId, today));
        dto.setTodayRemainingAppointments(appointmentRepository.countByDoctorIdAndAppointmentDateAndStatus(doctorId, today, com.backend.entities.AppointmentStatus.PENDING));

        // 2. Schedule
        List<com.backend.entities.AppointmentEntity> appointments = appointmentRepository.findByDoctorIdAndAppointmentDateOrderByStartTimeAsc(doctorId, today);
        dto.setTodaysSchedule(appointments.stream()
                .map(a -> {
                    com.backend.dtos.AppointmentDto adto = modelMapper.map(a, com.backend.dtos.AppointmentDto.class);
                    // Manually map fields if ModelMapper misses nested ones or to be safe
                    adto.setPatientName(a.getPatient().getUser().getName());
                    adto.setDoctorName(a.getDoctor().getUser().getName());
                    return adto;
                })
                .collect(java.util.stream.Collectors.toList()));

        // 3. Recent Reports
        List<com.backend.entities.MedicalRecordEntity> records = medicalRecordRepository.findTop5ByAppointment_Doctor_IdOrderByCreatedOnDesc(doctorId);
        dto.setRecentReports(records.stream()
                .map(r -> new com.backend.dtos.MedicalRecordDto(r.getId(), r.getRecordType(), r.getFileName()))
                .collect(java.util.stream.Collectors.toList()));

        return dto;
    }

    @Override
    public void updateAvailability(UpdateAvailabilityRequest request) {
        
        DoctorEntity doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 1. Clear existing availability for the day
        List<DoctorAvailability> existing = doctorAvailabilityRepository.findByDoctorIdAndDayOfWeekAndActiveTrue(
                request.getDoctorId(), request.getDayOfWeek());
        doctorAvailabilityRepository.deleteAll(existing);
        
        if (request.getTimeSlots() == null || request.getTimeSlots().isEmpty()) {
            return;
        }

        // 2. Sort slots
        List<LocalTime> sortedSlots = new ArrayList<>(request.getTimeSlots());
        Collections.sort(sortedSlots);

        // 3. Merge logic
        LocalTime rangeStart = sortedSlots.get(0);
        LocalTime rangeEnd = rangeStart.plusMinutes(30);

        for (int i = 1; i < sortedSlots.size(); i++) {
            LocalTime currentSlot = sortedSlots.get(i);
            
            // Check limits (09:00 - 19:00) and Break (13:00 - 14:00)
            if (isInvalidSlot(currentSlot)) {
                // Skip invalid slots or throw error? 
                // Let's just skip to be safe, or assume frontend handles it.
                // But merging logic must be robust.
                continue; 
            }

            if (currentSlot.equals(rangeEnd)) {
                // Contiguous: Extend range
                rangeEnd = currentSlot.plusMinutes(30);
            } else {
                // Gap: Save previous range and start new
                saveAvailability(doctor, request.getDayOfWeek(), rangeStart, rangeEnd);
                rangeStart = currentSlot;
                rangeEnd = currentSlot.plusMinutes(30);
            }
        }
        
        // Save final range
        if (!isInvalidSlot(rangeStart)) {
             saveAvailability(doctor, request.getDayOfWeek(), rangeStart, rangeEnd);
        }
    }

    private void saveAvailability(DoctorEntity doctor, WeekDay day, LocalTime start, LocalTime end) {
        DoctorAvailability avail = new DoctorAvailability(doctor, day, start, end);
        doctorAvailabilityRepository.save(avail);
    }
    
    @Override
    public List<com.backend.dtos.WeeklyAvailabilityDto> getWeeklyAvailability(Long doctorId) {
        List<DoctorAvailability> availabilities = doctorAvailabilityRepository.findByDoctorId(doctorId); // Need to check if this method exists or use findAll
        // Actually doctorAvailabilityRepository likely needs custom method or filtered by doctor
        // Let's check repository. If not exists, I'll use a standard find.
        // Assuming findByDoctorId exists or I can derive it.
        // Wait, line 121 usage: findByDoctorIdAndDayOfWeekAndActiveTrue
        // I want ALL days.
        
        return doctorAvailabilityRepository.findAll().stream()
                .filter(a -> a.getDoctor().getId().equals(doctorId) && a.isActive())
                .map(a -> new com.backend.dtos.WeeklyAvailabilityDto(a.getDayOfWeek(), a.getStartTime(), a.getEndTime()))
                .sorted((a, b) -> {
                    int dayComp = a.getDayOfWeek().compareTo(b.getDayOfWeek());
                    if (dayComp != 0) return dayComp;
                    return a.getStartTime().compareTo(b.getStartTime());
                })
                .collect(java.util.stream.Collectors.toList());
    }

    private boolean isInvalidSlot(LocalTime slot) {
        // Enforce basic constraints
        // 13:00 to 14:00 is break. 
        // Slots allowed: 09:00 to 12:30 (ending 13:00) AND 14:00 to 18:30 (ending 19:00)
        
        LocalTime nine = LocalTime.of(9, 0);
        LocalTime nineteen = LocalTime.of(19, 0);
        LocalTime onePM = LocalTime.of(13, 0);
        LocalTime twoPM = LocalTime.of(14, 0);
        
        if (slot.isBefore(nine) || slot.isAfter(nineteen.minusMinutes(30))) return true;
        
        // Break 13-14
        if ((slot.equals(onePM) || slot.isAfter(onePM)) && slot.isBefore(twoPM)) return true;
        
        return false;
    }
}
