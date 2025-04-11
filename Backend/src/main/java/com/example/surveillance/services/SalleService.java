package com.example.surveillance.services;


import com.example.surveillance.entity.Salle;
import com.example.surveillance.repositories.SalleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalleService {

    private final SalleRepository salleRepository;

    public SalleService(SalleRepository salleRepository) {
        this.salleRepository = salleRepository;
    }

    public List<Salle> findAll() {
        return salleRepository.findAll();
    }

    public Salle addSalle(Salle salle){
        return salleRepository.save(salle);
    }
}
