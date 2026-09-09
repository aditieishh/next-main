package com.next.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendReply(String to, String name, String reply) {

        SimpleMailMessage message = new SimpleMailMessage();

        // Gmail's SMTP servers frequently reject sends with no explicit
        // From header, or one that doesn't match the authenticated account.
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject("Response to your feedback - NEXT");
        message.setText(
                "Hi " + name + ",\n\n" +
                reply +
                "\n\n" +
                "Thank you for taking the time to share your feedback with us!\n\n" +
                "Regards,\n" +
                "NEXT Team"
        );

        mailSender.send(message);
    }
}