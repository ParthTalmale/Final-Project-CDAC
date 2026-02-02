package com.backend.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "department")
@Getter
@Setter
@AttributeOverride(name = "id",column = @Column(name="department_id"))
public class Department extends BaseEntity{
	
	@Column(name = "department_name")
	private String deptName;
	
	@OneToOne
	@JoinColumn(name = "head_id")
	private DoctorEntity head;

}
