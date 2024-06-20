package com.team14.ibe.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "booking_concurrency")
public class BookingConcurrency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Long roomId;

    public BookingConcurrency(LocalDate checkInDate, LocalDate checkOutDate, Long roomId) {
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.roomId = roomId;
    }

    public boolean isOverlap(LocalDate newCheckInDate, LocalDate newCheckOutDate) {
        return (this.checkInDate.isBefore(newCheckOutDate) && newCheckInDate.isBefore(this.checkOutDate)) ||
                (this.checkOutDate.isAfter(newCheckInDate) && this.checkOutDate.isBefore(newCheckOutDate));
    }

}
