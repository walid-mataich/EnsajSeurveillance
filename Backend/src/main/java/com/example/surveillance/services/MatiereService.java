package com.example.surveillance.services;


import com.example.surveillance.entity.Matiere;
import com.example.surveillance.entity.Surveillant;
import com.example.surveillance.repositories.MatiereRepositoriy;
import com.example.surveillance.repositories.SurveillantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MatiereService {
    private final MatiereRepositoriy matiereRepositoriy;
    private final SurveillantRepository surveillantRepository;

    public MatiereService(MatiereRepositoriy matiereRepositoriy, SurveillantRepository surveillantRepository) {
        this.matiereRepositoriy = matiereRepositoriy;
        this.surveillantRepository = surveillantRepository;
    }


    public List<Matiere> getAllMatieres() {
        return this.matiereRepositoriy.findAll();
    }


    public void AddMatiere(String nomMatiere,int niveau, Long ChefId){

        Optional<Surveillant> chefDeModule = surveillantRepository.findById(ChefId);

        if(chefDeModule.isPresent()){
            Matiere matiere = new Matiere();
            matiere.setNomMatiere(nomMatiere);
            matiere.setNiveau(niveau);
            matiere.setChefDeModule(chefDeModule.get());
            matiereRepositoriy.save(matiere);
        }else {
            System.out.println("prof introuvable");
        }

    }


}
