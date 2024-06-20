package com.team14.ibe.service;

import com.team14.ibe.dto.Request.RatingReviewRequest;
import com.team14.ibe.dto.response.RatingReviewResponseDTO;
import com.team14.ibe.models.RatingReview;
import com.team14.ibe.repository.RatingReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service class to handle rating and review operations.
 */
@Service
public class RatingReviewService {

    private final RatingReviewRepository ratingReviewRepository;

    /**
     * Constructor for RatingReviewService.
     *
     * @param ratingReviewRepository The repository for accessing rating and review data.
     */
    @Autowired
    public RatingReviewService(RatingReviewRepository ratingReviewRepository) {
        this.ratingReviewRepository = ratingReviewRepository;
    }

    /**
     * Saves a rating and review for a room.
     *
     * @param ratingReviewRequest The request containing rating and review data.
     */

    public void saveRatingReview(RatingReviewRequest ratingReviewRequest) {
        Long roomTypeId = ratingReviewRequest.getRoomTypeId();
        double rating = ratingReviewRequest.getRating();
        Long propertyId = ratingReviewRequest.getPropertyId();

        RatingReview roomRating = ratingReviewRepository.findByRoomTypeIdAndPropertyId(roomTypeId, propertyId);

        if (roomRating == null) {
            roomRating = new RatingReview();
            roomRating.setRoomTypeId(roomTypeId);
            roomRating.setPropertyId(propertyId);
            roomRating.setRating(rating);
            roomRating.setReviewCount(1);
        } else {
            int reviewCount = roomRating.getReviewCount() + 1;
            double averageRating = (roomRating.getRating() * (roomRating.getReviewCount()) + rating) / reviewCount;

            averageRating = Math.round(averageRating * 100.0) / 100.0;
            if (averageRating < 1) {
                averageRating = 1;
            }

            roomRating.setRating(averageRating);
            roomRating.setReviewCount(reviewCount);
        }

        // Save or update the rating review record
        ratingReviewRepository.save(roomRating);
    }


    /**
     * Retrieves rating and review information for a room.
     *
     * @param roomTypeId The ID of the room.
     * @return RatingReviewResponseDTO containing the rating and review data.
     */
    public RatingReviewResponseDTO getRatingReviewResponse(Long roomTypeId) {
        RatingReview ratingReview = ratingReviewRepository.findByRoomTypeId(roomTypeId);
        return new RatingReviewResponseDTO(ratingReview.getPropertyId(), ratingReview.getRoomTypeId(), ratingReview.getRating(), ratingReview.getReviewCount());
    }
}
