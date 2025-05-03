package com.example.surveillance.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class AffectationHistorique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "idSurveillant")
    private Surveillant surveillant;

    private String nomMatiere;

    private String salle;


    private LocalDate jour;


    private LocalTime debut;


    private LocalTime fin;
}
