package com.backend.service;


import com.backend.dtos.RegisterDto;
import com.backend.dtos.UserDto;

public interface UserService {
    UserDto registerUser(RegisterDto registerDto);
    UserDto registerPatient(RegisterDto registerDto);
    java.util.List<UserDto> getStaffMembers();
    com.backend.dtos.AdminDashboardStatsDto getAdminDashboardStats();
}
