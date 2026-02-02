package com.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.entities.Department;
import com.backend.service.DepartmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {


	private final DepartmentService departmentService;

	
	//Get All Departments --> ADMIN (NURSES)
//	@GetMapping(value = "/search-nurse")
	@GetMapping
	public List<Department> getAllDepartments(){
		return departmentService.getAllDepartments();
	}
}
