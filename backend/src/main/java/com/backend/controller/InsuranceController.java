package com.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.service.InsuranceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/insurance")
@RequiredArgsConstructor
public class InsuranceController {
	
	@Autowired
	private final InsuranceService insuranceService;
	

}
