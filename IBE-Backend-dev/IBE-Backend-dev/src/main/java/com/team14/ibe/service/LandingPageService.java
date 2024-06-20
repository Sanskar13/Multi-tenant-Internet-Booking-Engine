package com.team14.ibe.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class LandingPageService {
    @Value("${api.key}")
    private String apiKey;
    @Value("${graphql.endpoint}")
    private String graphqlEndpoint;
    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Double> getMinimumPricesByDate() {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.set("x-api-key", apiKey);

        String requestBody = "{ \"query\": \"query minimumnightlyrates { getProperty(where: {property_id: 14, room_type: {every: {room_rates: {every: {room_rate: {date: {}}}}}}}) { property_id room_type { room_rates { room_rate { basic_nightly_rate date } } } } }\" }";
        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, httpHeaders);

        ResponseEntity<String> responseEntity = restTemplate.exchange(graphqlEndpoint, HttpMethod.POST, requestEntity, String.class);
        String responseBody = responseEntity.getBody();

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Double> minimumPricesByDate = new TreeMap<>();
        try {
            JsonNode responseJson = objectMapper.readTree(responseBody);
            JsonNode roomTypes = responseJson.get("data").get("getProperty").get("room_type");
            for (JsonNode roomType : roomTypes) {
                JsonNode roomRates = roomType.get("room_rates");

                for (JsonNode roomRate : roomRates) {
                    String date = roomRate.get("room_rate").get("date").asText().split("T")[0];
                    double price = roomRate.get("room_rate").get("basic_nightly_rate").asDouble();

                    if (!minimumPricesByDate.containsKey(date)) {
                        minimumPricesByDate.put(date, price);
                    } else {
                        double currentMinimumPrice = minimumPricesByDate.get(date);
                        minimumPricesByDate.put(date, Math.min(currentMinimumPrice, price));
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return minimumPricesByDate;
    }
}
