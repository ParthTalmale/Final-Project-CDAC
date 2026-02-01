package com.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
    private String token;
    private String role;
    private String username;
    private String name;
    private Long userId;
    private Long patientId;
    private Long doctorId;
    private Long adminId;
}
