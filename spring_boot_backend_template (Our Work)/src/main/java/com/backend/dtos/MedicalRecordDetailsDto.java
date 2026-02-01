package com.backend.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import com.backend.entities.*;

import lombok.Getter;

@Getter
public class MedicalRecordDetailsDto {

    private Long recordId;
    private String fileName;
    private String recordType;
    private String patientName;
    private String doctorName;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String description;
    private AppointmentStatus status;

    public MedicalRecordDetailsDto(
            Long recordId,
            String fileName,
            String recordType,
            String patientName,
            String doctorName,
            LocalDate appointmentDate,
            LocalTime startTime,
            LocalTime endTime,
            String description,
            AppointmentStatus status
    ) {
        this.recordId = recordId;
        this.fileName = fileName;
        this.recordType = recordType;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.appointmentDate = appointmentDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.description = description;
        this.status = status;
    }

}
