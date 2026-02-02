package com.backend.service;

import com.backend.dtos.CreateOrderRequest;
import com.backend.dtos.CreateOrderResponse;
import com.backend.dtos.VerifyPaymentRequest;
import com.razorpay.RazorpayException;

import jakarta.validation.Valid;

public interface BillingService {

	CreateOrderResponse createOrder(CreateOrderRequest createOrderRequest) throws RazorpayException;

	boolean verifyPayment(@Valid VerifyPaymentRequest request) throws Exception;

}
