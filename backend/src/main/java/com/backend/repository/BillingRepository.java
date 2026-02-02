package com.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.AppointmentEntity;
import com.backend.entities.Billing;

public interface BillingRepository extends JpaRepository<Billing, Long> {

	Billing findByRazorpayOrderId(String razorpay_order_id);

	Optional<Billing> findByAppointmentId(Long appointmentId);

}
