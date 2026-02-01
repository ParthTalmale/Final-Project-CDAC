package com.backend.entities;


	

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(
    name = "appointment",
    indexes = {
        @Index(name = "idx_appointment_date", columnList = "appointment_date"),
        @Index(name = "idx_doctor_date", columnList = "doctor_id, appointment_date")
    }
    ,
   // uniqueConstraints = @UniqueConstraint(
    //		columnNames = {"start_time","end_time"}
    //		)
    uniqueConstraints = @UniqueConstraint(
    	    columnNames = {"doctor_id", "appointment_date", "start_time"}
    	)
    	// This prevents exact duplicate bookings, nothing more. Overlap logic → SERVICE LAYER (mandatory) before saving an appointment.
)

@AttributeOverride(name = "id",column = @Column(name="appointment_id"))
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

@ToString
public class AppointmentEntity extends BaseEntity {

 

    // one patient can have many appointments
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientEntity patient;

    // one doctor can have many appointments
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private DoctorEntity doctor;

    // appointment date
    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    // time slot
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    // Appointment lifecycle
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AppointmentStatus status;

    // Optional reason / notes
    @Column(name = "reason", length = 255,nullable = true)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name="appointment_type")
    private AppointmentType appointmentType;
    
    // ---------- Constructors ----------
   

}
