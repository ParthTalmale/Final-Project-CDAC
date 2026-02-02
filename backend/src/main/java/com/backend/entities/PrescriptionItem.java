package com.backend.entities;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "prescription_item")
@AttributeOverride(name = "id",column = @Column(name="item_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionItem extends BaseEntity {

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(name = "medicine_name", nullable = false, length = 100)
    private String medicineName;

    @Column(name = "dosage", nullable = false, length = 50)
    private String dosage;
    

    @Column(name = "frequency", nullable = false, length = 50)
    private String frequency;
   

    @Column(name = "duration", nullable = false, length = 50)
    private String duration;
    

    @Column(name = "instructions", length = 255)
    private String instructions;


}