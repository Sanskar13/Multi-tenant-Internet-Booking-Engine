package com.team14.ibe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateBookingResponse {
    private Long bookingId;
    private String checkInDate;
    private String checkOutDate;
    private int adultCount;
    private int childCount;
    private double totalCost;
    private double amountDueAtResort;
    private Long guestId;
    private Long propertyId;
    private Long statusId;
    private Long promotionId;
}
