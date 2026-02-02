package com.backend.entities;

import java.time.LocalDateTime;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "billing")
@AttributeOverride(name = "id",column = @Column(name="billing_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Billing extends BaseEntity { 
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private AppointmentEntity appointment;

    // Optional insurance (used only if billingMode = INSURANCE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insurance_id")
    private InsuranceEntity insurance;

    @Column(name = "doctor_charge", nullable = false)
    private double doctorCharge;

    @Column(name = "test_charge", nullable = false)
    private double testCharge;

    @Column(name = "discount")
    private double discount;

    @Column(name = "final_amount", nullable = false)
    private double finalAmount;
    
    @Column(name="razor_pay_order_id")
    private String razorpayOrderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "billing_mode", length = 20)
    private BillingMode billingMode;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus; 

    @Column(name = "billing_date", nullable = false)
    private LocalDateTime billingDate = LocalDateTime.now();

   
}