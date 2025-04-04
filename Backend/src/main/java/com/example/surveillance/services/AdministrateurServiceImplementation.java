package com.example.surveillance.services;

import com.example.surveillance.repositories.AdministrateurRepository;
import com.example.surveillance.entity.Administrateur;
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
public class AdministrateurServiceImplementation implements AdministrateurService, UserDetailsService {

    @Autowired
    private AdministrateurRepository administrateurRepository;

    public AdministrateurServiceImplementation(AdministrateurRepository administrateurRepository) {
        this.administrateurRepository = administrateurRepository;
    }

    // 🔹 Implémentation de la méthode pour récupérer un administrateur par email
    @Override
    public Administrateur findAdministrateurByEmail(String email) {
        return administrateurRepository.findByEmail(email);
    }

    // 🔹 Implémentation de la méthode pour récupérer un administrateur par ID
    @Override
    public Administrateur findAdministrateurById(Long id) {
        Optional<Administrateur> administrateur = administrateurRepository.findById(id);
        return administrateur.orElse(null);
    }

    // 🔹 Implémentation de la méthode pour récupérer tous les administrateurs
    @Override
    public List<Administrateur> getAllAdministrateurs() {
        return administrateurRepository.findAll();
    }

    // 🔹 Implémentation de `findAllAdministrateurs()` (doublon possible avec `getAllAdministrateurs()`)
    @Override
    public List<Administrateur> findAllAdministrateurs() {
        return administrateurRepository.findAll();
    }

    // 🔹 (Cette méthode doit être implémentée en fonction de votre JWT provider)
    @Override
    public Administrateur findAdministrateurProfileByJwt(String jwt) {
        // TODO: Ajouter la logique pour extraire l'email depuis le JWT et récupérer l'admin
        return null;
    }

    // 🔹 Implémentation de UserDetailsService (pour l'authentification Spring Security)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Administrateur administrateur = administrateurRepository.findByEmail(username);
        if (administrateur == null) {
            throw new UsernameNotFoundException("User not found with email: " + username);
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        return new org.springframework.security.core.userdetails.User(
                administrateur.getEmail(),
                administrateur.getPassword(),
                authorities
        );
    }
}
