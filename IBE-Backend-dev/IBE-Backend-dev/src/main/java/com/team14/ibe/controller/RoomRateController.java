package com.team14.ibe.controller;

import com.team14.ibe.service.RoomRateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class RoomRateController {
    @Autowired
    private RoomRateService roomRateService;

    @GetMapping("/room-rates")
    public ResponseEntity<Map<String, Double>> getRoomRates(
            @RequestParam int roomTypeId,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        try {
            Map<String, Double> roomRates = roomRateService.getRoomRatesMap(roomTypeId, startDate, endDate);
            return ResponseEntity.ok(roomRates);
        } catch (Exception e) {
            Map<String, Double> errorResponse = new java.util.HashMap<>();
            errorResponse.put("error", -1.0);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
