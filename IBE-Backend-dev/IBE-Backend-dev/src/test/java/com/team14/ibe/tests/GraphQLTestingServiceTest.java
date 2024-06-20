//package com.team14.ibe.service;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.*;
//import org.springframework.test.util.ReflectionTestUtils;
//import org.springframework.web.client.RestTemplate;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.Mockito.when;
//
//public class GraphQLTestingServiceTest {
//
//    @Mock
//    private RestTemplate restTemplate;
//
//    private GraphQLTestingService graphQLTestingService;
//
//    @BeforeEach
//    public void setUp() {
//        MockitoAnnotations.initMocks(this);
//        graphQLTestingService = new GraphQLTestingService();
//        ReflectionTestUtils.setField(graphQLTestingService, "restTemplate", restTemplate);
//        ReflectionTestUtils.setField(graphQLTestingService, "apiKey", "da2-j3m6jevvlrfrpn4n2c7dkvpuau");
//        ReflectionTestUtils.setField(graphQLTestingService, "graphqlEndpoint", "https://tqtt2hy6sbeuhh5j4eazrqetum.appsync-api.ap-south-1.amazonaws.com/graphql");
//    }
//
//    @Test
//    public void testGetRooms_Success() {
//        // Arrange
//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
//        httpHeaders.set("x-api-key", "da2-j3m6jevvlrfrpn4n2c7dkvpuau");
//
//        String expectedRequestBody = "{\"query\": \"{ listRooms {room_id room_number } }\"}";
//
//        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>("Mock response body", HttpStatus.OK);
//        when(restTemplate.exchange(eq("https://tqtt2hy6sbeuhh5j4eazrqetum.appsync-api.ap-south-1.amazonaws.com/graphql"), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
//                .thenReturn(mockResponseEntity);
//
//        // Act
//        ResponseEntity<String> responseEntity = graphQLTestingService.getRooms();
//
//        // Assert
//        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
//        assertEquals("Mock response body", responseEntity.getBody());
//    }
//}
