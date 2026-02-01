package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entities.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    
    java.util.Optional<Admin> findByUser(com.backend.entities.User user);
}
