package com.example.surveillance.controllers;

import com.example.surveillance.entity.Affectation;
import com.example.surveillance.entity.Surveillant;
import com.example.surveillance.mailing.MailService;
import com.example.surveillance.repositories.AffectationRepository;
import com.example.surveillance.repositories.SurveillantRepository;
import com.example.surveillance.services.AffectationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/affectations")
public class AffectationController {

    @Autowired
    private final AffectationService affectationService;

    @Autowired
    private final AffectationRepository affectationRepository;
    @Autowired
    private MailService mailService;

    @Autowired
    private SurveillantRepository surveillantRepository;


    public AffectationController(AffectationService affectationService, AffectationRepository affectationRepository) {
        this.affectationService = affectationService;
        this.affectationRepository = affectationRepository;
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

    @DeleteMapping("/deleteAll")
    public void deleteAllAffectations() {
        affectationRepository.deleteAll();
    }

    @GetMapping("/{id}")
    public List<Affectation> getAffectationsByAffectationId(@PathVariable Long id) {
        Optional<Surveillant> s = surveillantRepository.findById(id);

            if (s.isPresent()) {
                return affectationRepository.findBySurveillant(s.get());
            }else {
                System.out.println("SURVEILLANt_NOT_FOUND");
                return null;
            }

    }

    @PutMapping("/modifier/{idAff}/{idNewSurv}")
    public void modifierAffectation(@PathVariable Integer idAff, @PathVariable Long idNewSurv) {
        affectationService.modifierAffectation(idAff,idNewSurv);
    }


}

