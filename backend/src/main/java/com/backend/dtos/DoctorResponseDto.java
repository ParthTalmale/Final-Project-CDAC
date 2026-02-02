package com.backend.dtos;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorResponseDto {

    private Long doctorId;
    private String name;
    private String specialization;
    private String departmentName;
    private int yearsOfExperience;
    private LocalDate dateOfJoining;
}