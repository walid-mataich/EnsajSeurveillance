package com.example.surveillance.repositories;


import com.example.surveillance.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public interface SalleRepository extends JpaRepository<Salle, Integer> {


}
