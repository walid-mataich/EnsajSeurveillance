package com.example.surveillance.entity;



import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;


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

    @NotNull(message = "entrer le nombre de salles")
    private Integer nbrDesSalles;


//    @JsonManagedReference("examen-choix")
//    @OneToMany(mappedBy = "examen")
//    @JsonIgnore
//    private List<Choix> lesChoix;


    @ManyToMany
    @JoinTable(
            name = "salle_examen",
            joinColumns = @JoinColumn(name = "id_examen"),
            inverseJoinColumns = @JoinColumn(name = "id_salle")
    )
    Set<Salle> salles;



    @ManyToOne
    @JoinColumn(name = "matier_id")
    private Matiere matiere;

    public Examen(LocalDate jour,LocalTime debut, LocalTime fin,Matiere matiere) {
        this.jour = jour;
        this.debut = debut;
        this.fin = fin;
        this.matiere = matiere;
    }

    public boolean conflictsWith(Examen other) {
        return this.jour.equals(other.jour) &&
                !(this.fin.isBefore(other.debut) || other.fin.isBefore(this.debut));
    }

}
