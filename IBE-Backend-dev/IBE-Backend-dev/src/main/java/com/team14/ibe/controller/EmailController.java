package com.team14.ibe.controller;

import com.team14.ibe.dto.Request.EmailRequest;
import com.team14.ibe.models.PurchaseEntity;
import com.team14.ibe.repository.PurchaseRepository;
import com.team14.ibe.service.EmailService;
import com.team14.ibe.service.PurchaseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

/**
 * Controller class to handle email sending functionality.
 */
@RestController
@Slf4j

public class EmailController {

    @Autowired
    private EmailService emailService;

    @Value("${email.sender}")
    public String senderEmail;

    @Value("${email.subject}")
    private String emailSubject;

    @Value("${email.body}")
    private String emailBody;

    @Value("${email.body}")
    private String bookingEmailId;
    private PurchaseRepository purchaseRepository;

    @Autowired
    public EmailController(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    /**
     * Endpoint to send an email.
     *
     * @param request The recipient email address.
     * @return ResponseEntity indicating the status of the email sending operation.
     */
    @PostMapping("/sendemail")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest request) {
        emailService.sendEmail(senderEmail, request.getEmail(), request.getRoomid(), request.getPropertyId(), emailSubject, emailBody);
        return new ResponseEntity<>("Email sent successfully!", HttpStatus.OK);
    }

    @GetMapping("/sendotpemail")
    public ResponseEntity<String> sendStringEmail(@RequestParam String bookingId) {
        log.info("booking cancel email is: {}", bookingId);
        PurchaseEntity purchaseEntity = purchaseRepository.findByBookingId(bookingId);
        String recipientEmail = purchaseEntity.getBillingemail();
        log.info("recipient email is: {}", recipientEmail);
        String message = generateOTP();
        emailService.sendOTPEmail(senderEmail, recipientEmail, emailSubject, message);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/sendbookingemail")
    public ResponseEntity<String> sendBookingEmail(@RequestParam String bookingId) {

        PurchaseEntity purchaseEntity = purchaseRepository.findByBookingId(bookingId);
        String email = "sarafsanskar468@gmail.com";
        if(purchaseEntity != null) {
            email = purchaseEntity.getTravelemail();
        }

        emailService.sendbookingEmail(senderEmail, email, emailSubject, bookingId);
        return new ResponseEntity<>("Booking email sent successfully!", HttpStatus.OK);
    }


    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
