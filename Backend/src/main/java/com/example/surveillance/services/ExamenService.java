package com.example.surveillance.services;


import com.example.surveillance.entity.Examen;
import com.example.surveillance.entity.Matiere;
import com.example.surveillance.entity.Salle;
import com.example.surveillance.repositories.ExamenRepository;
import com.example.surveillance.repositories.MatiereRepositoriy;
import com.example.surveillance.repositories.SalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ExamenService {

    @Autowired
    private final ExamenRepository examenRepository;

    @Autowired
    private final MatiereRepositoriy matiereRepositoriy;

    @Autowired
    private final SalleRepository salleRepository;

    public ExamenService(ExamenRepository examenRepository, MatiereRepositoriy matiereRepositoriy, SalleRepository salleRepository) {
        this.examenRepository = examenRepository;
        this.matiereRepositoriy = matiereRepositoriy;
        this.salleRepository = salleRepository;
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


    public Examen createExamen(Examen examen, Long matiereId, Set<Integer> idSalles) {

        Optional<Matiere> matiere = matiereRepositoriy.findById(matiereId);

        if (matiere.isPresent()) {
            examen.setMatiere(matiere.get());


            if (idSalles != null && !idSalles.isEmpty()) {
                Set<Salle> salles = new HashSet<>(salleRepository.findAllById(idSalles));
                examen.setSalles(salles);
            }

            return examenRepository.save(examen);

        }else {
            throw new RuntimeException("Matiere not found");
        }

    }



    public List<Examen> getAllExamen(){
        return examenRepository.findAllByOrderByJourAscDebutAsc();
    }

    public Optional<Examen> getExamenById(Long id){
        return examenRepository.findById(id);
    }

    public boolean deleteExamenById(Long id){
        if(examenRepository.existsById(id)){
            examenRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Examen updateExamen(Examen updatedExamen, Long id, Long matiereId){
        Optional<Examen> existingExamenOpt = examenRepository.findById(id);
        if (existingExamenOpt.isPresent()){
            Examen existingExamen = existingExamenOpt.get();
            existingExamen.setJour(updatedExamen.getJour());
            existingExamen.setDebut(updatedExamen.getDebut());
            existingExamen.setFin(updatedExamen.getFin());
            existingExamen.setNbrDesSalles(updatedExamen.getNbrDesSalles());

            if (matiereId != null){
                Optional<Matiere> matiere = matiereRepositoriy.findById(matiereId);
                if (matiere.isPresent()) {
                    existingExamen.setMatiere(matiere.get());
                }else {
                    throw new RuntimeException("Matiere not found with id: " + matiereId);
                }
            }

            return examenRepository.save(existingExamen);
        }else {
            throw new RuntimeException("Matiere not found with id: " + id);
        }
    }

    public Examen updateExamen(Examen updatedExamen, Long id){
        return updateExamen(updatedExamen, id, null);
    }
}
