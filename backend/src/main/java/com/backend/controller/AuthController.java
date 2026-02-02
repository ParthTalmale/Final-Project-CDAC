package com.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.JwtResponse;
import com.backend.dtos.LoginDto;
import com.backend.security.CustomUserDetails;
import com.backend.security.JwtUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private com.backend.service.UserService userService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginDto loginDto) {
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal(); // Cast to our custom implementation
        String jwt = jwtUtils.generateToken(userDetails);
        
        return ResponseEntity.ok(JwtResponse.builder()
                .token(jwt)
                .username(userDetails.getUsername())
                .role(userDetails.getUser().getUserRole().name())
                .name(userDetails.getUser().getName())
                .userId(userDetails.getUser().getId())
                .patientId(userDetails.getUser().getPatient() != null ? userDetails.getUser().getPatient().getId() : null)
                .doctorId(userDetails.getUser().getDoctor() != null ? userDetails.getUser().getDoctor().getId() : null)
                .adminId(userDetails.getUser().getAdmin() != null ? userDetails.getUser().getAdmin().getId() : null)
                .build());
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public ResponseEntity<com.backend.dtos.UserDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        return ResponseEntity.ok(com.backend.dtos.UserDto.builder()
                .id(userDetails.getUser().getId())
                .name(userDetails.getUser().getName())
                .email(userDetails.getUser().getEmail())
                .userRole(userDetails.getUser().getUserRole().name())
                .build());
    }



    // Public endpoint for patients
    @PostMapping("/register-patient")
    public ResponseEntity<com.backend.dtos.UserDto> registerPatient(@Valid @RequestBody com.backend.dtos.RegisterDto registerDto) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(userService.registerPatient(registerDto));
    }

    // Protected endpoint for Admins to register Staff (Doctor/Admin/Nurse)
    // SecurityConfig does NOT whitelist this, so it requires Authentication
    @PostMapping("/register-staff")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<com.backend.dtos.UserDto> registerStaff(@Valid @RequestBody com.backend.dtos.RegisterDto registerDto) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(userService.registerUser(registerDto));
    }
}
