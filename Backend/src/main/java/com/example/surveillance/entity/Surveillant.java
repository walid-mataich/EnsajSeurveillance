package com.example.surveillance.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    private Boolean tkw;

    
    @NotBlank
    private Boolean actif;


    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    @Size(min = 8, max = 20, message = "Le mot de passe doit contenir entre 8 et 20 caractères")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial")
   @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String role = "SURVEILLANT";



    @NotBlank(message = "Le type du serveillant est obligatoire")
    private String type;


    private int nbrSurveillance = 0;





//    @OneToMany(mappedBy = "chefDeModule")
//    @JsonManagedReference("surveillant-matiere")
//    private List<Matiere> matieres;

//    @JsonManagedReference("surveillant-choix")

//    @OneToMany(mappedBy = "surveillant")
//    @JsonIgnore
//    private List<Choix> lesChoix;



//    @OneToMany(mappedBy = "surveillant")
//    @JsonManagedReference("surveillant-affectation")
//    private List<Affectation> affectations;

    


}



