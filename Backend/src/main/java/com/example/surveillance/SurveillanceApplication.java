package com.example.surveillance;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SurveillanceApplication {

	public static void main(String[] args) {

		SpringApplication.run(SurveillanceApplication.class, args);
		
	}

}
