package com.backend.entities;

import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "doctor_availability",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_doctor_availability",
            columnNames = {"doctor_id", "day_of_week", "start_time", "end_time"}
            
        )
    }
)
@Getter
@Setter
@AllArgsConstructor

public class DoctorAvailability extends BaseEntity{

   

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private DoctorEntity doctor;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false, length = 10)
    private WeekDay dayOfWeek;  
   

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

  
    public DoctorAvailability() {}

    public DoctorAvailability(DoctorEntity doctor , WeekDay dayOfWeek,
                              LocalTime startTime, LocalTime endTime) {
        this.doctor = doctor;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }


}
