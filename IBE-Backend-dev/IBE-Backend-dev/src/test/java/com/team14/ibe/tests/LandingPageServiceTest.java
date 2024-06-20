//package com.team14.ibe.service;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
//import org.springframework.test.util.ReflectionTestUtils;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.Map;
//import java.util.TreeMap;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.Mockito.*;
//
//public class LandingPageServiceTest {
//
//    @Mock
//    private RestTemplate restTemplate;
//
//    private LandingPageService landingPageService;
//
//    @Value("${api.key}")
//    private String apiKey;
//
//    @Value("${graphql.endpoint}")
//    private String graphqlEndpoint;
//
//    @BeforeEach
//    public void setUp() {
//        MockitoAnnotations.initMocks(this);
//        landingPageService = new LandingPageService();
//        ReflectionTestUtils.setField(landingPageService, "restTemplate", restTemplate);
//        ReflectionTestUtils.setField(landingPageService, "apiKey", apiKey);
//        ReflectionTestUtils.setField(landingPageService, "graphqlEndpoint", graphqlEndpoint);
//    }
//
//    @Test
//    public void getMinimumPricesByDate_Success() {
//        // Arrange
//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
//        httpHeaders.set("x-api-key", apiKey);
//
//        // Mocking response entity
//        String responseBody = "{\"data\":{\"getProperty\":{\"room_type\":[{\"room_rates\":[{\"room_rate\":{\"basic_nightly_rate\":100.0,\"date\":\"2024-03-31T00:00:00Z\"}}]}]}}}";
//        ResponseEntity<String> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
//        when(restTemplate.exchange(eq(graphqlEndpoint), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
//                .thenReturn(responseEntity);
//
//        // Act
//        Map<String, Double> minimumPricesByDate = landingPageService.getMinimumPricesByDate();
//
//        // Assert
//        Map<String, Double> expectedMinimumPricesByDate = new TreeMap<>();
//        expectedMinimumPricesByDate.put("2024-03-31", 100.0);
//        assertEquals(expectedMinimumPricesByDate, minimumPricesByDate);
//    }
//}
