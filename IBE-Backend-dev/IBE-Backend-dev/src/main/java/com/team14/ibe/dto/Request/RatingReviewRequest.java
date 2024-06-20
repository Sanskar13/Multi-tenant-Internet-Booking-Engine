package com.team14.ibe.dto.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RatingReviewRequest {
    private Long propertyId;
    private Long roomTypeId;
    private int rating;
}
