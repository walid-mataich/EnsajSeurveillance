package com.example.surveillance.services;

import com.example.surveillance.entity.*;
import com.example.surveillance.repositories.AffectationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AffectationService {

    private final AffectationRepository affectationRepository;

    @Autowired
    public AffectationService(AffectationRepository affectationRepository) {
        this.affectationRepository = affectationRepository;
    }

    public List<Affectation> getAllAffectations() {
        return affectationRepository.findAll();
    }

    public List<Affectation> generateAffectations(List<Examen> exams,
                                                  List<Surveillant> surveillants,
                                                  List<Salle> salles) {
        List<Affectation> affectations = new ArrayList<>();

        // Sort exams chronologically
        exams.sort(Comparator.comparing(Examen::getJour)
                .thenComparing(Examen::getDebut));

        // Track surveillant workload
        Map<Surveillant, Integer> workload = new HashMap<>();
        surveillants.forEach(s -> workload.put(s, s.getNbrSurveillance()));

        // Track salle usage to avoid double booking
        Map<Salle, Set<Examen>> salleUsage = new HashMap<>();
        salles.forEach(s -> salleUsage.put(s, new HashSet<>()));

        for (Examen exam : exams) {
            // Get available surveillants for this exam (not marked as -1 in choix)
            List<Surveillant> availableSurveillants = surveillants.stream()
                    .filter(s -> isAvailable(s, exam))
                    .sorted(Comparator.comparingInt(s -> getPreferenceScore(s, exam)))
                    .collect(Collectors.toList());

            // Get required number of surveillants based on salle count
            int requiredSurveillants = exam.getNbrDesSalles();

            // Select surveillants with least workload first, considering preferences
            List<Surveillant> selectedSurveillants = availableSurveillants.stream()
                    .sorted(Comparator.comparingInt(workload::get))
                    .limit(requiredSurveillants)
                    .collect(Collectors.toList());

            if (selectedSurveillants.size() < requiredSurveillants) {
                throw new RuntimeException("Not enough available surveillants for exam: " + exam.getIdExamen());
            }

            // Get available salles (not already used for this exam time)
            List<Salle> availableSalles = salles.stream()
                    .filter(s -> isSalleAvailable(s, exam, salleUsage))
                    .collect(Collectors.toList());

            if (availableSalles.size() < requiredSurveillants) {
                throw new RuntimeException("Not enough available salles for exam: " + exam.getIdExamen());
            }

            // Randomly assign salles to surveillants
            Collections.shuffle(availableSalles);

            for (int i = 0; i < requiredSurveillants; i++) {
                Surveillant surveillant = selectedSurveillants.get(i);
                Salle salle = availableSalles.get(i);

                Affectation affectation = new Affectation();
                affectation.setExamen(exam);
                affectation.setSurveillant(surveillant);
                affectation.setSalle(salle);

                affectations.add(affectation);
                workload.put(surveillant, workload.get(surveillant) + 1);
                salleUsage.get(salle).add(exam);
            }
        }

        return affectations;
    }

    private boolean isAvailable(Surveillant surveillant, Examen exam) {
        return surveillant.getLesChoix().stream()
                .filter(c -> c.getExamen().equals(exam))
                .mapToInt(Choix::getOrdre)
                .findFirst()
                .orElse(0) != -1; // Default to available if no choice exists
    }

    private int getPreferenceScore(Surveillant surveillant, Examen exam) {
        return surveillant.getLesChoix().stream()
                .filter(c -> c.getExamen().equals(exam))
                .mapToInt(Choix::getOrdre)
                .findFirst()
                .orElse(0); // Default to neutral preference if no choice exists
    }

    private boolean isSalleAvailable(Salle salle, Examen exam, Map<Salle, Set<Examen>> salleUsage) {
        return salleUsage.get(salle).stream()
                .noneMatch(e -> e.conflictsWith(exam));
    }
}