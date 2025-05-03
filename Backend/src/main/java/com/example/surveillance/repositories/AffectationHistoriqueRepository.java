package com.example.surveillance.repositories;


import com.example.surveillance.entity.AffectationHistorique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AffectationHistoriqueRepository extends JpaRepository<AffectationHistorique, Long> {
    List<AffectationHistorique> findBySurveillant_Id(Long surveillantId);
}
