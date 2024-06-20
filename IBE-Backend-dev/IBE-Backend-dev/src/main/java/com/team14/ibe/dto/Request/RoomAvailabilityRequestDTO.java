package com.team14.ibe.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomAvailabilityRequestDTO {
    private Long propertyId;
    private Long roomTypeId;
    private String checkInDate;
    private String checkOutDate;
    private String bookingId;
    private int numberOfRooms;
}