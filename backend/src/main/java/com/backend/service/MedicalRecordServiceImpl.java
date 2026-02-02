package com.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.backend.controller.PatientController;
import com.backend.dtos.MedicalRecordDetailsDto;
import com.backend.dtos.MedicalRecordDto;
import com.backend.dtos.MedicalRecordResponseDTO;
import com.backend.entities.AppointmentEntity;
import com.backend.entities.DoctorEntity;
import com.backend.entities.MedicalRecordEntity;
import com.backend.repository.AppointmentRepository;
import com.backend.repository.MedicalRecordRepository;
import com.backend.repository.PrescriptionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    // private final PatientController patientController; // Removed circular dependency
	
	private final MedicalRecordRepository medicalRecordRepository;
	
	private final PrescriptionRepository prescriptionRepository;
	
	private final AppointmentRepository appointmentRepository;


    @Override
	public List<MedicalRecordDto> getRecordsByPatientId(Long patientId) {
		return medicalRecordRepository.findByAppointment_Patient_Id(patientId).stream()
				.map(record -> new MedicalRecordDto(
                        record.getId(),
                        record.getRecordType(),
                        record.getFileName()
                ))
				.collect(java.util.stream.Collectors.toList());
	}


	@Override
	public List<MedicalRecordResponseDTO> searchRecordsByDoctorName(String name) {
		// TODO Auto-generated method stub
		return medicalRecordRepository.findRecordsByDoctorName(name)
						.stream()
						.map(mr -> new MedicalRecordResponseDTO(
								mr.getId(),
								mr.getRecordType(),
								mr.getFileName()
								))
						.toList();
	}

	@Override
	public Page<MedicalRecordDto> getMedicalRecordsByPrescription(Long prescriptionId, int page) {
		// TODO Auto-generated method stub
		
		Long appointmentId = prescriptionRepository
                .findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Prescription not found"))
                .getAppointment()
                .getId();

        // 2️⃣ Page size fixed to 2
        Pageable pageable = PageRequest.of(page, 2);

        // 3️⃣ Fetch records
        Page<MedicalRecordEntity> records =
                medicalRecordRepository.findByAppointmentId(appointmentId, pageable);

        // 4️⃣ Convert Entity → DTO
        return records.map(record ->
                new MedicalRecordDto(
                        record.getId(),
                        record.getRecordType(),
                        record.getFileName()
                )
        );
	}

	//Add medical record --> ADMIN
	@Override
	public void saveMedicalRecord(Long appointmentId, String recordType, MultipartFile file) {
		// TODO Auto-generated method stub
		
		if(file == null || file.isEmpty()) {
			throw new RuntimeException("Uploaded file is empty");
		}
		
		AppointmentEntity appointmentEntity = appointmentRepository.findById(appointmentId)
																   .orElseThrow(() -> new RuntimeException("Appointment not found!"));
		
		try {
			
			MedicalRecordEntity medicalRecordEntity = new MedicalRecordEntity();
			
			medicalRecordEntity.setAppointment(appointmentEntity);
			medicalRecordEntity.setRecordType(recordType);
			medicalRecordEntity.setFileName(file.getOriginalFilename());
			medicalRecordEntity.setFileData(file.getBytes());
			
			medicalRecordRepository.save(medicalRecordEntity);
			
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			throw new RuntimeException("File upload failed" + e.getMessage(), e);
		}
	}
	
	//Search Medical Records by patient, doctor or title --> ADMIN
	@Override
	public List<MedicalRecordEntity> searchMedicalRecords(String patientName, String doctorName, String recordType) {
		// TODO Auto-generated method stub
				
		return medicalRecordRepository.searchRecords(patientName, doctorName, recordType);
	}

	//Search Patient's - ALL TYPES (UI) --> ADMIN
	@Override
	public List<String> getAllRecordTypes() {
		// TODO Auto-generated method stub
		return medicalRecordRepository.findAllRecordTypes();
	}

	//Get Particular Medical Records to be shown on UI after clicking --> ADMIN
	@Override
	public MedicalRecordDetailsDto getMedicalRecordDetails(Long id) {
		// TODO Auto-generated method stub
		return medicalRecordRepository.findRecordDetails(id)
									  .orElseThrow(() -> new RuntimeException("Medical Record not found with Id : " + id));
	}

    @Override
    public MedicalRecordEntity getFile(Long id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical Record not found with Id : " + id));
    }
}
