package com.example.surveillance.controllers;


import com.example.surveillance.entity.Matiere;
import com.example.surveillance.services.MatiereService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matieres")
@CrossOrigin(origins = "*")
public class MatiereController {

    private final MatiereService matiereService;

    public MatiereController(MatiereService matiereService) {
        this.matiereService = matiereService;
    }


    @GetMapping
    public List<Matiere> getAllMatieres() {
        return matiereService.getAllMatieres();
    }

    @PostMapping("/add/{nomMatiere}/{niveau}/{id}")
    public void addMatiere(@PathVariable String nomMatiere, @PathVariable int niveau, @PathVariable Long id) {
        matiereService.AddMatiere(nomMatiere, niveau, id);
    }
}
