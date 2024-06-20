package com.team14.ibe.repository;

import com.team14.ibe.models.AvailabilityEntity;
import com.team14.ibe.models.PurchaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<AvailabilityEntity, Long> {
    List<AvailabilityEntity> findByBookingId(String bookingId);

}
