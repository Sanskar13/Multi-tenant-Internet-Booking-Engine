//package com.team14.ibe.tests;
//
//import com.team14.ibe.controller.RatingReviewController;
//import com.team14.ibe.dto.Request.RatingReviewRequest;
//import com.team14.ibe.dto.response.RatingReviewResponseDTO;
//import com.team14.ibe.models.RatingReview;
//import com.team14.ibe.repository.RatingReviewRepository;
//import com.team14.ibe.service.RatingReviewService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.when;
//
//public class RatingReviewControllerTest {
//
//    @Mock
//    private RatingReviewRepository ratingReviewRepository;
//
//    @InjectMocks
//    private RatingReviewService ratingReviewService;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.initMocks(this); // Initialize Mockito
//    }
//
//    @Test
//    public void testSaveRatingReview() {
//        // Prepare test data
//        RatingReviewRequest request = new RatingReviewRequest();
//        request.setRoomTypeId(1L);
//        request.setPropertyId(1L);
//        request.setRating((int) 4.5);
//
//        RatingReview existingRatingReview = new RatingReview();
//        existingRatingReview.setRoomTypeId(1L);
//        existingRatingReview.setPropertyId(1L);
//        existingRatingReview.setRating(4.0);
//        existingRatingReview.setReviewCount(5);
//
//        // Mock ratingReviewRepository behavior
//        when(ratingReviewRepository.findByRoomTypeIdAndPropertyId(1L, 1L)).thenReturn(existingRatingReview);
//        when(ratingReviewRepository.save(any(RatingReview.class))).thenReturn(null);
//
//        // Call the method to be tested
//        ratingReviewService.saveRatingReview(request);
//
//        // Verify the behavior
//        // Your verification code here
//    }
//
//    @Test
//    public void testReceivePropertyRatingReview() {
//        RatingReviewResponseDTO expectedResponseDTO = new RatingReviewResponseDTO(1L, 1L, 4.25, 6);
//
//        // Mock ratingReviewRepository behavior
//        when(ratingReviewRepository.findByRoomTypeId(1L)).thenReturn(new RatingReview());
//
//        // Call the method to be tested
//        RatingReviewResponseDTO responseEntity = ratingReviewService.getRatingReviewResponse(1L);
//
//        // Your verification code here
//    }
//
//}
