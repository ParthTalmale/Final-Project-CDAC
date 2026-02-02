package com.backend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                    @NonNull HttpServletResponse response, 
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
            
            
            //open the Register Staff endpoint to have atleast 1 admin
            
        //String path = request.getRequestURI();

	//if (
    	//	path.equals("/api/auth/login") ||
    	//	path.equals("/api/auth/register-patient") ||
    	//	path.equals("/api/auth/register-staff")
	//) {
    	//filterChain.doFilter(request, response);
    	//return;
	//}
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        
        System.out.println("JwtAuthFilter: Processing request for " + request.getRequestURI());

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("JwtAuthFilter: WARNING - No valid header found!");
            System.out.println("JwtAuthFilter: Header Value: " + (authHeader == null ? "NULL" : authHeader));
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        System.out.println("JwtAuthFilter: Token Extracted: " + jwt.substring(0, Math.min(jwt.length(), 10)) + "...");
        try {
            userEmail = jwtUtils.extractUsername(jwt);
            System.out.println("JwtAuthFilter: Checking token for user: " + userEmail);
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                
                if (jwtUtils.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("JwtAuthFilter: Authenticated user " + userEmail);
                }
            }
        } catch (Exception e) {
            System.out.println("JwtAuthFilter: Error " + e.getMessage());
            // Log exception or handle invalid token cases if needed
            // For now, let the chain proceed, authentication will fail if context is empty
        }

        filterChain.doFilter(request, response);
    }
}
