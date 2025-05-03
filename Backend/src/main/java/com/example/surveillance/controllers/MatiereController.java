package com.example.surveillance.controllers;


import com.example.surveillance.entity.Matiere;
import com.example.surveillance.repositories.MatiereRepositoriy;
import com.example.surveillance.services.MatiereService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/matieres")
@CrossOrigin(origins = "*")
public class MatiereController {

    private final MatiereService matiereService;
    private final MatiereRepositoriy matiereRepositoriy;

    public MatiereController(MatiereService matiereService, MatiereRepositoriy matiereRepositoriy) {
        this.matiereService = matiereService;
        this.matiereRepositoriy = matiereRepositoriy;
    }


    @GetMapping
    public List<Matiere> getAllMatieres() {
        return matiereService.getAllMatieres();
    }

    @PostMapping("/add/{nomMatiere}/{niveau}/{id}")
    public void addMatiere(@PathVariable String nomMatiere, @PathVariable int niveau, @PathVariable Long id) {
        matiereService.AddMatiere(nomMatiere, niveau, id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteMatiere(@PathVariable Long id) {
        matiereRepositoriy.deleteById(id);
    }

    @GetMapping("/{id}")
    public Matiere getMatiere(@PathVariable Long id) {
        return matiereRepositoriy.findById(id).get();
    }

    @PutMapping("/modif/{idMatiere}/{chef}/{niv}/{nom}")
    public void updateMatiere( @PathVariable Long idMatiere,  @PathVariable Long chef, @PathVariable int niv, @PathVariable String nom) {
        matiereService.updateMatiere(nom,niv,chef,idMatiere);
    }
}
