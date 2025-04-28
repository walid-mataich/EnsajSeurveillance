package com.example.surveillance.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private LocalDateTime dateEnvoi=LocalDateTime.now();
    public Contact(String nom, String email, String message) {
        this.nom = nom;
        this.email = email;
        this.message = message;
    }
    public Contact() {

    }

}
