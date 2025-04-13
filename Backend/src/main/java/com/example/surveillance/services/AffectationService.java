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
        List<Examen> exams = examenRepo.findAll();
        List<Surveillant> surveillants = surveillantRepo.findAll();

        // Total number of required surveillant slots (summing salle.nbrDeSurveillant)
        int totalSlots = exams.stream()
                .flatMap(e -> e.getSalles().stream())
                .mapToInt(Salle::getNbrDeSurveillant)
                .sum();

        int maxAssignments = (int) Math.ceil((double) totalSlots / surveillants.size());

        // Map of surveillant ID to their preference list (choices)
        Map<Long, List<Choix>> surveillantChoixMap = choixRepo.findAll().stream()
                .filter(c -> c.getOrdre() >= 0)
                .collect(Collectors.groupingBy(c -> c.getSurveillant().getId()));

        // Track surveillants already assigned in each exam to avoid reassigning them
        Map<Long, Set<Long>> assignedSurveillantsPerExam = new HashMap<>();

        for (Examen exam : exams) {
            Set<Long> alreadyAssigned = new HashSet<>();
            assignedSurveillantsPerExam.put(exam.getIdExamen(), alreadyAssigned);

            for (Salle salle : exam.getSalles()) {
                int required = salle.getNbrDeSurveillant();

                for (int i = 0; i < required; i++) {
                    Surveillant best = findBestSurveillant(
                            exam,
                            surveillantChoixMap,
                            alreadyAssigned,
                            maxAssignments
                    );

                    if (best != null) {
                        Affectation affectation = new Affectation();
                        affectation.setExamen(exam);
                        affectation.setSalle(salle);
                        affectation.setSurveillant(best);
                        affectationRepo.save(affectation);

                        best.setNbrSurveillance(best.getNbrSurveillance() + 1);
                        surveillantRepo.save(best);

                        alreadyAssigned.add(best.getId());
                    } else {
                        System.out.println("❌ No available surveillant for exam ID " + exam.getIdExamen()
                                + " in salle " + salle.getNomSale());
                    }
                }
            }
        }
    }

    private Surveillant findBestSurveillant(Examen exam,
                                            Map<Long, List<Choix>> choices,
                                            Set<Long> alreadyAssignedInExam,
                                            int maxAssignments) {
        return choices.values().stream()
                .flatMap(List::stream)
                .map(Choix::getSurveillant)
                .distinct()
                .filter(s -> s.getNbrSurveillance() < maxAssignments)
                .filter(s -> !alreadyAssignedInExam.contains(s.getId()))
                //.filter(s -> !hasConflict(s, exam)) // Uncomment this line if you want to prevent overlaps
                .sorted(Comparator
                        .comparingInt((Surveillant s) -> s.getNbrSurveillance())
                        .thenComparing(s -> getPreferenceForExam(s, exam, choices.get(s.getId()))))
                .findFirst()
                .orElse(null);
    }

    private int getPreferenceForExam(Surveillant s, Examen e, List<Choix> choices) {
        return choices.stream()
                .filter(c -> c.getExamen().equals(e))
                .mapToInt(Choix::getOrdre)
                .findFirst()
                .orElse(Integer.MAX_VALUE); // Higher value = less preferred
    }

    // Optional: Prevents a surveillant from being assigned to overlapping exams
    private boolean hasConflict(Surveillant s, Examen exam) {
        List<Affectation> affectations = affectationRepo.findBySurveillant(s);
        return affectations.stream()
                .map(Affectation::getExamen)
                .anyMatch(existing -> exam.conflictsWith(existing));
    }

    public List<Affectation> getAllAffectations() {
        return affectationRepo.findAll();
    }
}
