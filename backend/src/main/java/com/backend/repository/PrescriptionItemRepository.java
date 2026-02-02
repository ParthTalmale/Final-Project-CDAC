package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.PrescriptionItem;

public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Long> {

	List<PrescriptionItem> findByPrescriptionId(Long prescriptionId);

}
