//package com.team14.ibe.tests;
//
//import com.team14.ibe.dto.response.PromotionResponseDTO;
//import com.team14.ibe.service.RoomPageService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.anyString;
//import static org.mockito.Mockito.*;
//
//public class RoomPageServiceTest {
//
//    @Mock
//    private RestTemplate restTemplate;
//
//    @InjectMocks
//    private RoomPageService roomPageService;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
////    @Test
////    void testGetAllPromotions() {
////        // Mocking restTemplate.exchange() response
////        ResponseEntity<String> responseEntity = ResponseEntity.ok("{\"data\": {\"listPromotions\": []}}");
////        // Provide a valid absolute URI
////        String uri = "http://localhost:8081/api/getAllPromotions"; // Replace with your actual URI
////        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class))).thenReturn(responseEntity);
//
////        // Call the service method
////        List<PromotionResponseDTO> promotions = roomPageService.getAllPromotions(1, 6, true, true, true, true, true, true);
//
////        // Verify restTemplate.exchange() is called once
////        verify(restTemplate, times(1)).exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class));
//
////        // Add assertions as needed
////        assertEquals(new ArrayList<PromotionResponseDTO>(), promotions);
////    }
//}
