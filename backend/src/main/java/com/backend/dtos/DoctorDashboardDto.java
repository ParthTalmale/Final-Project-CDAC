package com.backend.dtos;

import java.time.LocalDate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDashboardDto {
    private long totalPatients;
    private long todayTotalAppointments;
    private long todayRemainingAppointments;
    
    // Lists for tables
    private List<AppointmentDto> todaysSchedule;
    private List<MedicalRecordDto> recentReports;
}
