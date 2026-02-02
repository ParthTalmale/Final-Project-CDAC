package com.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CreateOrderResponse {
	
	private String orderId;
	private double amount;
	private String currency;

}
