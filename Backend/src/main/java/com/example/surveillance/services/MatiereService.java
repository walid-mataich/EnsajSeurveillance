package com.example.surveillance.services;


import com.example.surveillance.entity.Matiere;
import com.example.surveillance.repositories.MatiereRepositoriy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatiereService {
    private final MatiereRepositoriy matiereRepositoriy;

    public MatiereService(MatiereRepositoriy matiereRepositoriy) {
        this.matiereRepositoriy = matiereRepositoriy;
    }


    public List<Matiere> getAllMatieres() {
        return this.matiereRepositoriy.findAll();
    }
}
