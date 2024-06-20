package com.team14.ibe.mapper;//package com.team14.ibe.mapper;

import com.team14.ibe.dto.Request.CreateBookingRequestDTO;
import com.team14.ibe.models.PurchaseEntity;

import java.time.LocalDate;

public class CreateBookingResponseDTOMapper {

    public CreateBookingRequestDTO mapToBookingRequestDTO(PurchaseEntity purchase) {
        CreateBookingRequestDTO bookingRequest = new CreateBookingRequestDTO();
        bookingRequest.setCheckInDate(purchase.getStartDate() != null ? purchase.getStartDate().toString() : LocalDate.now().toString());
        bookingRequest.setCheckOutDate(purchase.getEndDate() != null ? purchase.getEndDate().toString() : LocalDate.now().plusDays(3).toString());
        bookingRequest.setAdultCount(purchase.getAdultCount());
        bookingRequest.setChildCount(purchase.getChildCount());
        bookingRequest.setTotalCost((int) purchase.getTotalAmount());
        bookingRequest.setAmountDueAtResort((int) purchase.getTotalAmount());
        bookingRequest.setGuestName(purchase.getTravelfirstName());
        bookingRequest.setStatusId(purchase.getStatusId());
        bookingRequest.setPropertyId(purchase.getPropertyId());
        bookingRequest.setPriceFactor(purchase.getPriceFactor());
        bookingRequest.setPromotionTitle(purchase.getPromotionTitle());
        bookingRequest.setPromotionDescription(purchase.getPromotionDescription());

        return bookingRequest;
    }

}
