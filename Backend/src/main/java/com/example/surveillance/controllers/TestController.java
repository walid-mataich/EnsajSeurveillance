package com.example.surveillance.controllers;


import com.example.surveillance.dto.EmailRequest;
import com.example.surveillance.mailing.MailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {

    private final MailService mailService;

    public TestController(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping("mail")
    public String testMail(@RequestBody List<EmailRequest> emailRequests){
        for (EmailRequest req : emailRequests) {
            mailService.sendMail(req.getTo(), req.getSubject(), req.getBody());
        }
        return "les emails sont entrain d etre envoyes";
    }
}
