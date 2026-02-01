package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.entities.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

}
