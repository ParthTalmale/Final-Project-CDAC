package com.backend.entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@Entity
@Table(name = "medical_record")
@AttributeOverride(name = "id",column = @Column(name="medical_record_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MedicalRecordEntity extends BaseEntity {
	

	
	@ManyToOne
	@JoinColumn(name = "appointment_id")
	private AppointmentEntity appointment;
	
	@Column(name = "record_type", nullable = false, length = 50)
    private String recordType; 
	
	@Column(name = "file_name", nullable = false)
    private String fileName;
	
	@Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "file_data", nullable = false)
    private byte[] fileData;
	
	
	
	

}
