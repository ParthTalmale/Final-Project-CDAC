package com.backend.entities;

import java.time.LocalDate;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "doctors")
@AttributeOverride(name = "id",column = @Column(name="doctor_id"))

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"department"})
public class DoctorEntity extends BaseEntity {
	

	    @Column(name = "specialization", nullable = false, length = 100)
	    private String specialization;

	    @Column(name = "license_number", nullable = false, length = 50,unique = true)
	    private String licenseNumber;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "department_id", nullable = false)
	    private Department department;

	    @Column(name = "date_of_joining")
	    private LocalDate dateOfJoining;
	    
	    @Column(name = "years_of_experience")
	    private int yearsOfExperience;

	    @Column(name="rating")
	    private Double rating;
	    
	    @OneToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "user_id", nullable = false, unique = true)
	    private User user;

	
	

}
