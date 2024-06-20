package com.team14.ibe.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateBookingRequestDTO {

    private String checkInDate;
    private String checkOutDate;
    private int adultCount;
    private int childCount;
    private int totalCost;
    private int amountDueAtResort;
    private String guestName;
    private int statusId;
    private int propertyId;
    private double priceFactor;
    private String promotionTitle;
    private String promotionDescription;
    private int promotionId;
}
