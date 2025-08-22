package com.cars.cars.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String token) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        String resetLink = frontendUrl + "/reset-password?token=" + token;

        helper.setTo(to);
        helper.setSubject("Password Reset Request");
        helper.setText(
            "<h1>Reset Your Password</h1>" +
            "<p>Click the link below to reset your password:</p>" +
            "<p><a href=\"" + resetLink + "\">Reset Password</a></p>" +
            "<p>This link will expire in 1 hour.</p>" +
            "<p>If you did not request a password reset, please ignore this email.</p>",
            true
        );

        mailSender.send(message);
    }
}