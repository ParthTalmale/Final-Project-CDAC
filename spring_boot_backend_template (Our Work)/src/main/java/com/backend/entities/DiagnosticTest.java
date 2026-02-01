package com.backend.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "diagnostic_test")
@AttributeOverride(name = "id",column = @Column(name="test_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DiagnosticTest extends BaseEntity {
	
	@Column(name="test_name",nullable = false,length = 100)
	private String testName;
	@Column(name = "test_type",length = 50)
	private String testType;
	@Column(name = "standard_cost",nullable = false)
	private double standardCost;
	@Column(name = "description",length = 255)
	private String description;
	
	

}
