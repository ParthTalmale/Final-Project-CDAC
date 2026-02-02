package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.InsuranceEntity;

public interface InsuranceRepository extends JpaRepository<InsuranceEntity,Long> {

}
