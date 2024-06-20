package com.team14.ibe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class PromotionResponseDTO {
    private String promotionDescription;
    private int promotionId;
    private String promotionTitle;
    private boolean isDeactivated;
    private int minimumDaysOfStay;
    private double priceFactor;
    private boolean isCancelled;
}

