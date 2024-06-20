package com.team14.ibe.repository;

import com.team14.ibe.models.RatingReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingReviewRepository extends JpaRepository<RatingReview, Long> {
    RatingReview findByRoomTypeId(Long roomTypeId);
    RatingReview findByRoomTypeIdAndPropertyId(Long roomTypeId, Long propertyId);

}
