package com.example.surveillance.dto;

import java.util.List;

public record ChatRequest(String model, List<Message> messages) {

    public static record Message(String role, String content) {}
}
