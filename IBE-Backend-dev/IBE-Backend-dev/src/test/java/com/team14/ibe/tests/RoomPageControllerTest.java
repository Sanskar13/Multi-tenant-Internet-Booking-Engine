////package com.team14.ibe.tests;
////
////import com.team14.ibe.controller.RoomPageController;
////import com.team14.ibe.dto.response.PromotionResponseDTO;
////import com.team14.ibe.dto.response.RoomResponseDTO;
////import com.team14.ibe.service.RoomPageService;
////import org.junit.jupiter.api.BeforeEach;
////import org.junit.jupiter.api.Test;
////import org.mockito.InjectMocks;
////import org.mockito.Mock;
////import org.mockito.MockitoAnnotations;
////import org.springframework.http.HttpStatus;
////import org.springframework.http.ResponseEntity;
////
////import java.util.ArrayList;
////import java.util.List;
////
////import static org.junit.jupiter.api.Assertions.assertEquals;
////import static org.mockito.Mockito.*;
////
////public class RoomPageControllerTest {
////
////    @Mock
////    private RoomPageService roomPageService;
////
////    @InjectMocks
////    private RoomPageController roomPageController;
////
////    @BeforeEach
////    public void setUp() {
////        MockitoAnnotations.openMocks(this);
////    }
////
////    @Test
////    public void testGetAllRoomTypes() {
////        // Mocking service response
////        List<RoomResponseDTO> roomTypes = new ArrayList<>();
////        // Add mocked RoomResponseDTO objects as needed
////        when(roomPageService.getAllRoomTypes(1,3)).thenReturn(roomTypes);
////
////        // Call the controller method
////        ResponseEntity<List<RoomResponseDTO>> response = roomPageController.getAllRoomTypes(1,3);
////
////        // Verify that the service method is called once
////        verify(roomPageService, times(1)).getAllRoomTypes(1,3);
////
////        // Verify the response status code
////        assertEquals(HttpStatus.OK, response.getStatusCode());
////        // Add more assertions as needed
////    }
////
////    @Test
////    public void testGetAllPromotions() {
////        // Mocking service response
////        List<PromotionResponseDTO> promotions = new ArrayList<>();
////        // Add mocked PromotionResponseDTO objects as needed
////        when(roomPageService.getAllPromotions(1,3)).thenReturn(promotions);
////
////        // Call the controller method
////        ResponseEntity<List<PromotionResponseDTO>> response = roomPageController.getAllPromotions(1,3);
////
////        // Verify that the service method is called once
////        verify(roomPageService, times(1)).getAllPromotions(1,3);
////
////        // Verify the response status code
////        assertEquals(HttpStatus.OK, response.getStatusCode());
////        // Add more assertions as needed
////    }
////}
//package com.team14.ibe.tests;
//
//import com.team14.ibe.controller.RoomPageController;
//import com.team14.ibe.dto.response.PromotionResponseDTO;
//import com.team14.ibe.dto.response.RoomAvailabilityDTO;
//import com.team14.ibe.dto.response.RoomRateDTO;
//import com.team14.ibe.dto.response.RoomResponseDTO;
//import com.team14.ibe.service.RoomPageService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.Mockito.*;
//
//public class RoomPageControllerTest {
//
//    @Mock
//    private RoomPageService roomPageService;
//
//    @InjectMocks
//    private RoomPageController roomPageController;
//
//    @BeforeEach
//    public void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    public void testGetAllRoomTypes() {
//        List<RoomResponseDTO> roomTypes = new ArrayList<>();
//        when(roomPageService.getAllRoomTypes(1, 3, false, false, false)).thenReturn(roomTypes);
//        ResponseEntity<List<RoomResponseDTO>> response = roomPageController.getAllRoomTypes(1, 3, false, false, false);
//        verify(roomPageService, times(1)).getAllRoomTypes(1, 3, false, false, false);
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//    }
//
//    @Test
//    public void testGetAllPromotions() {
//        List<PromotionResponseDTO> promotions = new ArrayList<>();
//        when(roomPageService.getAllPromotions(1, 3, true, true, false, false, false, false)).thenReturn(promotions);
//        ResponseEntity<List<PromotionResponseDTO>> response = roomPageController.getAllPromotions(1, 3, true, true, false, false, false, false);
//        verify(roomPageService, times(1)).getAllPromotions(1, 3, true, true, false, false, false, false);
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//    }
//
//    @Test
//    public void testGetRoomAvailability() {
//        List<RoomAvailabilityDTO> roomAvailability = new ArrayList<>();
//        when(roomPageService.getRoomAvailability()).thenReturn(roomAvailability);
//        ResponseEntity<List<RoomAvailabilityDTO>> response = roomPageController.getRoomAvailability();
//        verify(roomPageService, times(1)).getRoomAvailability();
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//    }
//
//    @Test
//    public void testGetRoomRates() {
//        List<RoomRateDTO> roomRates = new ArrayList<>();
//        when(roomPageService.getRoomRate()).thenReturn(roomRates);
//        ResponseEntity<List<RoomRateDTO>> response = roomPageController.getRoomRates();
//        verify(roomPageService, times(1)).getRoomRate();
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//    }
//
//    @Test
//    public void testGetRoomData() {
//        List<RoomRateDTO> roomRates = new ArrayList<>();
//        List<RoomAvailabilityDTO> roomAvailabilities = new ArrayList<>();
//        when(roomPageService.getRoomRate()).thenReturn(roomRates);
//        when(roomPageService.getRoomAvailability()).thenReturn(roomAvailabilities);
//        ResponseEntity<Map<String, Double>> response = roomPageController.getRoomData();
//        verify(roomPageService, times(1)).getRoomRate();
//        verify(roomPageService, times(1)).getRoomAvailability();
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//    }
//}
