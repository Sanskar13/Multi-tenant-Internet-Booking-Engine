//package com.team14.ibe.dto.response;
//
//import org.junit.jupiter.api.Test;
//import static org.junit.jupiter.api.Assertions.assertEquals;
//
//public class RoomResponseDTOTest {
//
//    @Test
//    public void testRoomResponseDTO() {
//        // Arrange
//        int roomTypeId = 1;
//        String roomTypeName = "Standard Room";
//        int areaInSquareFeet = 300;
//        int singleBed = 1;
//        int doubleBed = 1;
//        int maxCapacity = 2;
//        Double rating = 4.5;
//        int reviewCount = 10;
//
//        // Act
//        RoomResponseDTO roomResponseDTO = new RoomResponseDTO(roomTypeId, roomTypeName, areaInSquareFeet, singleBed, doubleBed, maxCapacity, rating, reviewCount);
//
//        // Assert
//        assertEquals(roomTypeId, roomResponseDTO.getRoomTypeId());
//        assertEquals(roomTypeName, roomResponseDTO.getRoomTypeName());
//        assertEquals(areaInSquareFeet, roomResponseDTO.getAreaInSquareFeet());
//        assertEquals(singleBed, roomResponseDTO.getSingleBed());
//        assertEquals(doubleBed, roomResponseDTO.getDoubleBed());
//        assertEquals(maxCapacity, roomResponseDTO.getMaxCapacity());
//        assertEquals(rating, roomResponseDTO.getRating());
//        assertEquals(reviewCount, roomResponseDTO.getReviewCount());
//    }
//}
