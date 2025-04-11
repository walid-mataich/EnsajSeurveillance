package com.example.surveillance.services;


import com.example.surveillance.entity.*;
import com.example.surveillance.repositories.*;
import com.example.surveillance.util.Pair;
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
        List<Examen> exams = examenRepo.findAll();
        List<Surveillant> surveillants = surveillantRepo.findAll();
        int totalSlots = exams.stream().mapToInt(Examen::getNbrDesSalles).sum();

        int maxAssignments;

        if (totalSlots % surveillants.size() != 0) {
            maxAssignments = (totalSlots / surveillants.size()) + 1;
        }else {
            maxAssignments = (totalSlots / surveillants.size());
        }

        Map<Long, List<Choix>> surveillantChoixMap = choixRepo.findAll().stream()
                .filter(c -> c.getOrdre() >= 0)
                .collect(Collectors.groupingBy(c -> c.getSurveillant().getId()));

        for (Examen exam : exams) {
            for (int i = 0; i < exam.getNbrDesSalles(); i++) {
                Salle salle = new Salle(i + 1, "B" + (i + 1));

                Surveillant best = findBestSurveillant(exam, surveillantChoixMap, maxAssignments);
                if (best != null) {
                    Affectation a = new Affectation();
                    a.setExamen(exam);
                    a.setSalle(salle); // salle is not from DB
                    a.setSurveillant(best);
                    affectationRepo.save(a);

                    best.setNbrSurveillance(best.getNbrSurveillance() + 1);
                    surveillantRepo.save(best);
                }
            }
        }
    }

    private Surveillant findBestSurveillant(Examen exam, Map<Long, List<Choix>> choices, int maxAssignments) {
        return choices.values().stream()
                .flatMap(List::stream)
                .filter(c -> c.getExamen().equals(exam))
                .map(Choix::getSurveillant)
                .filter(s -> s.getNbrSurveillance() < maxAssignments)
                .sorted(Comparator
                        .comparingInt((Surveillant s) -> s.getNbrSurveillance())
                        .thenComparing(s -> getPreferenceForExam(s, exam, choices.get(s.getId())), Comparator.reverseOrder()))
                .findFirst()
                .orElse(null);
    }

    private int getPreferenceForExam(Surveillant s, Examen e, List<Choix> choices) {
        return choices.stream()
                .filter(c -> c.getExamen().equals(e))
                .mapToInt(Choix::getOrdre)
                .findFirst()
                .orElse(-1);
    }

    public List<Affectation> getAllAffectations() {
        return affectationRepo.findAll();
    }
}