package com.example.surveillance.controllers;


import com.example.surveillance.entity.Salle;
import com.example.surveillance.services.SalleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/salles")
public class SalleController {

    private final SalleService salleService;

    public SalleController(SalleService salleService) {
        this.salleService = salleService;
    }


    @GetMapping
    public List<Salle> findAll() {
        return salleService.findAll();
    }

    @PostMapping("/add")
    public Salle addSalle(@RequestBody Salle salle){
        return salleService.addSalle(salle);
    }


}
