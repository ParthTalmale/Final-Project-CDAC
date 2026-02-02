package com.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.service.DiagnosticTestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("diag_test")
@RequiredArgsConstructor
public class DiagnosticTestController {

	@Autowired
	private final DiagnosticTestService diagnosticTestService;
}
