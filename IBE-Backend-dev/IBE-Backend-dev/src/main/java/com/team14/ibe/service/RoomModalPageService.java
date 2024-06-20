package com.team14.ibe.service;

import com.team14.ibe.dto.PromoCodeDTO;
import com.team14.ibe.dto.response.PromoCodeResponseDTO;
import com.team14.ibe.models.PromoCode;
import com.team14.ibe.repository.PromoCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service class to handle operations related to room modal page.
 */
@Service
public class RoomModalPageService {

    private final PromoCodeRepository promoCodeRepository;

    /**
     * Constructor for RoomModalPageService.
     * @param promoCodeRepository The repository for accessing promo code data.
     */
    @Autowired
    public RoomModalPageService(PromoCodeRepository promoCodeRepository) {
        this.promoCodeRepository = promoCodeRepository;
    }

    /**
     * Validates a promo code.
     * @param promoCode The promo code to be validated.
     * @return PromoCodeResponseDTO containing validation result and discount information.
     */
    public PromoCodeResponseDTO getPromoCodeValidation(String promoCode) {
        PromoCode fetchPromoCode = promoCodeRepository.findByPromoCode(promoCode);
        if (fetchPromoCode != null) {
            PromoCodeResponseDTO promoCodeResponseDTO = new PromoCodeResponseDTO();
            promoCodeResponseDTO.setValid(true);
            promoCodeResponseDTO.setPromocode(fetchPromoCode.getPromoCode());
            promoCodeResponseDTO.setDiscount(fetchPromoCode.getDiscount());
            return promoCodeResponseDTO;
        }
        return new PromoCodeResponseDTO(false, "", 0);
    }

    /**
     * Inserts a promo code into the system.
     * @param promoCodeDTO The promo code DTO to be inserted.
     */
    public void insertPromoCode(PromoCodeDTO promoCodeDTO) {
        PromoCode promoCode = new PromoCode();
        promoCode.setPromoCode(promoCodeDTO.getPromoCode());
        promoCode.setDiscount(promoCodeDTO.getDiscount());
        promoCodeRepository.save(promoCode);
    }
}
