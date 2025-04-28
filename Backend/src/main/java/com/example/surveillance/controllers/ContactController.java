package com.example.surveillance.controllers;

import com.example.surveillance.entity.Contact;
import com.example.surveillance.services.ContactService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/Contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }
    @PostMapping
    public ResponseEntity<Contact> createMessage(@RequestBody Contact contact) {
        contact.setDateEnvoi(LocalDateTime.now());
        Contact savedContact = contactService.saveMessage(contact);
        return new ResponseEntity<>(savedContact, HttpStatus.CREATED);
    }
    @GetMapping
    public List<Contact> getAllMessages() {
        List<Contact> messages = contactService.getAllMessages();
        return messages;
    }
    @DeleteMapping("supprimer/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        if (contactService.messageExists(id)) {
            contactService.deleteMessage(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @DeleteMapping
    public ResponseEntity<Void> deleteAllMessages() {
        contactService.deleteAllMessages();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
