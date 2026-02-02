package com.backend.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.entities.AppointmentEntity;
import com.backend.entities.AppointmentStatus;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {

	


	//gives latest appointment for patient
	@Query("""
	        SELECT MAX(a.appointmentDate)
	        FROM AppointmentEntity a
	        WHERE a.patient.id = :patientId
	    """)
	LocalDate findLastVisitDate(@Param("patientId") Long patientId);

	long countDistinctDoctorsByPatientId(Long patientId);

	long countByPatient_IdAndStatus(Long patientId, AppointmentStatus completed);

	

	


	List<AppointmentEntity> findByDoctorIdAndAppointmentDateAndStatusIn(Long doctorId, LocalDate date,
			List<AppointmentStatus> of);

	


	boolean existsByDoctorIdAndAppointmentDateAndStartTimeAndEndTimeAndStatusIn(Long doctorId, LocalDate date,
			LocalTime startTime, LocalTime endTime, List<AppointmentStatus> of);

    // Dashboard Stats
    @Query("SELECT COUNT(DISTINCT a.patient) FROM AppointmentEntity a WHERE a.doctor.id = :doctorId")
    long countDistinctPatientsByDoctorId(@Param("doctorId") Long doctorId);

    long countByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);

    long countByDoctorIdAndAppointmentDateAndStatus(Long doctorId, LocalDate date, AppointmentStatus status);
    
    List<AppointmentEntity> findByDoctorIdAndAppointmentDateOrderByStartTimeAsc(Long doctorId, LocalDate date);

    List<AppointmentEntity> findAllByDoctorId(Long doctorId);

    // Patient Flow
    List<AppointmentEntity> findByPatientId(Long patientId);
    
    List<AppointmentEntity> findByPatientIdAndStatus(Long patientId, AppointmentStatus status);
    
	@Query("SELECT a FROM AppointmentEntity a WHERE a.patient.id = :patientId AND a.status IN :statuses AND (a.appointmentDate > :date OR (a.appointmentDate = :date AND a.startTime > :time)) ORDER BY a.appointmentDate ASC, a.startTime ASC")
	List<AppointmentEntity> findUpcomingAppointments(@Param("patientId") Long patientId,
			@Param("statuses") List<AppointmentStatus> statuses, @Param("date") LocalDate date,
			@Param("time") LocalTime time);
}
