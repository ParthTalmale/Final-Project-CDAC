package com.backend.entities;

import java.time.LocalDate;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "nurses")
@AttributeOverride(name = "id",column = @Column(name="nurse_id"))
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NurseEntity extends BaseEntity{
	
	@OneToOne
	@JoinColumn(name = "user_id",nullable = false,unique = true)
	private User user;
	
	@Column(name="date_of_joining")
	private LocalDate dateOfJoining;
	
	@ManyToOne
	@JoinColumn(name = "department_id")
	private Department department;
	
}
