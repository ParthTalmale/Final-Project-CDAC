package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.DiagnosticTest;

public interface DiagnosticTestRepository extends JpaRepository<DiagnosticTest,Long> {

}
