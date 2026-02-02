package com.backend.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
	
	@NotNull
	@Min(1)
	private int amount;
	@NotBlank
	private String purpose;
	
	   @NotNull
	    private Long appointmentId;

	    @NotNull
	    private Long patientId;

}
