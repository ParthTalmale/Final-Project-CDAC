package com.backend.dtos;

import java.time.LocalTime;
import com.backend.entities.WeekDay;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WeeklyAvailabilityDto {
    private WeekDay dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
}
