package com.team14.ibe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class RoomAvailabilityDTO {
    private String date;
    private int roomId;
    private String roomTypeName;

}