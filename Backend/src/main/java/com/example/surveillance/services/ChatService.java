package com.example.surveillance.services;

import com.example.surveillance.dto.*;
import com.example.surveillance.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final RestClient restClient;
    private final ExamenRepository examenRepository;
    private final AffectationRepository affectationRepository;
    private final SalleRepository salleRepository;

    @Autowired
    public ChatService(RestClient restClient,
                       ExamenRepository examenRepository,
                       AffectationRepository affectationRepository,
                       SalleRepository salleRepository) {
        this.restClient = restClient;
        this.examenRepository = examenRepository;
        this.affectationRepository = affectationRepository;
        this.salleRepository = salleRepository;
    }

    @Value("${openapi.api.key}")
    private String apiKey;

    @Value("${openapi.api.model}")
    private String model;

    // Multilingual keywords for exam-related prompts
    private static final List<String> examKeywords = List.of(
            "exam", "examen", "matiere", "matière", "salle", "room",
            "surveillant", "prof", "teacher", "who is going to surveille",
            "qui va surveiller", "planning", "horaire", "schedule",
            "algorithmique", "maths", "physique"
    );

    private boolean isExamRelated(String prompt) {
        String loweredPrompt = prompt.toLowerCase();
        return examKeywords.stream().anyMatch(loweredPrompt::contains);
    }

    public String getChatResponse(PromptRequest promptrequest) {
        String userPrompt = promptrequest.prompt();
        String fullPrompt;

        if (isExamRelated(userPrompt)) {
            String examInfo = examenRepository.findAll().stream()
                    .map(examen -> String.format("Matiere: %s, Date: %s, Debut: %s, Fin: %s",
                            examen.getMatiere().getNomMatiere(),
                            examen.getJour(),
                            examen.getDebut(),
                            examen.getFin()))
                    .collect(Collectors.joining("\n"));

            String salleInfo = salleRepository.findAll().stream()
                    .map(salle -> String.format("Salle: %s, Type: %s, Nombre de surveillants: %s",
                            salle.getNomSale(),
                            salle.getType(),
                            salle.getNbrDeSurveillant()))
                    .collect(Collectors.joining("\n"));

            String affectationInfo = affectationRepository.findAll().stream()
                    .map(affectation -> String.format("Matiere: %s, Surveillant: %s, Salle: %s",
                            affectation.getExamen(),
                            affectation.getSurveillant(),
                            affectation.getSalle()))
                    .collect(Collectors.joining("\n"));

            fullPrompt = String.format("""
                    CONTEXTE :
                    Voici les données de la base :
                    Examens :
                    %s

                    Salles :
                    %s

                    Affectations :
                    %s

                    INSTRUCTIONS :
                    Réponds uniquement à la question suivante de manière concise, directe et précise.
                    Ne donne pas de contexte, d'explication ou d'informations supplémentaires.

                    QUESTION :
                    %s
                    """, examInfo, salleInfo, affectationInfo, userPrompt);
        } else {
            fullPrompt = userPrompt;
        }

        ChatRequest chatRequest = new ChatRequest(
                model,
                List.of(new ChatRequest.Message("user", fullPrompt))
        );

        ChatResponse response = restClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .body(chatRequest)
                .retrieve()
                .body(ChatResponse.class);

        return response.choices().get(0).message().content();
    }
}
