package com.example.surveillance.controllers;

import com.example.surveillance.SecurityConfig.JwtConstant;
import com.example.surveillance.entity.Examen;
import com.example.surveillance.entity.Surveillant;
import com.example.surveillance.mailing.MailService;
import com.example.surveillance.repositories.SurveillantRepository;
import com.example.surveillance.response.AuthResponse;
import com.example.surveillance.response.ModifierMp;
import com.example.surveillance.response.ResetPasswordRequest;
import com.example.surveillance.response.JwtUtil;
import com.example.surveillance.services.SurveillantService;
import com.example.surveillance.services.SurveillantServiceImplementation;
import com.example.surveillance.SecurityConfig.JwtProvider;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
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
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.List;
import java.util.Map;
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

        String token = authHeader.substring(7);
        Surveillant surveillant = customSurveillantDetails.findSurveillantProfileByJwt(token);


        if (!passwordEncoder.matches(motdePasse.getCurrentPassword(), surveillant.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ancien mot de passe incorrect.");
        }


        String encodedNewPassword = passwordEncoder.encode(motdePasse.getNewPassword());


        surveillant.setPassword(encodedNewPassword);
        surveillant.setFirstEntry(false);
        surveillantRepository.save(surveillant);
        mailService.sendMail(surveillant.getEmail(),"modification de mot de passe", "votre mot de passe dans le site de surveillance est modifier avec succès ");

        return ResponseEntity.ok("Mot de passe modifié avec succès !");
    }
    @PostMapping("/add")
    public ResponseEntity<?> addSurveillant(@RequestBody Surveillant surveillant) {
        if (surveillantRepository.existsByEmail(surveillant.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Un surveillant avec cet email existe déjà.");
        }

        String htmlContent = """
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
        <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
            <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 16px;">
                BIENVENUE EN TANT QUE SURVEILLANT
            </h1>

            <p style="color: #4a5568; margin-bottom: 24px;">
                Bonjour %s,<br><br>
                Un compte surveillant a été créé pour vous sur la plateforme de surveillance des examens.<br>
                Votre mot de passe initial est : <strong>%s</strong><br><br>
                Veuillez le changer lors de votre première connexion pour garantir la sécurité de votre compte.
            </p>

            <p style="color: #4a5568; margin-bottom: 24px;">
                Cliquez sur le lien ci-dessous pour accéder à votre espace :
            </p>

            <div style="text-align: center; margin: 32px 0;">
                <a href="%s" style="background-color: #4299e1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                    Se connecter à mon compte
                </a>
            </div>

            <p style="color: #718096; font-size: 14px;">
                Ce lien est à usage personnel.<br>
                Si vous n'êtes pas à l'origine de cette création, veuillez ignorer ce message.
            </p>

            <hr style="border-color: #e2e8f0; margin: 24px 0;">

            <p style="color: #a0aec0; font-size: 12px;">
                Cordialement,<br>
                L'équipe de surveillance des examens - ENSAJ
            </p>
        </div>
    </div>
    """.formatted(surveillant.getPrenom(), surveillant.getPassword(), "http://localhost:5173/loginsurv");


        mailService.sendHtmlMail(
                surveillant.getEmail(),
                "Création de votre compte surveillant - ENSAJ",
                htmlContent
        );


        String encodedPassword = passwordEncoder.encode(surveillant.getPassword());
        surveillant.setPassword(encodedPassword);


        Surveillant savedSurveillant = surveillantService.createSurveillant(surveillant);
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
    @GetMapping("/count/Professeur")
    public ResponseEntity<Long> getCountProfesseur() {
        long count = surveillantRepository.countByTypeProfesseur();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/Vacataire")
    public ResponseEntity<Long> getCountVacataire() {
        long count = surveillantRepository.countByTypeVacataire();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/Doctorant")
    public ResponseEntity<Long> getCountDoctorant() {
        long count = surveillantRepository.countByTypeDoctorant();
        return ResponseEntity.ok(count);
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
    @GetMapping("/userConnecter")
    public Surveillant userConnecter(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token manquant ou invalide !");
        }

        String token = authHeader.substring(7);
        return customSurveillantDetails.findSurveillantProfileByJwt(token);
    }
    @PutMapping("/modifier/{id}")
    public ResponseEntity<?> modifierSurveillant(@PathVariable("id") Long id, @RequestBody Surveillant surveillantModifie) {
        Surveillant surveillantExist = surveillantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surveillant introuvable"));

        if (!surveillantExist.getEmail().equals(surveillantModifie.getEmail())
                && surveillantRepository.existsByEmail(surveillantModifie.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("L'email est déjà utilisé par un autre surveillant.");
        }

        surveillantExist.setNom(surveillantModifie.getNom());
        surveillantExist.setPrenom(surveillantModifie.getPrenom());
        surveillantExist.setEmail(surveillantModifie.getEmail());
        surveillantExist.setType(surveillantModifie.getType());

        if (surveillantModifie.getPassword() != null && !surveillantModifie.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(surveillantModifie.getPassword());
            surveillantExist.setPassword(encodedPassword);
        }

        Surveillant surveillantSauvegarde = surveillantRepository.save(surveillantExist);


        String htmlContent = """
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
        <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
            <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 16px;">
                MISE À JOUR DE VOS INFORMATIONS DE COMPTE
            </h1>

            <p style="color: #4a5568; margin-bottom: 24px;">
                Bonjour %s,<br><br>
                Vos informations de compte ont été modifiées avec succès.<br>
                Voici un récapitulatif des nouvelles données :
            </p>

            <ul style="color: #4a5568; margin-bottom: 24px;">
                <li><strong>Nom :</strong> %s</li>
                <li><strong>Prénom :</strong> %s</li>
                <li><strong>Email :</strong> %s</li>
                <li><strong>Type :</strong> %s</li>
            </ul>

            <p style="color: #4a5568; margin-bottom: 24px;">
                Si vous n'avez pas demandé cette modification, veuillez contacter immédiatement l'administrateur.
            </p>

            <hr style="border-color: #e2e8f0; margin: 24px 0;">

            <p style="color: #a0aec0; font-size: 12px;">
                Cordialement,<br>
                L'équipe de surveillance des examens - ENSAJ
            </p>
        </div>
    </div>
    """.formatted(
                surveillantSauvegarde.getPrenom(),
                surveillantSauvegarde.getNom(),
                surveillantSauvegarde.getPrenom(),
                surveillantSauvegarde.getEmail(),
                surveillantSauvegarde.getType()
        );

        mailService.sendHtmlMail(
                surveillantSauvegarde.getEmail(),
                "Mise à jour de votre compte - ENSAJ",
                htmlContent
        );

        return ResponseEntity.ok(surveillantSauvegarde);
    }
    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<String> supprimerSurveillant(@PathVariable("id") Long id) {
        Surveillant surveillantExist = surveillantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surveillant introuvable"));
        surveillantRepository.delete(surveillantExist);
        String htmlContent = """
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
        <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
            <h1 style="color: #e53e3e; font-size: 24px; margin-bottom: 16px;">
                SUPPRESSION DE VOTRE COMPTE SURVEILLANT
            </h1>
            
            <p style="color: #4a5568; margin-bottom: 24px;">
                Bonjour %s %s,<br><br>
                Nous vous informons que votre compte de surveillant a été supprimé avec succès de la plateforme de surveillance des examens.<br>
            </p>

            <p style="color: #4a5568; margin-bottom: 24px;">
                Si vous pensez qu’il s’agit d’une erreur ou que vous n’êtes pas à l’origine de cette suppression,
                veuillez contacter immédiatement notre équipe de support.
            </p>

            <hr style="border-color: #e2e8f0; margin: 24px 0;">

            <p style="color: #a0aec0; font-size: 12px;">
                Cordialement,<br>
                L'équipe de surveillance des examens - ENSAJ
            </p>
        </div>
    </div>
    """.formatted(surveillantExist.getPrenom(), surveillantExist.getNom());

        mailService.sendHtmlMail(
                surveillantExist.getEmail(),
                "Suppression de votre compte surveillant - ENSAJ",
                htmlContent
        );

        return ResponseEntity.ok("Surveillant supprimé avec succès !");
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        String token = request.getToken();
        String email;

        try {
            email = JwtUtil.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Token invalide ou expiré.");
        }

        Surveillant surveillant = surveillantRepository.findByEmail(email);
        if (surveillant==null) {
            return ResponseEntity.badRequest().body("Utilisateur introuvable.");
        }
        surveillant.setPassword(passwordEncoder.encode(request.getNewPassword()));
        surveillantRepository.save(surveillant);

        return ResponseEntity.ok("Mot de passe mis à jour avec succès.");
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Surveillant surv) {
        String email = surv.getEmail();
        Surveillant surveillant = surveillantRepository.findByEmail(email);

        if (surveillant == null) {
            return ResponseEntity.badRequest().body("Email introuvable.");
        }

        String token = JwtUtil.generateToken(surveillant.getEmail(), 15);
        String resetLink = "http://localhost:5173/survResetMp?token=" + token;

        // Construction du HTML
        String htmlContent = """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
                <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 16px;">
                    RÉINITIALISATION DE MOT DE PASSE
                </h1>
                
                <p style="color: #4a5568; margin-bottom: 24px;">
                    Bonjour %s,<br><br>
                    Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour procéder à la réinitialisation :
                </p>

                <div style="text-align: center; margin: 32px 0;">
                    <a href="%s" style="
                        background-color: #4299e1;
                        color: white;
                        padding: 12px 24px;
                        border-radius: 6px;
                        text-decoration: none;
                        font-weight: bold;
                        display: inline-block;
                    ">
                        Réinitialiser mon mot de passe
                    </a>
                </div>

                <p style="color: #718096; font-size: 14px;">
                    Ce lien expirera dans 15 minutes.<br>
                    Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.
                </p>

                <hr style="border-color: #e2e8f0; margin: 24px 0;">

                <p style="color: #a0aec0; font-size: 12px;">
                    Cordialement,<br>
                    L'équipe de surveillance des examens - ENSAJ
                </p>
            </div>
        </div>
        """.formatted(surveillant.getPrenom(), resetLink);

        mailService.sendHtmlMail(
                surveillant.getEmail(),
                "Réinitialisation de votre mot de passe ENSAJ",
                htmlContent
        );

        return ResponseEntity.ok("Email envoyé.");
    }
    @PostMapping("/verify-reset-token")
    public ResponseEntity<?> verifyResetToken(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        boolean isValid = JwtUtil.validateToken(token);
        return ResponseEntity.ok(Map.of("valid", isValid));
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

