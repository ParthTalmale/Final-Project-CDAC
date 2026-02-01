package com.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionDto {
    private Long prescriptionId;
    private Long patientId;
    private String patientName;
    private String doctorName;
    private String notes;
    private LocalDateTime issuedAt;
}
