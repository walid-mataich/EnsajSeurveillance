package com.example.surveillance.controllers;

import com.example.surveillance.SecurityConfig.JwtConstant;
import com.example.surveillance.mailing.MailService;
import com.example.surveillance.repositories.AdministrateurRepository;
import com.example.surveillance.response.AuthResponse;
import com.example.surveillance.response.JwtUtil;
import com.example.surveillance.response.ModifierMp;
import com.example.surveillance.response.ResetPasswordRequest;
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
import java.util.Map;

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

        String token = authHeader.substring(7);
        Administrateur admin = customAdminDetails.findAdministrateurProfileByJwt(token);


        if (!passwordEncoder.matches(motdePasse.getCurrentPassword(), admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ancien mot de passe incorrect.");
        }


        String encodedNewPassword = passwordEncoder.encode(motdePasse.getNewPassword());


        admin.setPassword(encodedNewPassword);
        admin.setFirstEntry(false);
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
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Administrateur adminRequest) {
        String email = adminRequest.getEmail();
        Administrateur admin = administrateurRepository.findByEmail(email);

        if (admin == null) {
            return ResponseEntity.badRequest().body("Email introuvable.");
        }

        String token = JwtUtil.generateToken(admin.getEmail(), 15);
        String resetLink = "http://localhost:5173/adminResetMp?token=" + token;

        String htmlContent = """
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
        <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
            <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 16px;">
                RÉINITIALISATION DE MOT DE PASSE
            </h1>
            
            <p style="color: #4a5568; margin-bottom: 24px;">
                Bonjour %s,<br><br>
                Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour procéder :
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
                Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </p>

            <hr style="border-color: #e2e8f0; margin: 24px 0;">
            <p style="color: #a0aec0; font-size: 12px;">
                Cordialement,<br>
                L'équipe de surveillance des examens - ENSAJ
            </p>
        </div>
    </div>
    """.formatted(admin.getPrenom(), resetLink);

        mailService.sendHtmlMail(
                admin.getEmail(),
                "Réinitialisation de votre mot de passe ENSAJ",
                htmlContent
        );

        return ResponseEntity.ok("Email envoyé avec succès.");
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

        Administrateur admin = administrateurRepository.findByEmail(email);
        if (admin == null) {
            return ResponseEntity.badRequest().body("Administrateur introuvable.");
        }

        admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
        administrateurRepository.save(admin);

        return ResponseEntity.ok("Mot de passe administrateur mis à jour avec succès.");
    }

    @PutMapping("/modifier/{id}")
    public ResponseEntity<?> modifierAdministrateur(@PathVariable("id") Long id, @RequestBody Administrateur adminModifie) {

        Administrateur adminExist = administrateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrateur introuvable"));


        if (!adminExist.getEmail().equals(adminModifie.getEmail()) && administrateurRepository.existsByEmail(adminModifie.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("L'email est déjà utilisé par un autre administrateur.");
        }


        adminExist.setNom(adminModifie.getNom());
        adminExist.setPrenom(adminModifie.getPrenom());
        adminExist.setEmail(adminModifie.getEmail());

        if (adminModifie.getPassword() != null && !adminModifie.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(adminModifie.getPassword());
            adminExist.setPassword(encodedPassword);
        }

        Administrateur adminSauvegarde = administrateurRepository.save(adminExist);

        String htmlContent = """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
                <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 16px;">
                    MODIFICATION DE VOS INFORMATIONS DE COMPTE
                </h1>
                
                <p style="color: #4a5568; margin-bottom: 24px;">
                    Bonjour %s,<br><br>
                    Nous vous informons que vos informations de compte ont été mises à jour avec succès.<br>
                    Voici un récapitulatif des modifications :
                </p>

                <ul style="color: #4a5568; margin-bottom: 24px;">
                    <li><strong>Nom :</strong> %s</li>
                    <li><strong>Prénom :</strong> %s</li>
                    <li><strong>Email :</strong> %s</li>
                </ul>

                <p style="color: #4a5568; margin-bottom: 24px;">
                    Si vous n'êtes pas à l'origine de cette modification, veuillez contacter immédiatement notre support.
                </p>

                <hr style="border-color: #e2e8f0; margin: 24px 0;">

                <p style="color: #a0aec0; font-size: 12px;">
                    Cordialement,<br>
                    L'équipe de surveillance des examens - ENSAJ
                </p>
            </div>
        </div>
        """.formatted(
                adminSauvegarde.getPrenom(),
                adminSauvegarde.getNom(),
                adminSauvegarde.getPrenom(),
                adminSauvegarde.getEmail()
        );

        mailService.sendHtmlMail(
                adminSauvegarde.getEmail(),
                "Modification de vos informations de compte - ENSAJ",
                htmlContent
        );

        return ResponseEntity.ok(adminSauvegarde);
    }
    @DeleteMapping("/supprimer/{id}")
    public ResponseEntity<String> supprimerAdministrateur(@PathVariable("id") Long id) {
        Administrateur adminExist = administrateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrateur introuvable"));
        administrateurRepository.delete(adminExist);
        String htmlContent = """
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
        <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
            <h1 style="color: #e53e3e; font-size: 24px; margin-bottom: 16px;">
                SUPPRESSION DE VOTRE COMPTE ADMINISTRATEUR
            </h1>
            
            <p style="color: #4a5568; margin-bottom: 24px;">
                Bonjour %s %s,<br><br>
                Nous vous informons que votre compte administrateur a été supprimé avec succès de la plateforme de surveillance des examens.<br>
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
    """.formatted(adminExist.getPrenom(), adminExist.getNom());

        mailService.sendHtmlMail(
                adminExist.getEmail(),
                "Suppression de votre compte administrateur - ENSAJ",
                htmlContent
        );
        return ResponseEntity.ok("Administrateur supprimé avec succès !");
    }
    @PostMapping("/verify-reset-token")
    public ResponseEntity<?> verifyResetToken(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        boolean isValid = JwtUtil.validateToken(token);
        return ResponseEntity.ok(Map.of("valid", isValid));
    }


    @PostMapping("/add")
    public ResponseEntity<?> addAdministrateur(@RequestBody Administrateur admin) {
        if (administrateurRepository.existsByEmail(admin.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Un administrateur avec cet email existe déjà.");
        }

        String htmlContent = """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto;">
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
                <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 16px;">
                    CRÉATION DE VOTRE COMPTE ADMINISTRATEUR
                </h1>
                
                <p style="color: #4a5568; margin-bottom: 24px;">
                    Bonjour %s,<br><br>
                    Félicitations ! Un compte administrateur a été créé pour vous sur notre site de surveillance des examens.<br>
                    Votre mot de passe initial est : <strong>%s</strong><br><br>
                    Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe lors de votre première connexion.
                </p>

                <p style="color: #4a5568; margin-bottom: 24px;">
                    Cliquez sur le lien ci-dessous pour vous connecter à votre compte :
                </p>

                <div style="text-align: center; margin: 32px 0;">
                    <a href="%s" style="background-color: #4299e1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                        Se connecter à mon compte
                    </a>
                </div>

                <p style="color: #718096; font-size: 14px;">
                    Ce lien expirera dans 60 minutes.<br>
                    Si vous n'avez pas demandé cette création de compte, veuillez ignorer cet email.
                </p>

                <hr style="border-color: #e2e8f0; margin: 24px 0;">

                <p style="color: #a0aec0; font-size: 12px;">
                    Cordialement,<br>
                    L'équipe de surveillance des examens - ENSAJ
                </p>
            </div>
        </div>
        """.formatted(admin.getPrenom(), admin.getPassword(), "http://localhost:5173/loginadmin");

        mailService.sendHtmlMail(
                admin.getEmail(),
                "Création de votre compte administrateur - ENSAJ",
                htmlContent
        );

        String encodedPassword = passwordEncoder.encode(admin.getPassword());
        admin.setPassword(encodedPassword);

        Administrateur savedAdmin = customAdminDetails.createAdministrateur(admin);
        return ResponseEntity.ok(savedAdmin);
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
