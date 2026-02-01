package com.backend.dtos;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentStaffDto {
    private String name;
    private String role; // "Doctor" or "Nurse"
    private LocalDate joinDate; // derived from createdOn
    private String action; // "Added" (Default)
}
