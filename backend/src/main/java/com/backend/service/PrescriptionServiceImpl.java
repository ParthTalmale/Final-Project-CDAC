package com.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.backend.dtos.MedicalRecordDto;
import com.backend.entities.PrescriptionItem;
import com.backend.repository.PrescriptionItemRepository;
import com.backend.repository.PrescriptionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {
	
	private final PrescriptionRepository prescriptionRepository;
	
	private final PrescriptionItemRepository prescriptionItemRepository;

    private final com.backend.repository.DoctorRepository doctorRepository;
    
    @Autowired
    private final com.backend.repository.AppointmentRepository appointmentRepository; // Redundant declaration fix? No, need to verify imports.

	@Override
    public long countActivePrescriptions(Long patientId) {

        LocalDate today = LocalDate.now();

        return prescriptionRepository.findByPatientId(patientId)
                .stream()
                .filter(prescription -> {

                    List<PrescriptionItem> items =
                            prescriptionItemRepository
                                    .findByPrescriptionId(prescription.getId());

                    int maxDays = items.stream()
                            .mapToInt(item -> extractDays(item.getDuration()))
                            .max()
                            .orElse(0);

                    LocalDate expiryDate =
                            prescription.getIssuedAt()
                                    .toLocalDate()
                                    .plusDays(maxDays);

                    return !expiryDate.isBefore(today);
                })
                .count();
    }

    private int extractDays(String duration) {
        return Integer.parseInt(duration.split(" ")[0]);
    }



    @Override
    public List<com.backend.dtos.PrescriptionDto> getPrescriptionsByDoctor(String doctorEmail) {
        com.backend.entities.DoctorEntity doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return prescriptionRepository.findByDoctorId(doctor.getId()).stream()
                .map(p -> new com.backend.dtos.PrescriptionDto(
                        p.getId(),
                        p.getPatient().getId(),
                        p.getPatient().getUser().getName(),
                        p.getDoctor().getUser().getName(),
                        p.getNotes(),
                        p.getIssuedAt()
                ))
                .collect(java.util.stream.Collectors.toList());
    }



    @Override
    public void createPrescription(com.backend.dtos.PrescriptionRequestDto request) {
        com.backend.entities.AppointmentEntity appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        com.backend.entities.Prescription prescription = new com.backend.entities.Prescription();
        prescription.setAppointment(appointment);
        prescription.setDoctor(appointment.getDoctor());
        prescription.setPatient(appointment.getPatient());
        prescription.setNotes(request.getNotes());
        prescription.setIssuedAt(java.time.LocalDateTime.now());
        
        prescriptionRepository.save(prescription);
    }

	@Override
	public List<com.backend.dtos.PrescriptionDto> getPrescriptionsByPatientId(Long patientId) {
		return prescriptionRepository.findByPatientId(patientId).stream()
				.map(p -> new com.backend.dtos.PrescriptionDto(
                        p.getId(),
                        p.getPatient().getId(),
                        p.getPatient().getUser().getName(),
                        p.getDoctor().getUser().getName(),
                        p.getNotes(),
                        p.getIssuedAt()
                ))
				.collect(java.util.stream.Collectors.toList());
	}
}
