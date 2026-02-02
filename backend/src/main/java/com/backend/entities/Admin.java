package com.backend.entities;

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
@Table(name = "admin")
@AttributeOverride(name = "id",column = @Column(name="admin_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Admin extends BaseEntity{
	
	    @OneToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "user_id", nullable = false, unique = true)
	    private User user;
	 
	 
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "created_by_admin_id")
	    private Admin createdBy;
	

	
}
