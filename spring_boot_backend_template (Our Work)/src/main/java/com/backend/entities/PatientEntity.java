package com.backend.entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "patients" )
@AttributeOverride(name="id",column=@Column(name="patient_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatientEntity extends BaseEntity{
	    
	    @Column(name = "gender", length = 10)
	    private String gender;

	    @Column(name = "blood_group", length = 5)
	    private String bloodGroup;

	    @Column(name = "address", length = 255)
	    private String address;

	    @OneToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "user_id", nullable = false, unique = true)
	    private User user;
	    
}
