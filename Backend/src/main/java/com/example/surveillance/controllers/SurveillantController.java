package com.example.surveillance.controllers;

import com.example.surveillance.SecurityConfig.JwtConstant;
import com.example.surveillance.entity.Examen;
import com.example.surveillance.entity.Surveillant;
import com.example.surveillance.mailing.MailService;
import com.example.surveillance.repositories.SurveillantRepository;
import com.example.surveillance.response.AuthResponse;
import com.example.surveillance.response.ModifierMp;
import com.example.surveillance.services.SurveillantService;
import com.example.surveillance.services.SurveillantServiceImplementation;
import com.example.surveillance.SecurityConfig.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

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
    @Autowired
    private  MailService mailService;

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
    @PostMapping("/modifierMotDePasse")
    public ResponseEntity<?> changeMotDePasse(@RequestHeader("Authorization") String authHeader, @RequestBody ModifierMp motdePasse) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token manquant ou invalide !");
        }

        String token = authHeader.substring(7); // Enlève "Bearer "
        Surveillant surveillant = customSurveillantDetails.findSurveillantProfileByJwt(token);

        // Vérifie que l'ancien mot de passe est correct
        if (!passwordEncoder.matches(motdePasse.getCurrentPassword(), surveillant.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ancien mot de passe incorrect.");
        }

        // Encode le nouveau mot de passe
        String encodedNewPassword = passwordEncoder.encode(motdePasse.getNewPassword());

        // Met à jour le mot de passe
        surveillant.setPassword(encodedNewPassword);
        surveillant.setFirstEntry(false); // désactive le flag firstEntry s'il existe
        surveillantRepository.save(surveillant);
        mailService.sendMail(surveillant.getEmail(),"modification de mot de passe", "votre mot de passe dans le site de surveillance est modifier avec succès ");

        return ResponseEntity.ok("Mot de passe modifié avec succès !");
    }
    @PostMapping("/add")
    public ResponseEntity<Surveillant> addServeillant(@RequestBody Surveillant surveillant) {
        mailService.sendMail(surveillant.getEmail(),"creation de compte surveillant", "votre mot de passe dans le site de surveillance est le suivant "+surveillant.getPassword()+" Vous pouvez l'échanger lors de la première connexion. ");
        String encodedPassword = passwordEncoder.encode(surveillant.getPassword());
        surveillant.setPassword(encodedPassword);
        Surveillant savedSurveillant=surveillantService.createSurveillant(surveillant);

        return ResponseEntity.ok(savedSurveillant);
    }

    private Authentication authenticate(String username, String password) {

        System.out.println(username + "---++----" + password);

        UserDetails surveillantDetails = customSurveillantDetails.loadUserByUsername(username);

        System.out.println("Sign in user details: " + surveillantDetails);

        if (surveillantDetails == null) {
            System.out.println("Sign in details - null" + surveillantDetails);
            throw new BadCredentialsException("Invalid username and password");
        } else {
//             Compare the password entered with the encoded password from the database
//            String encodedPassword = passwordEncoder.encode(surveillantDetails.getPassword());
//            System.out.println(encodedPassword);
            System.out.println(surveillantDetails.getPassword());

            if (!passwordEncoder.matches(password,surveillantDetails.getPassword())) {
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
    @GetMapping("/userConnecter")
    public Surveillant userConnecter(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token manquant ou invalide !");
        }

        String token = authHeader.substring(7); // Supprime "Bearer "
        return customSurveillantDetails.findSurveillantProfileByJwt(token);
    }
}

