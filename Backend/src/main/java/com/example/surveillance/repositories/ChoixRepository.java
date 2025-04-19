package com.example.surveillance.repositories;

import com.example.surveillance.entity.Choix;
import com.example.surveillance.entity.Examen;
import com.example.surveillance.entity.Surveillant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChoixRepository extends JpaRepository<Choix, Integer> {
    List<Choix> findAllBySurveillant_Id(Long surveillantId);
    Optional<Choix> findBySurveillantAndExamen(Surveillant surveillant, Examen examen);

    @Query("select count(DISTINCT c.surveillant) from Choix c")
    int countSurvAvecChoix();
}
