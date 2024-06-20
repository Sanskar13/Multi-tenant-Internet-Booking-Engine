package com.team14.ibe.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GraphQLTestingService {

    private static final String ROOMS_DATA = "{ listRooms {room_id room_number } }";
    @Value("${api.key}")
    private String apiKey;
    @Value("${graphql.endpoint}")
    private String graphqlEndpoint;

    private final RestTemplate restTemplate = new RestTemplate();

    public ResponseEntity<String> getRooms() {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.set("x-api-key", apiKey);
        String requestBody = "{ \"query\": \"" + ROOMS_DATA + "\" }";
        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, httpHeaders);
        return restTemplate.exchange(graphqlEndpoint, HttpMethod.POST, requestEntity, String.class);
    }
}
