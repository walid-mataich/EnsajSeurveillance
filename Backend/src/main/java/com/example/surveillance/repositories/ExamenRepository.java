package com.example.surveillance.repositories;


import com.example.surveillance.entity.Examen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamenRepository extends JpaRepository<Examen, Long> {

    List<Examen> findAllByOrderByJourAscDebutAsc();
}
