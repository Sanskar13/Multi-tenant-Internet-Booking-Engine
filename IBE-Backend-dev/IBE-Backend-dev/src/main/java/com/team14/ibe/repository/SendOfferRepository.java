package com.team14.ibe.repository;

import com.team14.ibe.models.SendOfferEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SendOfferRepository extends JpaRepository<SendOfferEntity, String> {
}
