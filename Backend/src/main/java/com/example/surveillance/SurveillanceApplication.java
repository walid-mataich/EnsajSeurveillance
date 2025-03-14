package com.example.surveillance;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SurveillanceApplication {

	public static void main(String[] args) {

		// Charger les variables d'environnement depuis .env
		Dotenv dotenv = Dotenv.load();
		System.setProperty("OPENAI_API_KEY", dotenv.get("OPENAI_API_KEY"));

		SpringApplication.run(SurveillanceApplication.class, args);
		
	}

}
