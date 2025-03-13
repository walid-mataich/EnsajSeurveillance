package com.example.surveillance.services;


import com.example.surveillance.entity.Matiere;
import com.example.surveillance.repositories.MatiereRepositories;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatiereService {
    private final MatiereRepositories matiereRepositories;

    public MatiereService(MatiereRepositories matiereRepositories) {
        this.matiereRepositories = matiereRepositories;
    }


    public List<Matiere> getAllMatieres() {
        return this.matiereRepositories.findAll();
    }
}
