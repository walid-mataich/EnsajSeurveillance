package com.example.surveillance.controllers;


import com.example.surveillance.entity.Surveillant;
import com.example.surveillance.services.SurveillantService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/surveillants")
@CrossOrigin(origins = "*")
public class SurveillantController {

    private final SurveillantService surveillantService;


    public SurveillantController(SurveillantService surveillantService) {
        this.surveillantService = surveillantService;
    }

    @GetMapping
    public List<Surveillant> getAllSurveillants(){
        return surveillantService.getAllSurveillants();
    }
}
