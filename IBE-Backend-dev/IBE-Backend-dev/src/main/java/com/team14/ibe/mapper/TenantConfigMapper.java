package com.team14.ibe.mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.team14.ibe.dto.TenantConfigDTO;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class TenantConfigMapper {

    private final ObjectMapper objectMapper;

    public TenantConfigMapper() {
        this.objectMapper = new ObjectMapper();
    }

    public TenantConfigDTO mapToDTO(Map<String, Object> configData) throws IOException {
        TenantConfigDTO dto = new TenantConfigDTO();
        dto.setHeaderLogoImageUrl((String) configData.get("headerLogoImageUrl"));
        dto.setPageTitleText((String) configData.get("pageTitleText"));
        dto.setBannerImageUrl((String) configData.get("bannerImageUrl"));
        dto.setMaxStayDays((int) configData.get("maxStayDays"));
        dto.setGuestTypes((String[]) configData.get("guestTypes"));
        dto.setMaxGuestCount((int) configData.get("maxGuestCount"));
        dto.setRoomCountOptions((Integer[]) configData.get("roomCountOptions"));
        dto.setMaxRooms((int) configData.get("maxRooms"));
        return dto;
    }

    public Map<String, Object> mapToMap(String jsonData) throws IOException {
        return objectMapper.readValue(jsonData, new TypeReference<Map<String, Object>>() {
        });
    }
}
