package com.example.surveillance.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Affectation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idAffectation;

    @ManyToOne
    @JsonBackReference("examen-affectation")
    @JoinColumn(name = "idExamen")
    private Examen examen;

    @ManyToOne
    @JsonBackReference("surveillant-affectation")
    @JoinColumn(name = "id")
    private Surveillant surveillant;

    @ManyToOne
    @JsonBackReference("salle-Affectation")
    @JoinColumn(name = "idSalle")
    private Salle salle;




}
