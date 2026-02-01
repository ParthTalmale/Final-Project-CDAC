package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.entities.EmergencyContact;

public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {

	@Modifying
    @Query("""
        UPDATE EmergencyContact e
        SET e.primaryContact = false
        WHERE e.patient.id = :patientId
          AND e.primaryContact = true
    """)
	
	void unSetPrimaryForPatient(@Param("patientId") Long patientId);

	List<EmergencyContact> findByPatientId(Long patientId);

}
