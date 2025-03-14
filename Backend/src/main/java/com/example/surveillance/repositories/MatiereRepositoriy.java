package com.example.surveillance.repositories;

import com.example.surveillance.entity.Matiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface MatiereRepositoriy extends JpaRepository<Matiere,Integer> {

}
