package com.backend.dtos;

import java.time.LocalTime;
import java.util.List;

import com.backend.entities.WeekDay;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAvailabilityRequest {
    
    @NotNull
    private Long doctorId;
    
    @NotNull
    private WeekDay dayOfWeek;
    
    @NotNull
    private List<LocalTime> timeSlots; // Start times of 30-min slots
}
