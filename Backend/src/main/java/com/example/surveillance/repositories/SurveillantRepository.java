package com.example.surveillance.repositories;

import com.example.surveillance.entity.Surveillant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SurveillantRepository extends JpaRepository<Surveillant,Long> {


}
