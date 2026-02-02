package com.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MedicalRecordDto {
	private Long id;
    private String recordType;
    private String fileName;
}
