package com.example.surveillance.controllers;


import com.example.surveillance.entity.Salle;
import com.example.surveillance.repositories.SalleRepository;
import com.example.surveillance.services.SalleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/salles")
public class SalleController {

    private final SalleService salleService;
    private final SalleRepository salleRepository;

    public SalleController(SalleService salleService, SalleRepository salleRepository) {
        this.salleService = salleService;
        this.salleRepository = salleRepository;
    }


    @GetMapping
    public List<Salle> findAll() {
        return salleService.findAll();
    }

    @PostMapping("/add")
    public Salle addSalle(@RequestBody Salle salle){
        return salleService.addSalle(salle);
    }


    @DeleteMapping("/delete/{id}")
    public void deleteSalle(@PathVariable int id){
        salleRepository.deleteById(id);
    }

    @PutMapping("/modif/{id}/{nbS}/{nom}/{type}")
    public void updateSalle(@PathVariable int id, @PathVariable int nbS, @PathVariable String nom, @PathVariable String type){
        Optional<Salle> salleOpt = salleRepository.findById(id);
        if(salleOpt.isPresent()){
            Salle salle = salleOpt.get();
            salle.setType(type);
            salle.setNomSale(nom);
            salle.setNbrDeSurveillant(nbS);
            salleRepository.save(salle);
        }
    }


}
