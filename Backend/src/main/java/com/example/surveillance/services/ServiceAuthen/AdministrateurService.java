package com.example.surveillance.services.ServiceAuthen;

import com.example.surveillance.entity.Administrateur;

import java.util.List;

public interface AdministrateurService {

    List<Administrateur> getAllAdministrateurs();

    Administrateur findAdministrateurProfileByJwt(String jwt);

    Administrateur findAdministrateurByEmail(String email);

    Administrateur findAdministrateurById(Long id);

    List<Administrateur> findAllAdministrateurs();
}
