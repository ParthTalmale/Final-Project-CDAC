package com.backend.dtos;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAvailableRequestDto {
	
	@NotNull
	Long doctorId;
	@NotNull
	LocalDate date;

}
