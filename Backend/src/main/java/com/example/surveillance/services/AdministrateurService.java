package com.example.surveillance.services;

import com.example.surveillance.entity.Administrateur;
import com.example.surveillance.repositories.AdministrateurRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdministrateurService {
    private final AdministrateurRepository administrateurRepository;
    public AdministrateurService(AdministrateurRepository administrateurRepository) {
        this.administrateurRepository = administrateurRepository;
    }
    public List<Administrateur> getAllAdministrateurs() {
        return administrateurRepository.findAll();
    }
    public Administrateur createAdministrateur(Administrateur admin) {
        return administrateurRepository.save(admin);
    }

}
