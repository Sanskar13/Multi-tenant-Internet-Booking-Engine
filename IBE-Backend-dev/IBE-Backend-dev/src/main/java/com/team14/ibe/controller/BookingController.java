//package com.team14.ibe.controller;
//
//import com.team14.ibe.dto.Request.BookingConcurrencyDTO;
//import com.team14.ibe.models.BookingConcurrency;
//import com.team14.ibe.service.BookingConcurrencyService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class BookingController {
//    @Autowired
//    private BookingConcurrencyService bookingService;
//
//    @PostMapping("/bookings")
//    public ResponseEntity<String> addBooking(@RequestBody BookingConcurrency newBooking) {
//        boolean isBookingSuccessful = bookingService.addBooking(newBooking);
//        if (isBookingSuccessful) {
//            return new ResponseEntity<>("Booking successful.", HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>("Overlapping interval. Booking rejected.", HttpStatus.BAD_REQUEST);
//        }
//    }
//}


package com.team14.ibe.controller;

import com.team14.ibe.dto.Request.BookingConcurrencyDTO;
import com.team14.ibe.models.BookingConcurrency;
import com.team14.ibe.service.BookingConcurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BookingController {
    @Autowired
    private BookingConcurrencyService bookingService;

    @PostMapping("/bookings")
    public ResponseEntity<String> addBooking(@RequestBody BookingConcurrencyDTO newBookingDTO) {
        BookingConcurrency newBooking = new BookingConcurrency(newBookingDTO.getCheckInDate(), newBookingDTO.getCheckOutDate(), newBookingDTO.getRoomId());
        boolean isBookingSuccessful = bookingService.addBooking(newBooking);
        if (isBookingSuccessful) {
            return new ResponseEntity<>("Booking successful.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Overlapping interval. Booking rejected.", HttpStatus.BAD_REQUEST);
        }
    }
}
