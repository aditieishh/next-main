package com.next.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendReply(String to, String name, String reply) {

        SimpleMailMessage message = new SimpleMailMessage();

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