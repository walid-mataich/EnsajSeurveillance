package com.example.surveillance.controllers;

import com.example.surveillance.SecurityConfig.JwtConstant;
import com.example.surveillance.mailing.MailService;
import com.example.surveillance.repositories.AdministrateurRepository;
import com.example.surveillance.response.AuthResponse;
import com.example.surveillance.response.ModifierMp;
import com.example.surveillance.services.AdministrateurServiceImplementation;
import com.example.surveillance.SecurityConfig.JwtProvider;
import com.example.surveillance.entity.Administrateur;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Jwts;
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
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.List;

@RestController
@RequestMapping("/Admin")
public class AdministrateurController {

    @Autowired
    private AdministrateurRepository administrateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Utilisez uniquement `customAdminDetails` pour éviter la duplication.
    @Autowired
    private AdministrateurServiceImplementation customAdminDetails;

    @Autowired
    private MailService mailService;

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
    @PostMapping("/modifierMotDePasse")
    public ResponseEntity<?> changeMotDePasse(@RequestHeader("Authorization") String authHeader, @RequestBody ModifierMp motdePasse) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token manquant ou invalide !");
        }

        String token = authHeader.substring(7); // Enlève "Bearer "
        Administrateur admin = customAdminDetails.findAdministrateurProfileByJwt(token);

        // Vérifie que l'ancien mot de passe est correct
        if (!passwordEncoder.matches(motdePasse.getCurrentPassword(), admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ancien mot de passe incorrect.");
        }

        // Encode le nouveau mot de passe
        String encodedNewPassword = passwordEncoder.encode(motdePasse.getNewPassword());

        // Met à jour le mot de passe
        admin.setPassword(encodedNewPassword);
        admin.setFirstEntry(false); // désactive le flag firstEntry s'il existe
        administrateurRepository.save(admin);
        mailService.sendMail(admin.getEmail(),"modification de mot de passe", "le mot de passe de votre compte administrateur dans le site de surveillance est modifier avec succès ");

        return ResponseEntity.ok("Mot de passe modifié avec succès !");
    }

    private Authentication authenticate(String username, String password) {

        System.out.println(username + "---++----" + password);

        UserDetails adminDetails = customAdminDetails.loadUserByUsername(username);

        System.out.println("Sign in user details: " + adminDetails);

        if (adminDetails == null) {
            System.out.println("Sign in details - null" + adminDetails);
            throw new BadCredentialsException("Invalid username and password");
        }else{
//            String encodedPassword = passwordEncoder.encode(adminDetails.getPassword());
            if (!passwordEncoder.matches(password, adminDetails.getPassword())) {
                System.out.println("Sign in userDetails - password mismatch" + adminDetails);
                throw new BadCredentialsException("Invalid password");
            }
        }

        return new UsernamePasswordAuthenticationToken(adminDetails, null, adminDetails.getAuthorities());
    }
    @PutMapping("/modifier/{id}")
    public ResponseEntity<Administrateur> modifierAdministrateur(@PathVariable("id") Long id, @RequestBody Administrateur adminModifie) {
        Administrateur adminExist = administrateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrateur introuvable"));
        adminExist.setNom(adminModifie.getNom());
        adminExist.setPrenom(adminModifie.getPrenom());
        adminExist.setEmail(adminModifie.getEmail());
        if (adminModifie.getPassword() != null && !adminModifie.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(adminModifie.getPassword());
            adminExist.setPassword(encodedPassword);
        }
        Administrateur adminSauvegarde = administrateurRepository.save(adminExist);
        mailService.sendMail(adminSauvegarde.getEmail(), "Modification des informations",
                "Vos informations ont été mises à jour avec succès par un administrateur dans  le site de surveillance.");
        return ResponseEntity.ok(adminSauvegarde);
    }
    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<String> supprimerAdministrateur(@PathVariable("id") Long id) {
        Administrateur adminExist = administrateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrateur introuvable"));
        administrateurRepository.delete(adminExist);
        mailService.sendMail(adminExist.getEmail(), "Suppression du compte",
                "Votre compte administrateur a été supprimé avec succès par un administrateur dans le site de surveillance.");
        return ResponseEntity.ok("Administrateur supprimé avec succès !");
    }


    @PostMapping("/add")
    public ResponseEntity<Administrateur> addAdministrateur(@RequestBody Administrateur admin) {
        mailService.sendMail(admin.getEmail(),"creation de compte administrateur", "votre mot de passe dans le site de surveillance est le suivant "+admin.getPassword()+" Vous pouvez le changer lors de la première connexion. ");
        String encodedPassword = passwordEncoder.encode(admin.getPassword());
        admin.setPassword(encodedPassword);
        Administrateur savedadmin=customAdminDetails.createAdministrateur(admin);
        return ResponseEntity.ok(savedadmin);
    }
    @GetMapping("/userConnecter")
    public Administrateur userConnecter(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token manquant ou invalide !");
        }

        String token = authHeader.substring(7); // Supprime "Bearer "
        return customAdminDetails.findAdministrateurProfileByJwt(token);
    }
    @GetMapping("/validToken")
    public ResponseEntity<String> validateToken(HttpServletRequest request) {
        String jwt = request.getHeader("Authorization");

        if (jwt != null && jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
            try {
                SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
                Jwts.parser().setSigningKey(key).build().parseClaimsJws(jwt);
                return ResponseEntity.ok("Token valide");
            } catch (JwtException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalide");
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token manquant ou mal formaté");
    }
    @GetMapping("/all")
    public List<Administrateur> getAllAdministrateurs() {
        return customAdminDetails.findAllAdministrateurs();
    }
}
