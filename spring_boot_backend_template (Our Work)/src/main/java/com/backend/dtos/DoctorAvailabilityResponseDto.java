package com.backend.dtos;

import java.time.LocalTime;

import io.micrometer.common.lang.NonNull;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DoctorAvailabilityResponseDto {

	@NotNull
	 private LocalTime startTime;
	@NotNull
	 private LocalTime endTime;
}
