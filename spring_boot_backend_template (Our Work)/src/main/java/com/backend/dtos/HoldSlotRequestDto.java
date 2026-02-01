package com.backend.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HoldSlotRequestDto {
	
	@NotNull
	private Long doctorId;
	@NotNull
	private Long patientId;
	@NotNull
	private LocalDate date;
	@NotNull
	private LocalTime startTime;
	@NotNull
	private LocalTime endTime;
	@NotNull
	private String appointmentType;

}
