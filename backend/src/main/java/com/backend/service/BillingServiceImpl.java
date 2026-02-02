package com.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.validator.internal.util.privilegedactions.LoadClass;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.backend.config.RazorpaySignatureUtil;
import com.backend.dtos.CreateOrderRequest;
import com.backend.dtos.CreateOrderResponse;
import com.backend.dtos.VerifyPaymentRequest;
import com.backend.entities.AppointmentEntity;
import com.backend.entities.Billing;
import com.backend.entities.PatientEntity;
import com.backend.entities.PaymentStatus;
import com.backend.repository.AppointmentRepository;
import com.backend.repository.BillingRepository;
import com.backend.repository.PatientRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import io.swagger.v3.core.util.Json;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {

	@Autowired
	private final BillingRepository billingRepository;
	@Autowired
	private final AppointmentRepository appointmentRepository;
	@Autowired
	private final PatientRepository patientRepository;
	@Autowired
	private final AppointmentService appointmentService;
	
	
	@Autowired 
	RazorpayClient razorpayClient;
	
	@Value("${razorpay.api.secret}")
	private String keySecret;
	

//	@Override
//	public CreateOrderResponse createOrder(CreateOrderRequest createOrderRequest) throws RazorpayException {
//		Billing billing = new Billing();
//		AppointmentEntity app = appointmentRepository.findById(createOrderRequest.getAppointmentId()).orElseThrow(()-> new RuntimeException("Appointment Id is invalid"));
//		
//		
//		
//		billing.setAppointment(app);
//		billing.setDoctorCharge(createOrderRequest.getAmount());
//		billing.setPaymentStatus(PaymentStatus.CREATED);
//		billing.setBillingDate(LocalDateTime.now());
//		
//	billing =	billingRepository.save(billing);
//		
//		JSONObject options = new JSONObject();
//		options.put("amount", createOrderRequest.getAmount());
//		options.put("currency","INR");
//		options.put("receipt", "txn_"+System.currentTimeMillis());
//		
//		Order order = razorpayClient.orders.create(options);
//		
//		billing.setRazorpayOrderId(order.get("id"));
//		billingRepository.save(billing);
//		
//		
//		
//		return new CreateOrderResponse(order.get("id"), order.get("amount"),order.get("currency"));
//	}

	@Override
	@Transactional(rollbackOn = RazorpayException.class)
	public CreateOrderResponse createOrder(CreateOrderRequest request) throws RazorpayException {

	    // 1️⃣ Validate appointment
	    AppointmentEntity appointment = appointmentRepository
	            .findById(request.getAppointmentId())
	            .orElseThrow(() -> new RuntimeException("Invalid appointment ID"));

	    Billing billing;

	    
	    try {
	        billing = billingRepository
	                .findByAppointmentId(request.getAppointmentId())
	                .orElseGet(() -> {
	                    Billing b = new Billing();
	                    b.setAppointment(appointment);
	                    b.setDoctorCharge(request.getAmount());
	                    b.setPaymentStatus(PaymentStatus.CREATED);
	                    b.setBillingDate(LocalDateTime.now());
	                    return billingRepository.save(b);
	                });
	    } catch (Exception ex) {
	        
	        billing = billingRepository
	                .findByAppointmentId(request.getAppointmentId())
	                .orElseThrow(() ->
	                        new RuntimeException("Billing creation failed"));
	    }

	    
	    if (billing.getRazorpayOrderId() != null) {
	        return new CreateOrderResponse(
	                billing.getRazorpayOrderId(),
	                billing.getDoctorCharge() * 100,
	                "INR"
	        );
	    }

	    // 4️⃣ Create Razorpay order (amount in paise)
	    JSONObject options = new JSONObject();
	    options.put("amount", billing.getDoctorCharge() * 100);
	    options.put("currency", "INR");
	    options.put("receipt", "txn_" + System.currentTimeMillis());

	    Order order = razorpayClient.orders.create(options);

	    // 5️⃣ Save Razorpay order ID
	    billing.setRazorpayOrderId(order.get("id"));
	    billingRepository.save(billing);
	    Number amount = (Number) order.get("amount");
	    System.out.println("Created Razorpay Order: " + order.toString());
	    return new CreateOrderResponse(
	            order.get("id"),
	            amount.doubleValue(),
	            order.get("currency")
	    );
	}



	@Override
	public boolean verifyPayment(@Valid VerifyPaymentRequest request) throws Exception  {
		
		System.out.println("Verifying payment for order ID: " + request.getRazorpay_order_id());
		boolean isValid = RazorpaySignatureUtil.verify(request.getRazorpay_order_id(), request.getRazorpay_payment_id(),request.getRazorpay_signature(),keySecret);
		
		if(!isValid) {
			Billing billing = billingRepository.findByRazorpayOrderId(request.getRazorpay_order_id());
			billing.setPaymentStatus(PaymentStatus.FAILED);
			return false;
		}
		
		Billing billing = billingRepository.findByRazorpayOrderId(request.getRazorpay_order_id());
		
		billing.setPaymentStatus(PaymentStatus.SUCCESS);
		
		appointmentService.markAsScheduled(request.getAppointmentId());
		
		
		billingRepository.save(billing);
		
		return true;
	}
	
}
