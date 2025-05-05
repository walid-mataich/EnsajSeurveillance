package com.example.surveillance.services;

import com.example.surveillance.dto.ChatRequest;
import com.example.surveillance.dto.ChatResponse;
import com.example.surveillance.dto.PromptRequest;
import com.example.surveillance.repositories.AffectationRepository;
import com.example.surveillance.repositories.ExamenRepository;
import com.example.surveillance.repositories.SalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ChatService {
    private final RestClient restClient;
    private final ExamenRepository examenRepository;
    private final AffectationRepository affectationRepository;
    private final SalleRepository salleRepository;

    @Value("${openapi.api.key}")
    private String apiKey;

    @Value("${openapi.api.model}")
    private String model;

    private static final List<String> examKeywords = List.of(
            "exam", "examen", "matiere", "salle", "surveillant","surveillances","qui","chef de module", "schedule", "planning",
            "heure", "quand", "où", "affectation", "surveille"
    );

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

    private boolean isExamRelated(String prompt) {
        if (prompt == null) return false;
        String lower = prompt.toLowerCase();
        return examKeywords.stream().anyMatch(lower::contains);
    }

    public String getChatResponse(PromptRequest request) {
        String userPrompt = request.prompt();
        String userName = request.user();

        List<ChatRequest.Message> messages = new ArrayList<>();

        // Prompt dyal System
        messages.add(new ChatRequest.Message("system",
                "Tu es un assistant administratif pour l'ENSAJ. " +
                        "Réponds uniquement à partir des informations fournies ci-dessous. " +
                        "Si la question concerne la surveillance, donne uniquement les affectations qui correspondent à l'utilisateur. " +
                        "Sinon, donne des infos générales sur les examens ou les salles si pertinent. " +
                        "Si aucune information ne correspond, réponds que tu ne trouves pas de donnée correspondante."
        ));

        // context d exam related
        if (isExamRelated(userPrompt)) {

            // Exams
            String examInfo = examenRepository.findAll().stream()
                    .map(e -> String.format("Examen: %s, Date: %s, Heure: %s-%s, chef de module : %s, email de chef de module : %s",
                            e.getMatiere().getNomMatiere(), e.getJour(), e.getDebut(), e.getFin(),e.getMatiere().getChefDeModule().getNom(), e.getMatiere().getChefDeModule().getEmail()))
                    .collect(Collectors.joining(" | "));

            // salles
            String salleInfo = salleRepository.findAll().stream()
                    .map(s -> String.format("Salle: %s (%s), Surveillants requis: %d",
                            s.getNomSale(), s.getType(), s.getNbrDeSurveillant()))
                    .collect(Collectors.joining(" | "));

            // Surveillance (affectations) filtere b l user connecte
            String affInfo = affectationRepository.findAll().stream()
                    .filter(a -> a.getSurveillant().getNom().equalsIgnoreCase(userName))
                    .map(a -> String.format("Vous surveillez l'examen de %s dans la salle %s le %s de %s à %s",
                            a.getExamen().getMatiere().getNomMatiere(),
                            a.getSalle().getNomSale(),
                            a.getExamen().getJour(),
                            a.getExamen().getDebut(),
                            a.getExamen().getFin()))
                    .collect(Collectors.joining(" | "));

            messages.add(new ChatRequest.Message("system", "Données examens:\n" + examInfo));
            messages.add(new ChatRequest.Message("system", "Données salles:\n" + salleInfo));
            messages.add(new ChatRequest.Message("system", "Vos affectations:\n" + (affInfo.isEmpty() ? "Aucune affectation trouvée." : affInfo)));
        }

        messages.add(new ChatRequest.Message("system", "Utilisateur connecté: " + userName));
        messages.add(new ChatRequest.Message("user", userPrompt));

        ChatRequest chatRequest = new ChatRequest(model, messages);
        ChatResponse response = restClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .body(chatRequest)
                .retrieve()
                .body(ChatResponse.class);

        return response.choices().get(0).message().content().trim();
    }
}