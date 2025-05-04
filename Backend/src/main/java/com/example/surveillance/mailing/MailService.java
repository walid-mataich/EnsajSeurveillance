package com.example.surveillance.mailing;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendMail(String to, String subject, String text) {
        try {
            if (to == null || to.isEmpty()) {
                System.out.println("Email non envoyé : destinataire vide.");
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom("your_email@gmail.com");
            message.setTo(to);
            message.setText(text);
            message.setSubject(subject);

            mailSender.send(message);

            System.out.println("Email sent successfully...");
        }catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email à " + to + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void sendHtmlMail(String to, String subject, String htmlContent) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // Le 'true' indique que c'est du HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'email", e);
        }
    }


}
