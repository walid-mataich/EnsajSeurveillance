package com.example.surveillance.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;


@NoArgsConstructor
@Entity
@Data
public class Examen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idExamen;

    @NotBlank(message = "la date de debut est necessaire")
    private Timestamp debut;

    @NotBlank(message = "la date de fin est necessaire")
    private Timestamp fin;


    @OneToMany(mappedBy = "examen")
    @JsonManagedReference("examen-choix")
    private List<Choix> lesChoix;



    @OneToMany(mappedBy = "examen")
    @JsonManagedReference("examen-affectation")
    private List<Affectation> affectations;



    @ManyToOne
    @JsonBackReference("matiere-examen")
    @JoinColumn(name = "idMatiere")
    private Matiere matiere;

    public Examen(Timestamp debut, Timestamp fin,Matiere matiere) {
        this.debut = debut;
        this.fin = fin;
        this.matiere = matiere;
    }


}
