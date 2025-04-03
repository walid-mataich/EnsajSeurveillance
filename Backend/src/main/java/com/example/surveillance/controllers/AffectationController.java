package com.example.surveillance.controllers;

import com.example.surveillance.entity.Affectation;
import com.example.surveillance.entity.Examen;
import com.example.surveillance.entity.Salle;
import com.example.surveillance.entity.Surveillant;
import com.example.surveillance.repositories.*;
import com.example.surveillance.services.AffectationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/affectations")
public class AffectationController {

//hada ra ga generah deepseek ra makhdamch gha bach nakhdo fikra


    private final AffectationService affectationService;
    private final ExamenRepository examenRepository;
    private final SurveillantRepository surveillantRepository;
    private final SalleRepository salleRepository;
    private final AffectationRepository affectationRepository;

    public AffectationController(AffectationService affectationService,
                                 ExamenRepository examenRepository,
                                 SurveillantRepository surveillantRepository,
                                 SalleRepository salleRepository,
                                 AffectationRepository affectationRepository) {
        this.affectationService = affectationService;
        this.examenRepository = examenRepository;
        this.surveillantRepository = surveillantRepository;
        this.salleRepository = salleRepository;
        this.affectationRepository = affectationRepository;
    }

    @PostMapping("/generate")
    public List<Affectation> generateAffectations() {
        List<Examen> exams = examenRepository.findAll();
        List<Surveillant> surveillants = surveillantRepository.findAll();
        List<Salle> salles = salleRepository.findAll();

        List<Affectation> affectations = affectationService.generateAffectations(exams, surveillants, salles);
        return affectationRepository.saveAll(affectations);
    }

    @GetMapping("/all")
    public List<Affectation> getAllAffectations() {
        return affectationService.getAllAffectations();
    }



}