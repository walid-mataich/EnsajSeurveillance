package com.example.surveillance.services;

import com.example.surveillance.entity.Surveillant;
import com.example.surveillance.repositories.SurveillantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SurveillantService {
    private final SurveillantRepository surveillantRepository;

    public SurveillantService(SurveillantRepository surveillantRepository) {
        this.surveillantRepository = surveillantRepository;
    }

    public List<Surveillant> getAllSurveillants() {
        return surveillantRepository.findAll();
    }
}
