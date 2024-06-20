package com.team14.ibe.controller;

import com.team14.ibe.dto.Request.CreateBookingRequestDTO;
import com.team14.ibe.dto.response.CreateBookingResponse;
import com.team14.ibe.service.BookingMutationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bookings")
public class MutationController {

    private final BookingMutationService bookingMutationService;

    @Autowired
    public MutationController(BookingMutationService bookingMutationService) {
        this.bookingMutationService = bookingMutationService;
    }

    @PostMapping("/create")
    public ResponseEntity<CreateBookingResponse> createBooking(@RequestBody CreateBookingRequestDTO requestDTO) {
        CreateBookingResponse response = bookingMutationService.createBooking(requestDTO);
        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            // If the response is null, it indicates an error occurred during booking creation
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
