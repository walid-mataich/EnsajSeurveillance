package com.example.surveillance.services;

import com.example.surveillance.dto.ChatRequest;
import com.example.surveillance.dto.ChatResponse;
import com.example.surveillance.dto.PromptRequest;
import com.example.surveillance.repositories.ExamenRepository;
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

    @Autowired
    public ChatService(RestClient restClient, ExamenRepository examenRepository) {
        this.restClient = restClient;
        this.examenRepository = examenRepository;
    }

    @Value("${openapi.api.key}")
    private String apiKey;

    @Value("${openapi.api.model}")
    private String model;

    public String getChatResponse(PromptRequest promptrequest) {
        // Fetch all exams
        List<String> examenDetails = examenRepository.findAll().stream()
                .map(examen -> String.format("Examen ID: %d, Matiere: %s, Date: %s, Debut: %s, Fin: %s",
                        examen.getIdExamen(),
                        examen.getMatiere().getNomMatiere(),
                        examen.getJour(),
                        examen.getDebut(),
                        examen.getFin()))
                .collect(Collectors.toList());

        // Combine exam details with user prompt
        String prompt = String.join("\n", examenDetails) + "\n"+ "answer to this prompt, if it needs any information from the given info give it, if not just answer" + promptrequest.prompt();

        // Create the chat request
        ChatRequest chatRequest = new ChatRequest(
                model,
                List.of(new ChatRequest.Message("user", prompt))
        );

        // Call the API
        ChatResponse response = restClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .body(chatRequest)
                .retrieve()
                .body(ChatResponse.class);

        // Return the content from the chatbot response
        return response.choices().get(0).message().content();
    }
}
