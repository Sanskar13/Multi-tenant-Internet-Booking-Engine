package com.team14.ibe.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.team14.ibe.dto.Request.CreateBookingRequestDTO;
import com.team14.ibe.dto.Request.RoomAvailabilityRequestDTO;
import com.team14.ibe.dto.response.CreateBookingResponse;
import com.team14.ibe.mapper.CreateBookingResponseDTOMapper;
import com.team14.ibe.models.AvailabilityEntity;
import com.team14.ibe.models.BookingConcurrency;
import com.team14.ibe.models.PurchaseEntity;
import com.team14.ibe.repository.AvailabilityRepository;
import com.team14.ibe.repository.PurchaseRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
public class RoomAvailabilityService {
    @Value("${graphql.endpoint}")
    private String graphqlEndpoint;

    @Value("${api.key}")
    private String apiKey;

    @Autowired
    private BookingConcurrencyService bookingConcurrencyService;
    @Autowired
    private BookingMutationService bookingMutationService;
    @Autowired
    private PurchaseRepository purchaseRepository;
    @Autowired
    private AvailabilityRepository availabilityRepository;

    public boolean processRoomAvailabilities(RoomAvailabilityRequestDTO requestDTO, PurchaseEntity purchaseEntity, long bookingCount) {
        Map<Long, List<Long>> roomAvailabilityMap = getRoomAvailabilities(requestDTO);
        log.info("All available rooms are: " + roomAvailabilityMap);
        List<BookingConcurrency> existingBookings = bookingConcurrencyService.getAllBookings();
        log.info("All Available Bookings: " + existingBookings);
        LocalDate checkInDate = LocalDate.parse(requestDTO.getCheckInDate().substring(0, 10));
        LocalDate checkOutDate = LocalDate.parse(requestDTO.getCheckOutDate().substring(0, 10));

        for (BookingConcurrency booking : existingBookings) {
            if (booking.isOverlap(checkInDate, checkOutDate)) {
                roomAvailabilityMap.remove(booking.getRoomId());
            }
        }
        int numberOfRooms = requestDTO.getNumberOfRooms();
        String bookingId = requestDTO.getBookingId();
        long confirmBooking = bookingCount;
        if (roomAvailabilityMap.size() < numberOfRooms) {
            log.info("Not enough room available");
            return false;
        } else {
            int roomsBooked = 0;
            log.info("Creating booking with id : {}", bookingId);
            purchaseRepository.save(purchaseEntity);
            PurchaseEntity purchaseEntityData = purchaseRepository.findByBookingId(bookingId);
            log.info("Current Booking id is: " + bookingId);
            log.info("purchase entity data is: " + purchaseEntityData);
            CreateBookingRequestDTO createBookingRequestDTO = new CreateBookingResponseDTOMapper().mapToBookingRequestDTO(purchaseEntity);
            log.info("create booking response dto: " + createBookingRequestDTO);
            CreateBookingResponse createBookingResponse = bookingMutationService.createBooking(createBookingRequestDTO);
            log.info("Booking successfully Created with response : {}", createBookingResponse);
            for (Map.Entry<Long, List<Long>> entry : roomAvailabilityMap.entrySet()) {
                if (roomsBooked >= numberOfRooms) {
                    break;
                }
                bookingConcurrencyService.addBooking(new BookingConcurrency(checkInDate, checkOutDate, entry.getKey()));
                for (Long availabilityId : entry.getValue()) {
                    AvailabilityEntity roomAvailability = new AvailabilityEntity(availabilityId,  bookingId);
                    availabilityRepository.save(roomAvailability);
                    Map<String, Object> updateResult = bookingMutationService.updateRoomAvailability(availabilityId, confirmBooking);
                }
                roomsBooked++;
            }
            return true;
        }
    }

    public Map<Long, List<Long>> getRoomAvailabilities(RoomAvailabilityRequestDTO requestDTO) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.set("x-api-key", apiKey);

        String graphqlQuery = "{\"query\": \"query MyQuery { listRoomAvailabilities(where: {property_id: {equals: " + requestDTO.getPropertyId() + "}, room: {room_type_id: {equals: " + requestDTO.getRoomTypeId() + "}}, date: {gte: \\\"" + requestDTO.getCheckInDate() + "\\\", lte: \\\"" + requestDTO.getCheckOutDate() + "\\\"}}) { availability_id booking_id date room_id }}\"}";

        HttpEntity<String> entity = new HttpEntity<>(graphqlQuery, httpHeaders);


        ResponseEntity<String> responseEntity = restTemplate.exchange(graphqlEndpoint, HttpMethod.POST, entity, String.class);

        String jsonResponse = responseEntity.getBody();

        Map<Long, List<Long>> roomAvailabilityMap = new HashMap<>();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode availabilitiesNode = root.path("data").path("listRoomAvailabilities");

            for (JsonNode node : availabilitiesNode) {
                Long roomId = node.path("room_id").asLong();
                Long availabilityId = node.path("availability_id").asLong();

                if (roomAvailabilityMap.containsKey(roomId)) {
                    roomAvailabilityMap.get(roomId).add(availabilityId);
                } else {
                    List<Long> availabilityIds = new ArrayList<>();
                    availabilityIds.add(availabilityId);
                    roomAvailabilityMap.put(roomId, availabilityIds);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return roomAvailabilityMap;
    }
}
