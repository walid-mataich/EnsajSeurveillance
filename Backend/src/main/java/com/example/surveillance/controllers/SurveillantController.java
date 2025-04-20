package com.example.surveillance.controllers;

import com.example.surveillance.entity.Surveillant;
import com.example.surveillance.repositories.SurveillantRepository;
import com.example.surveillance.response.AuthResponse;
import com.example.surveillance.services.SurveillantService;
import com.example.surveillance.services.SurveillantServiceImplementation;
import com.example.surveillance.SecurityConfig.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/surveillants")
@CrossOrigin(origins = "*")
public class SurveillantController {

    @Autowired
    private SurveillantRepository surveillantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SurveillantServiceImplementation customSurveillantDetails;

    private final SurveillantService surveillantService;

    // Constructor injection for SurveillantService
    public SurveillantController(SurveillantService surveillantService) {
        this.surveillantService = surveillantService;
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody Surveillant loginRequest) {
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

        UserDetails surveillantDetails = customSurveillantDetails.loadUserByUsername(username);

        System.out.println("Sign in user details: " + surveillantDetails);

        if (surveillantDetails == null) {
            System.out.println("Sign in details - null" + surveillantDetails);
            throw new BadCredentialsException("Invalid username and password");
        } else {
            // Compare the password entered with the encoded password from the database
            String encodedPassword = passwordEncoder.encode(surveillantDetails.getPassword());
            System.out.println(encodedPassword);
            System.out.println(surveillantDetails.getPassword());

            if (!passwordEncoder.matches(password, encodedPassword)) {
                System.out.println("Sign in userDetails - password mismatch" + surveillantDetails);
                throw new BadCredentialsException("Invalid password");
            }
        }

        return new UsernamePasswordAuthenticationToken(surveillantDetails, null, surveillantDetails.getAuthorities());
    }

    @GetMapping
    public List<Surveillant> getAllSurveillants() {
        return surveillantService.getAllSurveillants();
    }

    @PutMapping("actif/{a}/{id}")
    public void actif(@PathVariable boolean a, @PathVariable Long id) {
        Optional<Surveillant> modified = surveillantRepository.findById(id);

        if (modified.isPresent()) {
            modified.get().setActif(a);
            surveillantRepository.save(modified.get());
        }else {
            System.out.println("erreur lors de la modification");
        }

    }
}

