package com.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.repository.InsuranceRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class InsuranceServiceImpl implements InsuranceService {

	@Autowired
	private final InsuranceRepository insuranceRepository;
}
