package com.team14.ibe.controller;

import com.team14.ibe.dto.response.PromotionResponseDTO;
import com.team14.ibe.dto.response.RoomAvailabilityDTO;
import com.team14.ibe.dto.response.RoomRateDTO;
import com.team14.ibe.dto.response.RoomResponseDTO;
import com.team14.ibe.mapper.RoomDataMapper;
import com.team14.ibe.service.RoomPageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller class to handle requests related to room pages.
 */
@RestController
@RequestMapping("/api")
public class RoomPageController {

    private final RoomPageService roomPageService;

    /**
     * Constructor for RoomPageController.
     * @param roomPageService The service responsible for handling room page operations.
     */
    public RoomPageController(RoomPageService roomPageService) {
        this.roomPageService = roomPageService;
    }

    /**
     * Endpoint to retrieve all room types.
     * @param page Page number for pagination.
     * @param size Number of items per page.
     * @param singleBed Boolean indicating if single bed rooms are requested.
     * @param superDeluxe Boolean indicating if super deluxe rooms are requested.
     * @param familyDeluxe Boolean indicating if family deluxe rooms are requested.
     * @return ResponseEntity containing a list of RoomResponseDTO objects.
     */
    @GetMapping("/room-types")
    public ResponseEntity<List<RoomResponseDTO>> getAllRoomTypes(@RequestParam(defaultValue = "1") int page,
                                                                 @RequestParam(defaultValue = "3") int size,
                                                                 @RequestParam(defaultValue = "false") boolean singleBed,
                                                                 @RequestParam(defaultValue = "false") boolean superDeluxe,
                                                                 @RequestParam(defaultValue = "false") boolean familyDeluxe) {
        List<RoomResponseDTO> roomTypes = roomPageService.getAllRoomTypes(page, size, singleBed, superDeluxe, familyDeluxe);
        return new ResponseEntity<>(roomTypes, HttpStatus.OK);
    }

    /**
     * Endpoint to retrieve all promotions.
     * @param page Page number for pagination.
     * @param size Number of items per page.
     * @param seniorCitizen Boolean indicating if promotions for senior citizens are requested.
     * @param kduMembership Boolean indicating if promotions for KDU membership are requested.
     * @param longWeekendDiscount Boolean indicating if long weekend discounts are requested.
     * @param militaryPersonnelDiscount Boolean indicating if discounts for military personnel are requested.
     * @param upfrontPaymentDiscount Boolean indicating if upfront payment discounts are requested.
     * @param weekendDiscount Boolean indicating if weekend discounts are requested.
     * @return ResponseEntity containing a list of PromotionResponseDTO objects.
     */
    @GetMapping("/promotions")
    public ResponseEntity<List<PromotionResponseDTO>> getAllPromotions(@RequestParam(defaultValue = "1") int page,
                                                                       @RequestParam(defaultValue = "6") int size,
                                                                       @RequestParam(defaultValue = "true") boolean seniorCitizen,
                                                                       @RequestParam(defaultValue = "true") boolean kduMembership,
                                                                       @RequestParam(defaultValue = "true") boolean longWeekendDiscount,
                                                                       @RequestParam(defaultValue = "true") boolean militaryPersonnelDiscount,
                                                                       @RequestParam(defaultValue = "true") boolean upfrontPaymentDiscount,
                                                                       @RequestParam(defaultValue = "true") boolean weekendDiscount) {
        List<PromotionResponseDTO> promotions = roomPageService.getAllPromotions(page, size, seniorCitizen, kduMembership, longWeekendDiscount, militaryPersonnelDiscount, upfrontPaymentDiscount, weekendDiscount);
        return new ResponseEntity<>(promotions, HttpStatus.OK);
    }

    /**
     * Endpoint to retrieve room availability.
     * @return ResponseEntity containing a list of RoomAvailabilityDTO objects.
     */
    @GetMapping("/room-availability")
    public ResponseEntity<List<RoomAvailabilityDTO>> getRoomAvailability() {
        List<RoomAvailabilityDTO> roomAvailability = roomPageService.getRoomAvailability();
        return new ResponseEntity<>(roomAvailability, HttpStatus.OK);
    }

    /**
     * Endpoint to retrieve room rates.
     * @return ResponseEntity containing a list of RoomRateDTO objects.
     */
    @GetMapping("/room-rates")
    public ResponseEntity<List<RoomRateDTO>> getRoomRates() {
        List<RoomRateDTO> roomRates = roomPageService.getRoomRate();
        return new ResponseEntity<>(roomRates, HttpStatus.OK);
    }

    /**
     * Endpoint to retrieve room data.
     * @return ResponseEntity containing a map of room data.
     */
    @GetMapping("/room-data")
    public ResponseEntity<Map<String, Double>> getRoomData() {
        List<RoomRateDTO> roomRates = roomPageService.getRoomRate();
        List<RoomAvailabilityDTO> roomAvailabilities = roomPageService.getRoomAvailability();
        RoomDataMapper roomDataMapper = new RoomDataMapper();
        Map<String, Double> resultMap = roomDataMapper.mapRoomData(roomRates, roomAvailabilities);
        return new ResponseEntity<>(resultMap, HttpStatus.OK);
    }
}
