package com.team14.ibe.service;

import com.team14.ibe.models.BookingConcurrency;
import com.team14.ibe.repository.BookingConcurrencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class BookingConcurrencyService {

    @Autowired
    private BookingConcurrencyRepository bookingRepository;

    public boolean addBooking(BookingConcurrency newBooking) {
        List<BookingConcurrency> existingBookings = bookingRepository.findAll();
        List<BookingConcurrency> mergedBookings = mergeIntervals(existingBookings, newBooking);
        if (hasOverlap(mergedBookings)) {
            return false;
        }

        BookingConcurrency booking = new BookingConcurrency(
                newBooking.getCheckInDate(),
                newBooking.getCheckOutDate(),
                newBooking.getRoomId()
        );
        bookingRepository.save(booking);
        return true;
    }

    private List<BookingConcurrency> mergeIntervals(List<BookingConcurrency> existingBookings, BookingConcurrency newBooking) {
        List<BookingConcurrency> intervals = new ArrayList<>(existingBookings);
        intervals.add(new BookingConcurrency(newBooking.getCheckInDate(), newBooking.getCheckOutDate(), newBooking.getRoomId()));

        intervals.sort(Comparator.comparing(BookingConcurrency::getCheckInDate));

        List<BookingConcurrency> mergedIntervals = new ArrayList<>();
        for (BookingConcurrency interval : intervals) {
            if (mergedIntervals.isEmpty() || mergedIntervals.get(mergedIntervals.size() - 1).getCheckOutDate().isBefore(interval.getCheckInDate())) {
                mergedIntervals.add(interval);
            } else {
                mergedIntervals.get(mergedIntervals.size() - 1).setCheckOutDate(
                        interval.getCheckOutDate().isAfter(mergedIntervals.get(mergedIntervals.size() - 1).getCheckOutDate()) ?
                                interval.getCheckOutDate() : mergedIntervals.get(mergedIntervals.size() - 1).getCheckOutDate());
            }
        }
        return mergedIntervals;
    }

    private boolean hasOverlap(List<BookingConcurrency> intervals) {
        for (int i = 1; i < intervals.size(); i++) {
            if (!intervals.get(i - 1).getCheckOutDate().isBefore(intervals.get(i).getCheckInDate())) {
                return true;
            }
        }
        return false;
    }

    public List<BookingConcurrency> getAllBookings() {
        return bookingRepository.findAll();
    }

}
