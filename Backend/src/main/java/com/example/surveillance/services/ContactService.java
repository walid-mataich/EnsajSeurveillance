package com.example.surveillance.services;

import com.example.surveillance.entity.Contact;
import com.example.surveillance.repositories.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    @Autowired
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<Contact> getAllMessages() {
        return contactRepository.findAll();
    }

    public boolean messageExists(Long id) {
        return contactRepository.existsById(id);
    }

    public void deleteMessage(Long id) {
        contactRepository.deleteById(id);
    }

    public void deleteAllMessages() {
        contactRepository.deleteAll();
    }
    public Contact saveMessage(Contact contact) {
        return contactRepository.save(contact);
    }
}