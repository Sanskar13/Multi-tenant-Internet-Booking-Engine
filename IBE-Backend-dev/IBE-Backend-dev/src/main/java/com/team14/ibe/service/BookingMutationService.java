package com.team14.ibe.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.team14.ibe.dto.Request.CreateBookingRequestDTO;
import com.team14.ibe.dto.response.CreateBookingResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class BookingMutationService {

    @Value("${graphql.endpoint}")
    private String graphqlEndpoint;

    @Value("${api.key}")
    private String apiKey;

    @Autowired
    private ObjectMapper objectMapper;

    public CreateBookingResponse createBooking(CreateBookingRequestDTO requestDTO) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.set("x-api-key", apiKey);

        String checkInDate = requestDTO.getCheckInDate() != null ? requestDTO.getCheckInDate() : "2024-06-15T00:00:00.000Z";
        String checkOutDate = requestDTO.getCheckOutDate() != null ? requestDTO.getCheckOutDate() : "2024-06-15T00:00:00.000Z";
        int adultCount = requestDTO.getAdultCount() > -1 ? requestDTO.getAdultCount() : 1;
        int childCount = requestDTO.getChildCount() > -1 ? requestDTO.getChildCount() : 1;
        double totalCost = requestDTO.getTotalCost() > -1 ? requestDTO.getTotalCost() : 1;
        double amountDueAtResort = requestDTO.getAmountDueAtResort() >= 0 ? requestDTO.getAmountDueAtResort() : 20;
        String guestName = requestDTO.getGuestName() != null ? requestDTO.getGuestName() : "Sanskar";
        long statusId = requestDTO.getStatusId() >= 0 ? requestDTO.getStatusId() : 2;
        long propertyId = requestDTO.getPropertyId() >= 0 ? requestDTO.getPropertyId() : 14;
        long promotionId = requestDTO.getPromotionId() >= 0 ? requestDTO.getPromotionId() : 1;

        String graphqlQuery = "{ \"query\": \"mutation MyMutation { createBooking(data: { check_in_date: \\\"" + checkInDate + "\\\", check_out_date: \\\"" + checkOutDate + "\\\", adult_count: " + adultCount + ", child_count: " + childCount + ", total_cost: " + totalCost + ", amount_due_at_resort: " + amountDueAtResort + ", guest: { create: { guest_name: \\\"" + guestName + "\\\" } }, booking_status: { connect: { status_id: " + statusId + " } }, property_booked: { connect: { property_id: " + propertyId + " } }, promotion_applied: { connect: { promotion_id: " + promotionId + " } } }) { booking_id } }\"}";


        HttpEntity<String> entity = new HttpEntity<>(graphqlQuery, httpHeaders);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> responseEntity = restTemplate.exchange(graphqlEndpoint, HttpMethod.POST, entity, String.class);

        try {
            CreateBookingResponse response = objectMapper.readValue(responseEntity.getBody(), CreateBookingResponse.class);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }


    }


    public Map<String, Object> updateRoomAvailability(Long availabilityId, Long bookingId) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.set("x-api-key", apiKey);

        String graphqlQuery = "{ \"query\": \"mutation MyMutation { updateRoomAvailability(where: {availability_id: " + availabilityId + "}, data: {booking: {connect: {booking_id: " + bookingId + "}}}) { availability_id booking_id date } }\"}";

        HttpEntity<String> entity = new HttpEntity<>(graphqlQuery, httpHeaders);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> responseEntity = restTemplate.exchange(graphqlEndpoint, HttpMethod.POST, entity, String.class);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode responseJson = objectMapper.readTree(responseEntity.getBody());
            JsonNode dataNode = responseJson.get("data").get("updateRoomAvailability");

            if (dataNode != null) {

                Long updatedAvailabilityId = dataNode.get("availability_id").asLong();
                Long updatedBookingId = dataNode.get("booking_id").asLong();
                String updatedDate = dataNode.get("date").asText();

                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("availability_id", updatedAvailabilityId);
                responseMap.put("booking_id", updatedBookingId);
                responseMap.put("date", updatedDate);

                return responseMap;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;

    }
}
