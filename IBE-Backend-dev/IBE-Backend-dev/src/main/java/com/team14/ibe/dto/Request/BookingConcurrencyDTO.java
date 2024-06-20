package com.team14.ibe.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingConcurrencyDTO {
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Long roomId;
}
