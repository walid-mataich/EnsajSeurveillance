package com.example.surveillance.controllers;


import com.example.surveillance.entity.Choix;
import com.example.surveillance.services.ChoixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/choix")
@CrossOrigin(origins = "*")
public class ChoixController {

    private final ChoixService choixService;

    public ChoixController(ChoixService choixService) {
        this.choixService = choixService;
    }

    @PostMapping("/choisir")
    public ResponseEntity<Choix> addChoix(@RequestBody Choix choix, @RequestParam Long id, @RequestParam Long idExamen){
        Choix savedChoix = choixService.createChoix(choix, idExamen, id);
        return ResponseEntity.ok(savedChoix);
    }


    @CrossOrigin(origins = "*")
    @GetMapping("/all")
    public List<Choix> getAllChoix(){return choixService.allChoix();}

    @GetMapping("/{id}")
    public List<Choix> getChoixBySurvId(@PathVariable Long id){
        return choixService.choixBySurv(id);
    }
}
