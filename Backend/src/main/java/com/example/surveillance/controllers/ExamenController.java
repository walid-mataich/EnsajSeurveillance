package com.example.surveillance.controllers;


import com.example.surveillance.entity.Examen;
import com.example.surveillance.services.ExamenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/examen")
public class ExamenController {

    @Autowired
    private final ExamenService examenService;


    public ExamenController(ExamenService examenService) {
        this.examenService = examenService;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/add")
    public ResponseEntity<Examen> addExamen(@RequestBody Examen examen, @RequestParam Long matiereId){
        Examen savedExamen = examenService.createExamen(examen, matiereId);
        return ResponseEntity.ok(savedExamen);
    }
    @CrossOrigin(origins = "*")
    @GetMapping("/all")
    public List<Examen> getAllExamens(){
        return examenService.getAllExamen();
    }
    @CrossOrigin(origins = "*")
    @GetMapping("/{id}")
    public ResponseEntity<Examen> getExamenById(@PathVariable Long id){
        Optional<Examen> examen = examenService.getExamenById(id);
        return examen.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


}
