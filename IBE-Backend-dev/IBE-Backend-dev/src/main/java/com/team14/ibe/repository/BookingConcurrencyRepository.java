package com.team14.ibe.repository;

import com.team14.ibe.models.BookingConcurrency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingConcurrencyRepository extends JpaRepository<BookingConcurrency, Long> {
}
