package com.backend.entities;

import java.time.LocalDate;


import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users")
@AttributeOverride(name="id",column = @Column(name="user_id"))

@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = {"password"})
public class User extends BaseEntity{
	@Column(name="name",length = 30)
	private String name;

	private LocalDate dob;
	@Column(length = 50,unique = true)
	private String email;
	@Column(length = 400,nullable = false)
	private String password;
	@Column(length=14, unique = true)
	private String phone;

	@Enumerated(EnumType.STRING) 
	@Column(name="user_role")
	private UserRole userRole;
	
	@Column(name="is_active")
	private boolean isActive;

	@jakarta.persistence.OneToOne(mappedBy = "user")
	private PatientEntity patient;

	@jakarta.persistence.OneToOne(mappedBy = "user")
	private DoctorEntity doctor;

	@jakarta.persistence.OneToOne(mappedBy = "user")
	private Admin admin;
	

	public User(String name, LocalDate dob, String email, String password, String phone) {
		super();
		this.name = name;
		this.dob = dob;
		this.email = email;
		this.password = password;
		this.phone = phone;
		
		
	}
	
	

	
}
