package com.backend.entities;

import java.time.LocalDate;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "patient_insurance")
@AttributeOverride(name = "id",column = @Column(name="insurance_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceEntity extends BaseEntity{
	
	
	@ManyToOne
	@JoinColumn(name="patient_id",nullable = false)
	private PatientEntity patient;
	@Column(name = "provider_name",nullable = false,length = 100)
	private String providerName;
	@Column(name="policy_number",nullable = false,length = 50)
	private int policyNumber;
	@Column(name="policy_type",nullable = false,length = 50)
	private String policyType;
	@Column(name = "coverage_percentage",nullable = false)
	private int coveragePercentage;
	@Column(name = "valid_from", nullable = false)
	private LocalDate validFrom;
	  @Column(name = "valid_to")
	private LocalDate validTo;
	  @Column(name = "is_active", nullable = false)
	private boolean isActive;  

	
}
