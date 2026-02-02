package com.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.CreateOrderRequest;
import com.backend.dtos.VerifyPaymentRequest;
import com.backend.service.BillingService;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class BillingController {
	
	@Autowired
	private final BillingService billingService;
	
	
	
	@PostMapping("/create-order")
	public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest createOrderRequest) throws RazorpayException
	{
		System.out.println("Create Order Request: " + createOrderRequest);
		return ResponseEntity.ok(billingService.createOrder(createOrderRequest));
		
	}
	
	
	@PostMapping("verify-order")
	public ResponseEntity<?> verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) throws Exception{
		boolean isValid = billingService.verifyPayment(request);
		
		if(isValid) {
			
			return ResponseEntity.ok("Payment Successfully done");
			
		}else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Payment Signature");
		}
	}
	
}
