package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.backend.entities.PatientEntity;

@Repository
public interface PatientRepository extends JpaRepository<PatientEntity,Long> {

	//Search Patient's - ALL (UI) --> ADMIN
	@Query("""
	        SELECT u.name
	        FROM PatientEntity p
	        JOIN p.user u
	        WHERE u.isActive = true
	    """)
	List<String> findAllPatientNames();

	java.util.Optional<PatientEntity> findByUser(com.backend.entities.User user);
	
	@Query("SELECT p FROM PatientEntity p JOIN p.user u WHERE u.email = :email")
	java.util.Optional<PatientEntity> findByUserEmail(@org.springframework.data.repository.query.Param("email") String email);
}
