package com.example.surveillance.controllers;

import com.example.surveillance.entity.Affectation;
import com.example.surveillance.entity.Examen;
import com.example.surveillance.entity.Salle;
import com.example.surveillance.entity.Surveillant;
import com.example.surveillance.repositories.*;
import com.example.surveillance.services.AffectationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/affectations")
public class AffectationController {

    private final AffectationService affectationService;



    public AffectationController(AffectationService affectationService) {
        this.affectationService = affectationService;
    }

    @PostMapping("/generate")
    public String generateAssignments() {
        affectationService.assignSurveillance();
        return "Surveillance assignments generated successfully.";
    }

    @GetMapping
    public List<Affectation> getAllAffectations() {
        return affectationService.getAllAffectations();
    }

}