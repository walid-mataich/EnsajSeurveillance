package com.example.surveillance.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Entity
@Data
@NoArgsConstructor
public class Matiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idMatiere;
    private String nomMatiere;

    @NotBlank(message = "le niveau est necessaire (1 ou 2)")
    private int niveau;

    // Relation ManyToOne : Chaque matière a un seul chef de module
    @ManyToOne
    @JsonBackReference("surveillant-choix")
    @JoinColumn(name = "chef_de_modeule_id")  // La clé étrangère dans la table Matiere
    private Surveillant chefDeModule;  // Le chef de module responsable de la matière


    @OneToMany(mappedBy = "matiere")
    private List<Examen> examens;

    public Matiere(Surveillant chefDeModule) {
        this.chefDeModule = chefDeModule;
    }
}
