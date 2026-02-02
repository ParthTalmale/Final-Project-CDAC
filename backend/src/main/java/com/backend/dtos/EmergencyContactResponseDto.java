package com.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmergencyContactResponseDto {
	private Long id;
    private String name;
    private String relation;
    private String phone;
    private boolean primaryContact;
    private Long patientId;
}
