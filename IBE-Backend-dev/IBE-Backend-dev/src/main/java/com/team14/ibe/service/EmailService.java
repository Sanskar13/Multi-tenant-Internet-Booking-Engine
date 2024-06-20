package com.team14.ibe.service;

import com.azure.communication.email.EmailClient;
import com.azure.communication.email.models.EmailMessage;
import com.azure.communication.email.models.EmailSendResult;
import com.azure.core.util.polling.PollResponse;
import com.azure.core.util.polling.SyncPoller;
import com.team14.ibe.models.PurchaseEntity;
import com.team14.ibe.repository.PurchaseRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {
    @Autowired
    private EmailClient emailClient;
    private PurchaseRepository purchaseRepository;

    @Autowired
    public EmailService(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    public void sendEmail(String sender, String recipient, String roomid, String propertyId, String subject, String body) {
        String feedbackLink = body + "?roomid=" + roomid + "&propertyid=" + propertyId;

        EmailMessage message = new EmailMessage().setSenderAddress(sender).setToRecipients(recipient).setSubject(subject).setBodyPlainText(feedbackLink);

        SyncPoller<EmailSendResult, EmailSendResult> poller = emailClient.beginSend(message);
        PollResponse<EmailSendResult> response = poller.waitForCompletion();

        log.info("Operation Id: {}", response.getValue().getId());
    }

    public void sendOTPEmail(String senderEmail, String recipientEmail, String emailSubject, String otp) {
        String otpMessage = "<html><body style=\"font-family: Arial, sans-serif;\">" +
                "<div style=\"font-weight: bold; letter-spacing: 1px;\">Your OTP is: " + otp + "</div>" +
                "</body></html>";

        EmailMessage message = new EmailMessage()
                .setSenderAddress(senderEmail)
                .setToRecipients(recipientEmail)
                .setSubject(emailSubject)
                .setBodyHtml(otpMessage);

        SyncPoller<EmailSendResult, EmailSendResult> poller = emailClient.beginSend(message);
        PollResponse<EmailSendResult> response = poller.waitForCompletion();

        log.info("Operation Id: {}", response.getValue().getId());
    }

    public void sendbookingEmail(String senderEmail, String recipientEmail, String emailSubject, String bookingEmailId) {
        PurchaseEntity purchaseEntity = purchaseRepository.findByBookingId(bookingEmailId);
        String bookingLink = "https://white-dune-044f84310.4.azurestaticapps.net/booking?bookingId=" + bookingEmailId;
        String bookingMessage = "<html><body style=\"font-family: Arial, sans-serif;\">" +
                "<div style=\"font-weight: bold; letter-spacing: 1px;\">Booking ID: " + bookingEmailId + "</div>" +
                "<div>To view your booking details, click <a href=\"" + bookingLink + "\">here</a>.</div>" +
                "</body></html>";

        EmailMessage message = new EmailMessage()
                .setSenderAddress(senderEmail)
                .setToRecipients(recipientEmail)
                .setSubject(emailSubject)
                .setBodyHtml(bookingMessage);

        SyncPoller<EmailSendResult, EmailSendResult> poller = emailClient.beginSend(message);
        PollResponse<EmailSendResult> response = poller.waitForCompletion();

        log.info("Operation Id: {}", response.getValue().getId());

    }
}
