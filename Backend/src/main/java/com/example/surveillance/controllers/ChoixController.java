package com.example.surveillance.controllers;


import com.example.surveillance.entity.Choix;
import com.example.surveillance.repositories.ChoixRepository;
import com.example.surveillance.services.ChoixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/choix")
@CrossOrigin(origins = "*")
public class ChoixController {

    private final ChoixService choixService;

    @Autowired
    private final ChoixRepository choixRepository;

    public ChoixController(ChoixService choixService, ChoixRepository choixRepository) {
        this.choixService = choixService;
        this.choixRepository = choixRepository;
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

    @GetMapping()
    int nbrSurveillantChoix(){
        return choixRepository.countSurvAvecChoix();
    }

    @PutMapping("/modifier/{idChoix}/{newOrdre}")
    public void modifierChoix(@PathVariable Integer idChoix, @PathVariable int newOrdre){
        Optional<Choix> choixOpt = choixRepository.findById(idChoix);
        if(choixOpt.isPresent()){
            Choix choix = choixOpt.get();
            choix.setOrdre(newOrdre);
            choixRepository.save(choix);
        }
}
}
