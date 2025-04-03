package com.example.surveillance.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
public class Choix {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idChoix;

    @NotBlank
    private int ordre;

    @ManyToOne
    @JoinColumn(name = "idExamen")
    private Examen examen;


    @ManyToOne
    @JoinColumn(name = "id")
    private Surveillant surveillant;

    public Choix(Examen examen, Surveillant surveillant){
        this.examen = examen;
        this.surveillant = surveillant;

    }


}
