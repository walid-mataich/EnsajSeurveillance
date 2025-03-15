package com.example.surveillance.services;


import com.example.surveillance.entity.Examen;
import com.example.surveillance.entity.Matiere;
import com.example.surveillance.repositories.ExamenRepository;
import com.example.surveillance.repositories.MatiereRepositoriy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExamenService {

    @Autowired
    private final ExamenRepository examenRepository;

    @Autowired
    private final MatiereRepositoriy matiereRepositoriy;

    public ExamenService(ExamenRepository examenRepository, MatiereRepositoriy matiereRepositoriy) {
        this.examenRepository = examenRepository;
        this.matiereRepositoriy = matiereRepositoriy;
    }

    public Examen createExamen(Examen examen, Long matiereId) {

        Optional<Matiere> matiere = matiereRepositoriy.findById(matiereId);

        if (matiere.isPresent()) {
            examen.setMatiere(matiere.get());
            return examenRepository.save(examen);
        }else {
            throw new RuntimeException("Matiere not found");
        }
    }

    public List<Examen> getAllExamen(){
        return examenRepository.findAll();
    }

    public Optional<Examen> getExamenById(Long id){
        return examenRepository.findById(id);
    }
}
