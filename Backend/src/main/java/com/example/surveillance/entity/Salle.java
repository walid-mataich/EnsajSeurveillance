package com.example.surveillance.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@Entity
@NoArgsConstructor
public class Salle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idSalle;

    @NotBlank(message = "le nom de la salle est necesaire")
    private String nomSale;

    private String type;

    private int nbrDeSurveillant;




//    @ManyToMany(mappedBy = "salles")
//    @JsonManagedReference("exam-salle")
//    Set<Examen> examens;



//    @OneToMany(mappedBy = "salle")
//    @JsonManagedReference("salle-Affectation")
//    private List<Affectation> Affectation;

    public Salle(int idSalle, String nomSale) {
        this.idSalle = idSalle;
        this.nomSale = nomSale;
    }



}
