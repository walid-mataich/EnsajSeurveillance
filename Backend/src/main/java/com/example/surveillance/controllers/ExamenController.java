package com.example.surveillance.controllers;


import com.example.surveillance.entity.Examen;
import com.example.surveillance.entity.Salle;
import com.example.surveillance.repositories.SalleRepository;
import com.example.surveillance.services.ExamenService;
import com.example.surveillance.services.SalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/examen")
public class ExamenController {

    @Autowired
    private final ExamenService examenService;

    @Autowired
    private final SalleRepository salleRepository;


    public ExamenController(ExamenService examenService, SalleRepository salleRepository) {
        this.examenService = examenService;
        this.salleRepository = salleRepository;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/add")
    public ResponseEntity<Examen> addExamenSalle(@RequestBody Examen examen, @RequestParam Long matiereId){
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

    @CrossOrigin(origins = "*")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteExamen(@PathVariable Long id){
        boolean deleted = examenService.deleteExamenById(id);
        if (deleted) {
            return ResponseEntity.ok("examen suprime !");
        }else {
            return ResponseEntity.notFound().build();
        }
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/modifier")
    public Examen updateExamen(@RequestBody Examen examen, @RequestParam Long id,@RequestParam Set<Integer> idSalle){
        examen.setSalles(new HashSet<>(salleRepository.findAllById(idSalle)));
        return examenService.updateExamen(examen, id);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/examSalle")
    public ResponseEntity<Examen> addExamenSalle(@RequestBody Examen examen, @RequestParam Long matiereId, @RequestParam Set<Integer> idSalles){

        Examen savedExamen = examenService.createExamen(examen, matiereId, idSalles);

        return ResponseEntity.ok(savedExamen);
    }

}
