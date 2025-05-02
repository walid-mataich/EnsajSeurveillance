package com.example.surveillance.repositories;


import com.example.surveillance.entity.Affectation;
import com.example.surveillance.entity.Surveillant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AffectationRepository extends JpaRepository<Affectation, Integer> {

    List<Affectation> findBySurveillant(Surveillant surveillant);
//    List<Affectation> findBySurveillantId(Long id);
    int countBySurveillant(Surveillant surveillant);
}
