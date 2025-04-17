package com.example.surveillance.services;

import com.example.surveillance.entity.Examen;
import com.example.surveillance.entity.Matiere;
import com.example.surveillance.entity.Surveillant;
import com.example.surveillance.repositories.SurveillantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SurveillantService {
    private final SurveillantRepository surveillantRepository;

    public SurveillantService(SurveillantRepository surveillantRepository) {
        this.surveillantRepository = surveillantRepository;
    }

    public List<Surveillant> getAllSurveillants() {
        return surveillantRepository.findAll();
    }
    public Surveillant createSurveillant(Surveillant surveillant) {
            return surveillantRepository.save(surveillant);
    }
}
