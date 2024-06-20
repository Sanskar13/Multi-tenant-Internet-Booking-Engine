package com.team14.ibe.dto;

import lombok.Data;

@Data
public class TenantConfigDTO {
    private String headerLogoImageUrl;
    private String pageTitleText;
    private String bannerImageUrl;
    private int maxStayDays;
    private String[] guestTypes;
    private int maxGuestCount;
    private Integer[] roomCountOptions;
    private int maxRooms;
}
