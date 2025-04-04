package com.example.surveillance.controllers;

import com.example.surveillance.repositories.AdministrateurRepository;
import com.example.surveillance.response.AuthResponse;
import com.example.surveillance.services.AdministrateurServiceImplementation;
import com.example.surveillance.services.AdministrateurService;
import com.example.surveillance.SecurityConfig.JwtProvider;
import com.example.surveillance.entity.Administrateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/authAdmin")
public class AdministrateurController {

    @Autowired
    private AdministrateurRepository administrateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Utilisez uniquement `customAdminDetails` pour éviter la duplication.
    @Autowired
    private AdministrateurServiceImplementation customAdminDetails;

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody Administrateur loginRequest) {
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        System.out.println(username + "-------" + password);

        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = JwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse();

        authResponse.setMessage("Login success");
        authResponse.setJwt(token);
        authResponse.setStatus(true);

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    private Authentication authenticate(String username, String password) {

        System.out.println(username + "---++----" + password);

        UserDetails adminDetails = customAdminDetails.loadUserByUsername(username);

        System.out.println("Sign in user details: " + adminDetails);

        if (adminDetails == null) {
            System.out.println("Sign in details - null" + adminDetails);
            throw new BadCredentialsException("Invalid username and password");
        }else{
            String encodedPassword = passwordEncoder.encode(adminDetails.getPassword());
            if (!passwordEncoder.matches(password, encodedPassword)) {
                System.out.println("Sign in userDetails - password mismatch" + adminDetails);
                throw new BadCredentialsException("Invalid password");
            }
        }



        return new UsernamePasswordAuthenticationToken(adminDetails, null, adminDetails.getAuthorities());
    }
}
