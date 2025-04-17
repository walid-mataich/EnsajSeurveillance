package com.example.surveillance.services;

import com.example.surveillance.SecurityConfig.JwtProvider;
import com.example.surveillance.repositories.SurveillantRepository;
import com.example.surveillance.entity.Surveillant;
import com.example.surveillance.services.ServiceAuthen.SurveillantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SurveillantServiceImplementation implements SurveillantService, UserDetailsService {

    @Autowired
    private SurveillantRepository surveillantRepository;

    public SurveillantServiceImplementation(SurveillantRepository surveillantRepository) {
        this.surveillantRepository = surveillantRepository;
    }

    // 🔹 Implémentation de la méthode pour récupérer un administrateur par email
    @Override
    public Surveillant findSurveillantByEmail(String email) {
        return surveillantRepository.findByEmail(email);
    }

    // 🔹 Implémentation de la méthode pour récupérer un administrateur par ID
    @Override
    public Surveillant findSurveillantById(Long id) {
        Optional<Surveillant> surveillant = surveillantRepository.findById(id);
        return surveillant.orElse(null);
    }

    // 🔹 Implémentation de la méthode pour récupérer tous les administrateurs
    @Override
    public List<Surveillant> getAllSurveillants() {
        return surveillantRepository.findAll();
    }

    // 🔹 Implémentation de `findAllAdministrateurs()` (doublon possible avec `getAllAdministrateurs()`)
    @Override
    public List<Surveillant> findAllSurveillants() {
        return surveillantRepository.findAll();
    }

    // 🔹 (Cette méthode doit être implémentée en fonction de votre JWT provider)
    @Override
    public Surveillant findSurveillantProfileByJwt(String jwt) {
        String email = JwtProvider.getEmailFromJwtToken(jwt);
        if (email != null) {
            return surveillantRepository.findByEmail(email);
        }
        return null;
    }

    // 🔹 Implémentation de UserDetailsService (pour l'authentification Spring Security)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Surveillant surveillant = surveillantRepository.findByEmail(username);
        if (surveillant == null) {
            throw new UsernameNotFoundException("User not found with email: " + username);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        return new org.springframework.security.core.userdetails.User(
                surveillant.getEmail(),
                surveillant.getPassword(),
                authorities
        );
    }
}