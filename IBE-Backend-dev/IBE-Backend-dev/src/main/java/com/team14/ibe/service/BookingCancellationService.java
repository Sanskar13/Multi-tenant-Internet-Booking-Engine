package com.team14.ibe.service;

import com.team14.ibe.models.AvailabilityEntity;
import com.team14.ibe.repository.AvailabilityRepository;
import com.team14.ibe.repository.PurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingCancellationService {

    private final AvailabilityRepository availabilityRepository;
    private final BookingMutationService bookingMutationService;


    @Autowired
    public BookingCancellationService(AvailabilityRepository availabilityRepository, BookingMutationService bookingMutationService, PurchaseRepository purchaseRepository) {
        this.availabilityRepository = availabilityRepository;
        this.bookingMutationService = bookingMutationService;
    }

    public boolean cancelBooking(String bookingId) {
        // removal
            // from booking_concurrency db since that date is removed
        try {
            List<AvailabilityEntity> bookingsToCancel = availabilityRepository.findByBookingId(bookingId);
            for (AvailabilityEntity booking : bookingsToCancel) {
                bookingMutationService.updateRoomAvailability(booking.getAvailabilityId(), 0L);
                availabilityRepository.delete(booking);
            }
            return true;
        }  catch (Exception e) {
            return false;
        }
    }
}
