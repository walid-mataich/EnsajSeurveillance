package com.example.surveillance.services;

import com.example.surveillance.entity.Choix;
import com.example.surveillance.entity.Examen;
import com.example.surveillance.entity.Surveillant;
import com.example.surveillance.repositories.ChoixRepository;
import com.example.surveillance.repositories.ExamenRepository;
import com.example.surveillance.repositories.MatiereRepositoriy;
import com.example.surveillance.repositories.SurveillantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChoixService {

    public final ChoixRepository choixRepository;
    public final ExamenRepository examenRepository;
    public final SurveillantRepository surveillantRepository;


    public ChoixService(ChoixRepository choixRepository, ExamenRepository examenRepository, MatiereRepositoriy matiereRepositoriy, SurveillantRepository surveillantRepository) {
        this.choixRepository = choixRepository;
        this.examenRepository = examenRepository;
        this.surveillantRepository = surveillantRepository;
    }

    public Choix createChoix(Choix choix, Long idExamen, Long id){
        Optional<Examen> examen = examenRepository.findById(idExamen);
        Optional<Surveillant> surveillant =  surveillantRepository.findById(id);

        if(examen.isPresent() && surveillant.isPresent()){
            choix.setExamen(examen.get());
            choix.setSurveillant(surveillant.get());

            return choixRepository.save(choix);
        }
        else if (!examen.isPresent() && surveillant.isPresent()) {
            throw new RuntimeException("examen  not found");
        }
        else {
            throw new RuntimeException("surveillant not found");
        }
    }


    public List<Choix> allChoix(){
        return choixRepository.findAll();
    }


}
