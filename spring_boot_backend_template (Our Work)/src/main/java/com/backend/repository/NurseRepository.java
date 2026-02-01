package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.entities.NurseEntity;

@Repository
public interface NurseRepository extends JpaRepository<NurseEntity,Long> {

	java.util.Optional<NurseEntity> findByUser(com.backend.entities.User user);

	//Get Nurse according to Departments --> ADMIN (NURSES)
	List<NurseEntity> findByDepartment_Id(Long departmentId);

	
	//Get Nurse is Active or Inactive --> ADMIN (NURSES)
	List<NurseEntity> findByUser_IsActive(boolean isActive);


	//Search Nurse By Name, Department
	@Query("""
	        SELECT n FROM NurseEntity n
	        WHERE LOWER(n.user.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
	           OR LOWER(n.department.deptName) LIKE LOWER(CONCAT('%', :keyword, '%'))
	    """)
	List<NurseEntity> searchNurses(@Param("keyword") String keyword);

    // Count for Dashboard
    long countByDepartment(com.backend.entities.Department department);

}
