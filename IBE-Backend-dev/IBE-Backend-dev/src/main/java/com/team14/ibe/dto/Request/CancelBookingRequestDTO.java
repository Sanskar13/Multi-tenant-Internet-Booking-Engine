package com.team14.ibe.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CancelBookingRequestDTO {
    private String bookingId;
    private String email;
    private long totalAmount;
}
