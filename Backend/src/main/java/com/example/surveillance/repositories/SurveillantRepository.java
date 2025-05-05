package com.example.surveillance.repositories;

import com.example.surveillance.entity.Administrateur;
import com.example.surveillance.entity.Surveillant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveillantRepository extends JpaRepository<Surveillant,Long> {
    Surveillant findByEmail(String email);

    @Query("SELECT s FROM Surveillant s WHERE s.actif=true")
    List<Surveillant> findByActifTrue();
    @Query("SELECT COUNT(s) FROM Surveillant s WHERE s.type = 'Professeur'")
    long countByTypeProfesseur();

    // Méthode pour compter le nombre de surveillants de type "Vacataire"
    @Query("SELECT COUNT(s) FROM Surveillant s WHERE s.type = 'Vacataire'")
    long countByTypeVacataire();

    // Méthode pour compter le nombre de surveillants de type "Doctorant"
    @Query("SELECT COUNT(s) FROM Surveillant s WHERE s.type = 'Doctorant'")
    long countByTypeDoctorant();

    boolean existsByEmail(String email);
}
