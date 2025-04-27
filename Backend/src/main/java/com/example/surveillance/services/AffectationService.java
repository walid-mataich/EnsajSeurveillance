package com.example.surveillance.services;

import com.example.surveillance.entity.*;
import com.example.surveillance.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AffectationService {

    @Autowired private ExamenRepository examenRepo;
    @Autowired private SurveillantRepository surveillantRepo;
    @Autowired private ChoixRepository choixRepo;
    @Autowired private AffectationRepository affectationRepo;
    @Autowired private SalleRepository salleRepo;

    public void assignSurveillance() {
        affectationRepo.deleteAll();

        List<Examen> examens = examenRepo.findAllByOrderByJourAscDebutAsc();
        List<Surveillant> surveillants = surveillantRepo.findByActifTrue();

        int totalSlots = examens.stream().mapToInt(examen ->
                examen.getSalles().stream().mapToInt(Salle::getNbrDeSurveillant).sum()
        ).sum();

        int minAffectations = totalSlots / surveillants.size();
        int maxAffectations = (int) Math.ceil((double) totalSlots / surveillants.size());

        Map<Surveillant, Integer> affectationCount = new HashMap<>();
        Map<Surveillant, List<Affectation>> affectationsParSurveillant = new HashMap<>();

        surveillants.forEach(s -> {
            affectationCount.put(s, 0);
            affectationsParSurveillant.put(s, new ArrayList<>());
        });

        for (Examen examen : examens) {
            for (Salle salle : examen.getSalles()) {
                int nbrSurveillantsRequis = salle.getNbrDeSurveillant();

                List<Surveillant> candidats = getCandidats(examen, surveillants, affectationCount, maxAffectations);

                // Fallback for insufficient candidates
                if (candidats.size() < nbrSurveillantsRequis) {
                    List<Surveillant> extra = surveillants.stream()
                            .filter(s -> getPreference(s, examen) > -1 && !candidats.contains(s))
                            .collect(Collectors.toList());
                    candidats.addAll(extra);
                }

                // Modified sorting: prioritize fairness then preference
                Comparator<Surveillant> parAffectations = Comparator.comparingInt(affectationCount::get);
                Comparator<Surveillant> parPreference =
                        Comparator.comparingInt((Surveillant s) -> getPreference(s, examen))
                                .reversed(); // Inversion claire

                candidats.sort(
                        parAffectations
                                .thenComparing(parPreference)
                                .thenComparing(Surveillant::getId)
                );

                int count = 0;
                for (Surveillant candidat : candidats) {
                    if (affectationCount.get(candidat) < maxAffectations
                            && !hasConflict(candidat, examen, affectationsParSurveillant.get(candidat))
                            && count < nbrSurveillantsRequis) {

                        Affectation affectation = new Affectation();
                        affectation.setExamen(examen);
                        affectation.setSalle(salle);
                        affectation.setSurveillant(candidat);
                        affectationRepo.save(affectation);

                        affectationsParSurveillant.get(candidat).add(affectation);
                        affectationCount.put(candidat, affectationCount.get(candidat) + 1);
                        count++;
                    }
                }

                if (count < nbrSurveillantsRequis) {
                    System.out.println("⚠️ Insufficient surveillants for Exam " + examen.getIdExamen()
                            + " in Room " + salle.getNomSale());
                }
            }
        }

        surveillants.forEach(s -> {
            s.setNbrSurveillance(affectationCount.get(s));
            surveillantRepo.save(s);
        });
    }

    int getPreference(Surveillant s, Examen e) {
        return choixRepo.findBySurveillantAndExamen(s, e)
                .map(Choix::getOrdre)
                .orElse(0);
    }

    boolean hasConflict(Surveillant s, Examen e, List<Affectation> affectations) {
        return affectations.stream().anyMatch(a -> a.getExamen().conflictsWith(e));
    }

    List<Surveillant> getCandidats(Examen examen, List<Surveillant> surveillants,
                                   Map<Surveillant, Integer> affectationCount, int max) {
        return surveillants.stream()
                .filter(s -> getPreference(s, examen) > -1 && affectationCount.get(s) < max)
                .collect(Collectors.toList());
    }

    public List<Affectation> getAllAffectations() {
        return affectationRepo.findAll();
    }

    public void modifierAffectation(Integer idAff, Long idNewSurv){
        Optional<Affectation> affectation = affectationRepo.findById(idAff);
        if (affectation.isPresent()) {
            Optional<Surveillant> newSurv = surveillantRepo.findById(idNewSurv);
            if (newSurv.isPresent()) {
                affectation.get().setSurveillant(newSurv.get());
                affectationRepo.save(affectation.get());
            }
        }
    }
}