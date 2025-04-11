package com.example.surveillance.repositories;

import com.example.surveillance.entity.Choix;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChoixRepository extends JpaRepository<Choix, Integer> {
    List<Choix> findAllBySurveillant_Id(Long surveillantId);
}
