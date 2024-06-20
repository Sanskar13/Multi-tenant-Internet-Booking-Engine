package com.team14.ibe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class RoomRateDTO {
    private double basicNightlyRate;
    private String date;
    private String roomTypeName;
}
