package com.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmergencyContactDto {
	private String name;
	private String relation;
	private String phone;
	private boolean primaryContact;
}
