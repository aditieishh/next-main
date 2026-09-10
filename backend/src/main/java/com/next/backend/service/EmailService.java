package com.next.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

   
    @Async
    public void sendReply(String to, String name, String reply) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            
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

        } catch (Exception e) {
            
            log.error("Failed to send reply email to {}: {}", to, e.getMessage(), e);
        }
    }
}