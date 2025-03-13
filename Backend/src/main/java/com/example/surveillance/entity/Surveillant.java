package com.example.surveillance.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@NoArgsConstructor
@Entity
@Data
public class Surveillant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "le nom de profile est obligatoire")
    private String username;

    @NotBlank(message = "le nom est obligatoire")
    private String nom;


    @Email(message = "cet email est nom valide")
    private String email;

    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    @Size(min = 8, max = 20, message = "Le mot de passe doit contenir entre 8 et 20 caractères")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial")
    private String password;



    @NotBlank(message = "Le type du serveillant est obligatoire")
    private String type;


    private int nbrSurveillance = 0;

    public Surveillant(String username, Long id, String nom, String email, String password,String type, int nbrSurveillance) {
        this.username = username;
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.password = password;
        this.type = type;
        this.nbrSurveillance = nbrSurveillance;
    }




    @OneToMany(mappedBy = "chefDeModule")
    @JsonManagedReference("surveillant-matiere")
    private List<Matiere> matieres;


    @OneToMany(mappedBy = "surveillant")
    @JsonManagedReference("surveillant-choix")
    private List<Choix> lesChoix;



    @OneToMany(mappedBy = "surveillant")
    @JsonManagedReference("surveillant-affectation")
    private List<Affectation> affectations;

    


}



