package com.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

	Optional<User> findByEmail(String email);

    // Recent Staff
    java.util.List<User> findTop4ByUserRoleInOrderByCreatedOnDesc(java.util.Collection<com.backend.entities.UserRole> roles);

}
