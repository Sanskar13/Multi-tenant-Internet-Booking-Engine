package com.team14.ibe.dto.response;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PromoCodeResponseDTO {
    private boolean isValid;
    private String promocode;
    private double discount;
}
