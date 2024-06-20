package com.team14.ibe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponseDTO {
    private int roomTypeId;
    private String roomTypeName;
    private int areaInSquareFeet;
    private int singleBed;
    private int doubleBed;
    private int maxCapacity;

    private Double rating;
    private int reviewCount;
}



