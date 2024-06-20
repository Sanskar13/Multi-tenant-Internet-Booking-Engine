package com.team14.ibe.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FilterDTO {
    private boolean singleBed = false;
    private boolean superDeluxe = false;
    private boolean familyDeluxe = false;
}
