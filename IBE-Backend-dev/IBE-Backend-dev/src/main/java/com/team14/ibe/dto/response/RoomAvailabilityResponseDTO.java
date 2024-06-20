package com.team14.ibe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomAvailabilityResponseDTO {
    private Long availabilityId;
    private Long bookingId;
    private String date;
    private Long roomId;
}
