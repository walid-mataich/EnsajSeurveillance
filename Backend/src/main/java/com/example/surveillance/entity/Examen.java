package com.example.surveillance.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@NoArgsConstructor
@Entity
@Data
public class Examen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idExamen;

    @NotNull (message = "le jour est necessaire")
    private LocalDate jour;

    @NotNull(message = "la date de debut est necessaire")
    private LocalTime debut;

    @NotNull(message = "la date de fin est necessaire")
    private LocalTime fin;


    @OneToMany(mappedBy = "examen")
    @JsonManagedReference("examen-choix")
    private List<Choix> lesChoix;



    @OneToMany(mappedBy = "examen")
    @JsonManagedReference("examen-affectation")
    private List<Affectation> affectations;



    @ManyToOne()
    @JsonBackReference("matiere-examen")
    @JoinColumn(name = "idMatiere")
    private Matiere matiere;

    public Examen(LocalDate jour,LocalTime debut, LocalTime fin,Matiere matiere) {
        this.jour = jour;
        this.debut = debut;
        this.fin = fin;
        this.matiere = matiere;
    }


}
