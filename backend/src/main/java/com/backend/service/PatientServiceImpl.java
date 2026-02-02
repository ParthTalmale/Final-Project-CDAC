package com.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.repository.PatientRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {
	private final PatientRepository patientRepository;

	//Search Patient's - ALL --> ADMIN
	@Override
	public List<String> getAllPatientNames() {
		// TODO Auto-generated method stub
		return patientRepository.findAllPatientNames();
	}
}
