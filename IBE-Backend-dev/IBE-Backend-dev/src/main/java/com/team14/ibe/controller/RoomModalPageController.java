package com.team14.ibe.controller;

import com.team14.ibe.dto.PromoCodeDTO;
import com.team14.ibe.dto.response.PromoCodeResponseDTO;
import com.team14.ibe.service.RoomModalPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller class to handle requests related to room modal page operations.
 */
@RestController
public class RoomModalPageController {

    private final RoomModalPageService roomModalPageService;

    /**
     * Constructor for RoomModalPageController.
     * @param roomModalPageService The service responsible for handling room modal page operations.
     */
    @Autowired
    public RoomModalPageController(RoomModalPageService roomModalPageService) {
        this.roomModalPageService = roomModalPageService;
    }

    /**
     * Endpoint to validate a promo code.
     * @param promoCode The promo code to be validated.
     * @return ResponseEntity containing the promo code validation response.
     */
    @PostMapping("/validatepromocode")
    public ResponseEntity<PromoCodeResponseDTO> validatePromoCode(@RequestParam String promoCode) {
        PromoCodeResponseDTO promoCodeResponseDTO = roomModalPageService.getPromoCodeValidation(promoCode);
        return new ResponseEntity<>(promoCodeResponseDTO, HttpStatus.OK);
    }

    /**
     * Endpoint to insert promo codes into the system.
     * @param promoCodeDTOs List of promo code DTOs to be inserted.
     * @return ResponseEntity indicating the success of the promo code insertion.
     */
    @PostMapping("/promo-code-insertion")
    public ResponseEntity<Void> addPromoCodes(@RequestBody List<PromoCodeDTO> promoCodeDTOs) {
        for (PromoCodeDTO promoCodeDTO : promoCodeDTOs) {
            roomModalPageService.insertPromoCode(promoCodeDTO);
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
