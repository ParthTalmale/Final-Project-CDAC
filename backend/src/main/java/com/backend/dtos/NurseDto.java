package com.backend.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NurseDto {
	private String name;
    private String email;
    private String phone;

    private Long departmentId;

    // UI fields (currently not stored in DB)
    private String shift;
    private Integer experience;
    private String qualification;
    private String specialization;

    private boolean active;
}
