//package com.team14.ibe.tests;
//
//import com.team14.ibe.dto.Request.RatingReviewRequest;
//import com.team14.ibe.dto.response.RatingReviewResponseDTO;
//import com.team14.ibe.models.RatingReview;
//import com.team14.ibe.repository.RatingReviewRepository;
//import com.team14.ibe.service.RatingReviewService;
//import org.junit.jupiter.api.Test;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.Mockito.mock;
//import static org.mockito.Mockito.when;
//
//public class RatingReviewServiceTest {
//
//    @Test
//    public void testGetRatingReviewResponse() {
//        RatingReviewRepository ratingReviewRepository = mock(RatingReviewRepository.class);
//        RatingReviewService ratingReviewService = new RatingReviewService(ratingReviewRepository);
//
//        RatingReview ratingReview = new RatingReview();
//        ratingReview.setRoomTypeId(1L);
//        ratingReview.setPropertyId(1L);
//        ratingReview.setRating(4.5);
//        ratingReview.setReviewCount(3);
//
//        when(ratingReviewRepository.findByRoomTypeId(1L)).thenReturn(ratingReview);
//
//        RatingReviewResponseDTO expectedResponse = new RatingReviewResponseDTO(ratingReview.getPropertyId(), ratingReview.getRoomTypeId(), ratingReview.getRating(), ratingReview.getReviewCount());
//
//        assertEquals(expectedResponse, ratingReviewService.getRatingReviewResponse(1L));
//    }
//}
