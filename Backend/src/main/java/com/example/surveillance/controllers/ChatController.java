package com.example.surveillance.controllers;

import com.example.surveillance.dto.PromptRequest;
import com.example.surveillance.services.ChatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

<<<<<<< HEAD


=======
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }
//test
>>>>>>> 0d8620b3a3db6b3c665aeb01c563e8147bc3dd86
    @PostMapping
    public String chat(@RequestBody PromptRequest promptRequest) {
        return chatService.getChatResponse(promptRequest);
    }
}

