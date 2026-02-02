package com.backend.dtos;

import java.time.LocalDate;

import com.backend.entities.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterDto {
    @NotBlank
    private String name;
    
    @NotNull
    private LocalDate dob;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String password;
    
    @NotBlank
    private String phone;
    
    @NotNull
    private UserRole userRole; // "ROLE_PATIENT", "ROLE_DOCTOR", etc.

    // Patient Fields
    private String gender;
    private String bloodGroup;
    private String address;

    // Doctor/Nurse Fields
    private Long departmentId;
    
    // Doctor Fields
    private String specialization;
    private String licenseNumber;
    private LocalDate dateOfJoining;
    private int yearsOfExperience;
    private double rating; // optional, can default to 0

    // Nurse Fields
    private String shift;
    private String qualification; // if needed
}
