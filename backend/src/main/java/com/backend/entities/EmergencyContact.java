package com.backend.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "emergency_contact", uniqueConstraints = {
		@UniqueConstraint(
				
				columnNames = {
						"patient_id","is_primary"
				}
				
				)
		
})
@AttributeOverride(name = "id",column = @Column(name="emergency_contacts_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyContact extends BaseEntity {
	    @Column(name = "name", nullable = false, length = 100)
	    private String name;

	    @Column(name = "relation", nullable = false, length = 50)
	    private String relation;

	    @Column(name = "phone", nullable = false, length = 15)
	    private String phone;

	    @Column(name = "is_primary", nullable = false)
	    private boolean primaryContact;
	    
	    @ManyToOne
	    @JoinColumn(name="patient_id",nullable = false)
	    @JsonIgnore
	    private PatientEntity patient;

}
