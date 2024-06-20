package com.team14.ibe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RatingReviewResponseDTO {
    private Long propertyId;
    private Long roomTypeId;
    private double averageRating;
    private int reviewCount;
}
