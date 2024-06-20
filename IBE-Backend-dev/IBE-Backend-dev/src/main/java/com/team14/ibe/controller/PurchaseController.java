package com.team14.ibe.controller;
import com.team14.ibe.dto.Request.CancelBookingRequestDTO;
import com.team14.ibe.dto.Request.PurchaseDTO;
import com.team14.ibe.dto.response.PurchaseResponseDTO;
import com.team14.ibe.models.PurchaseEntity;
import com.team14.ibe.models.Wallet;
import com.team14.ibe.repository.PurchaseRepository;
import com.team14.ibe.repository.WalletRepository;
import com.team14.ibe.service.BookingCancellationService;
import com.team14.ibe.service.PurchaseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
public class PurchaseController {

    private PurchaseService purchaseService;
    private PurchaseRepository purchaseRepository;
    private BookingCancellationService bookingCancellationService;
    private WalletRepository walletRepository;

    @Autowired
    public PurchaseController(PurchaseService purchaseService, PurchaseRepository purchaseRepository, BookingCancellationService bookingCancellationService, WalletRepository walletRepository) {
        this.purchaseService = purchaseService;
        this.purchaseRepository = purchaseRepository;
        this.bookingCancellationService = bookingCancellationService;
        this.walletRepository = walletRepository;
    }

    @PostMapping("/checkformdata")
    public ResponseEntity<?> checkFormData(@RequestBody PurchaseDTO mappedData) {
        try {
            boolean success = purchaseService.checkFormData(mappedData);
            if (success) {
                return ResponseEntity.ok("Purchase successful!");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to purchase");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @GetMapping("/purchases")
    public ResponseEntity<List<PurchaseResponseDTO>> getAllPurchases() {
        List<PurchaseResponseDTO> purchases = purchaseService.getAllPurchases();
        return ResponseEntity.ok(purchases);
    }

    @PostMapping("/cancel-booking")
    public ResponseEntity<String> cancelBooking(@RequestBody CancelBookingRequestDTO request) {
        String bookingId = request.getBookingId();
        String email = request.getEmail();
        long totalAmount = request.getTotalAmount();

        Wallet wallet = new Wallet(email, totalAmount);
        walletRepository.save(wallet);

        log.info("Booking cancellation requested for bookingId: {}", bookingId);

        try {
            boolean cancellationSuccess = bookingCancellationService.cancelBooking(bookingId);
            if (cancellationSuccess) {
                PurchaseEntity purchaseEntity = purchaseRepository.findByBookingId(bookingId);
                if(purchaseEntity != null) {
                    purchaseEntity.setCancelled(true);
                    purchaseRepository.delete(purchaseEntity);
                    purchaseRepository.save(purchaseEntity);

                }
                purchaseRepository.save(purchaseRepository.findByBookingId(bookingId));
                log.info("Booking cancelled successfully for bookingId: {}", bookingId);
                return ResponseEntity.ok("Booking cancelled successfully");
            } else {
                log.error("Failed to cancel booking for bookingId: {}", bookingId);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to cancel booking");
            }
        } catch (Exception e) {
            log.error("Error cancelling booking for bookingId: {}", bookingId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @GetMapping("/wallet-details")
    public ResponseEntity<List<Wallet>> getAllWalletDetails() {
        List<Wallet> walletDetails = walletRepository.findAll();
        if (walletDetails != null && !walletDetails.isEmpty()) {
            return ResponseEntity.ok(walletDetails);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping("/save-wallet")
    public ResponseEntity<String> saveWallet(@RequestBody Wallet walletDTO) {
        String email = walletDTO.getEmail();
        long totalAmount = walletDTO.getTotalAmount();
        Wallet wallet = new Wallet(email, totalAmount);
        walletRepository.save(wallet);

        log.info("Wallet saved successfully for email: {}", email);
        return ResponseEntity.ok("Wallet saved successfully");
    }
}
