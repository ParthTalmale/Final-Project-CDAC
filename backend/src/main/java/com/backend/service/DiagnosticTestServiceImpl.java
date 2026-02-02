package com.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.repository.DiagnosticTestRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class DiagnosticTestServiceImpl implements DiagnosticTestService {
	
	@Autowired
	private final DiagnosticTestRepository diagnosticTestRepository;

}
