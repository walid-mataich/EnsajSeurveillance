package com.example.surveillance.repositories;


import com.example.surveillance.entity.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RestController;

@RestController
public interface SalleRepository extends JpaRepository<Salle, Integer> {
}
