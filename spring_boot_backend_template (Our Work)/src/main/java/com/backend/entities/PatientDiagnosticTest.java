package com.backend.entities;

import java.time.LocalDate;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name="patient_diagnostic_test")
@AttributeOverride(name = "id",column = @Column(name="patient_test_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PatientDiagnosticTest extends BaseEntity {
	
	@ManyToOne
	@JoinColumn(name = "patient_id",nullable = false)
	private PatientEntity patient;
	
	@ManyToOne
	@JoinColumn(name = "doctor_id",nullable = false)
	private DoctorEntity doctor;
	@ManyToOne
	@JoinColumn(name = "appointment_id",nullable = false)
	private AppointmentEntity appointment;
	
	 @Column(name = "test_date", nullable = false)
	    private LocalDate testDate;

	 @Column(name = "result", columnDefinition = "TEXT")
	    private String result;

	    @Enumerated(EnumType.STRING)
	    @Column(name = "status", nullable = false, length = 20)
	    private DiagnosticTestStatus status;

	 @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "test_id", nullable = false)
	    private DiagnosticTest diagnosticTest;
	
	
	
	
	
	

}
