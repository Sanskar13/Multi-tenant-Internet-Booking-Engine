//package com.team14.ibe.tests;
//
//import com.team14.ibe.dto.TenantConfigDTO;
//import org.junit.jupiter.api.Test;
//import static org.junit.jupiter.api.Assertions.*;
//
//public class TenantConfigDTOTest {
//
//    @Test
//    public void testTenantConfigDTO() {
//        TenantConfigDTO configDTO = new TenantConfigDTO();
//        configDTO.setHeaderLogoImageUrl("logo.png");
//        configDTO.setPageTitleText("Welcome");
//        configDTO.setBannerImageUrl("banner.jpg");
//        configDTO.setMaxStayDays(14);
//        configDTO.setGuestTypes(new String[]{"Adults", "Teens", "Kids"});
//        configDTO.setMaxGuestCount(10);
//        configDTO.setRoomCountOptions(new Integer[]{1, 2, 3, 4, 5});
//        configDTO.setMaxRooms(5);
//
//        assertEquals("logo.png", configDTO.getHeaderLogoImageUrl());
//        assertEquals("Welcome", configDTO.getPageTitleText());
//        assertEquals("banner.jpg", configDTO.getBannerImageUrl());
//        assertEquals(14, configDTO.getMaxStayDays());
//        assertArrayEquals(new String[]{"Adults", "Teens", "Kids"}, configDTO.getGuestTypes());
//        assertEquals(10, configDTO.getMaxGuestCount());
//        assertArrayEquals(new Integer[]{1, 2, 3, 4, 5}, configDTO.getRoomCountOptions());
//        assertEquals(5, configDTO.getMaxRooms());
//    }
//}
