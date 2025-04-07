package com.example.surveillance.services.ServiceAuthen;

import com.example.surveillance.entity.Surveillant;

import java.util.List;

public interface SurveillantService {

    List<Surveillant> getAllSurveillants();

    Surveillant findSurveillantProfileByJwt(String jwt);

    Surveillant findSurveillantByEmail(String email);

    Surveillant findSurveillantById(Long id);

    List<Surveillant> findAllSurveillants();


}