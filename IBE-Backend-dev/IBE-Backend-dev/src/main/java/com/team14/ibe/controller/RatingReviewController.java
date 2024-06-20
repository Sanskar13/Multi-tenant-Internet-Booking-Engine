package com.team14.ibe.controller;

import com.team14.ibe.dto.Request.RatingReviewRequest;
import com.team14.ibe.dto.response.RatingReviewResponseDTO;
import com.team14.ibe.service.RatingReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller class to handle requests related to property rating and reviews.
 */
@RestController
public class RatingReviewController {

    private final RatingReviewService ratingReviewService;

    /**
     * Constructor for RatingReviewController.
     *
     * @param ratingReviewService The service responsible for handling rating and review operations.
     */
    @Autowired
    public RatingReviewController(RatingReviewService ratingReviewService) {
        this.ratingReviewService = ratingReviewService;
    }

    /**
     * Endpoint to receive and save property rating and review.
     *
     * @param propertyRatingReviewRequest The request containing property rating and review data.
     * @return ResponseEntity indicating success or failure of the operation.
     */
    @PostMapping("/property-rating-review")
    public ResponseEntity<String> receivePropertyRatingReview(@RequestBody @Valid RatingReviewRequest propertyRatingReviewRequest) {
        ratingReviewService.saveRatingReview(propertyRatingReviewRequest);
        return new ResponseEntity<>("Property Rating Review received successfully", HttpStatus.OK);
    }

    /**
     * Endpoint to retrieve rating and review for a property.
     *
     * @param roomId The ID of the room for which rating and review are requested.
     * @return ResponseEntity containing rating and review data.
     */
    @GetMapping("/getratingreview")
    public ResponseEntity<RatingReviewResponseDTO> receivePropertyRatingReview(@RequestParam @Valid Long roomId) {
        RatingReviewResponseDTO ratingReviewResponseDTO = ratingReviewService.getRatingReviewResponse(roomId);
        return new ResponseEntity<>(ratingReviewResponseDTO, HttpStatus.OK);
    }
}
