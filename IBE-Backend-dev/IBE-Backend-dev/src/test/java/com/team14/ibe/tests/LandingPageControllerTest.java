//package com.team14.ibe.tests;
//
//import com.team14.ibe.controller.LandingPageController;
//import com.team14.ibe.service.LandingPageService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import java.util.HashMap;
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.Mockito.when;
//
//public class LandingPageControllerTest {
//
//    @Mock
//    private LandingPageService landingPageService;
//
//    @InjectMocks
//    private LandingPageController landingPageController;
//
//    @BeforeEach
//    public void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    public void testGetPropertyRates() {
//        // Mock data
//        Map<String, Double> mockRates = new HashMap<>();
//        mockRates.put("2024-03-01", 110.0);
//        mockRates.put("2024-03-02", 110.0);
//        // Add more mock data as needed
//
//        // Mock the service method
//        when(landingPageService.getMinimumPricesByDate()).thenReturn(mockRates);
//
//        // Call the controller method
//        Map<String, Double> actualResponse = landingPageController.getPropertyRates();
//
//        // Verify the response
//        assertEquals(mockRates, actualResponse);
//    }
//}
