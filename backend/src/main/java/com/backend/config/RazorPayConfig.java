package com.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Configuration
public class RazorPayConfig {
	
	@Value("${razorpay.api.key}")
	private String keyId;
	@Value("${razorpay.api.secret}")
	private String keySecret;


    @Bean
    RazorpayClient razorPayClient() throws RazorpayException{
		return new RazorpayClient(keyId,keySecret);
	}
}
