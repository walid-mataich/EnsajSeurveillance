package com.example.surveillance.mailing;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.File;

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

    @Async
    public void sendHtmlMail(String to, String fullName, String planningUrl) {
        try {
            if (to == null || to.isEmpty()) {
                System.out.println("Email non envoyé : destinataire vide.");
                return;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("your_email@gmail.com");
            helper.setTo(to);
            helper.setSubject("📅 Votre planning de surveillance est disponible");

            // Utilisation du chemin absolu pour accéder à l'image
            FileSystemResource logo = new FileSystemResource(new File("src/main/resources/logo.png")); // Chemin vers ton logo dans resources

            String htmlContent = "<!DOCTYPE html><html><body style='font-family: Arial, sans-serif;'>" +
                    "<div style='max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;padding:20px;'>" +
                    "<h2 style='color:#004080;'>Bonjour " + fullName + ",</h2>" +
                    "<p>Votre <strong>planning de surveillance</strong> est désormais disponible.</p>" +
                    "<p>Veuillez cliquer sur le bouton ci-dessous pour le consulter :</p>" +
                    "<p style='text-align:center;margin:30px 0;'>" +
                    "<a href='" + planningUrl + "' style='background-color:#004080;color:#fff;padding:12px 24px;" +
                    "text-decoration:none;border-radius:6px;display:inline-block;'>Voir mon planning</a>" +
                    "</p>" +
                    "<p>Merci de vérifier vos créneaux et de nous signaler toute anomalie.</p>" +
                    "<p style='margin-top:40px;'>Cordialement,<br>Administration<br>Survensaj</p>" +
                    "<p><img src='cid:logo' alt='Logo' style='width: 150px; height: auto; margin-bottom: 20px;' /></p>" +  // Image inline avec CID
                    "</div></body></html>";

            helper.setText(htmlContent, true); // true = HTML
            helper.addInline("logo", logo); // Ajout du logo en inline avec l'identifiant CID ("logo")

            mailSender.send(message);
            System.out.println("Email HTML envoyé avec succès à " + to);
        } catch (MessagingException e) {
            System.err.println("Erreur lors de l'envoi du mail à " + to + ": " + e.getMessage());
            e.printStackTrace();
        }
    }


}
