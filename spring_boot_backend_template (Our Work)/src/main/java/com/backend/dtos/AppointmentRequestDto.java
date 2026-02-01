package com.backend.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AppointmentRequestDto {
    private Long doctorId;
    private Long patientId;
    private LocalDate date;
    private LocalTime time;
    private String reason;
}
