package com.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentStatDto {
    private String deptName;
    private long doctorCount;
    private long nurseCount;
    
    public long getTotalStaff() {
        return doctorCount + nurseCount;
    }
}
