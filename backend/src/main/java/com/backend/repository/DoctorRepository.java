package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.entities.DoctorAvailability;
import com.backend.entities.DoctorEntity;
import com.backend.entities.WeekDay;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorEntity,Long> {
	
	java.util.Optional<DoctorEntity> findByUser(com.backend.entities.User user);

	java.util.Optional<DoctorEntity> findByUserEmail(String email);

	// Filter by Department Name
	org.springframework.data.domain.Page<DoctorEntity> findByDepartment_DeptName(String deptName, org.springframework.data.domain.Pageable pageable);

	// Search by Name or Specialization
    @org.springframework.data.jpa.repository.Query("SELECT d FROM DoctorEntity d WHERE " +
            "LOWER(d.user.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(d.department.deptName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    org.springframework.data.domain.Page<DoctorEntity> searchDoctors(String keyword, org.springframework.data.domain.Pageable pageable);

    // Count for Dashboard
    long countByDepartment(com.backend.entities.Department department);

}
