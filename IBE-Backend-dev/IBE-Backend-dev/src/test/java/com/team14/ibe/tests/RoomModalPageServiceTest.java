//package com.team14.ibe.tests;
//
//import com.team14.ibe.dto.PromoCodeDTO;
//import com.team14.ibe.dto.response.PromoCodeResponseDTO;
//import com.team14.ibe.models.PromoCode;
//import com.team14.ibe.repository.PromoCodeRepository;
//import com.team14.ibe.service.RoomModalPageService;
//import org.junit.jupiter.api.Test;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.Mockito.*;
//
//public class RoomModalPageServiceTest {
//
//    @Test
//    public void testGetPromoCodeValidation_Valid() {
//        PromoCodeRepository promoCodeRepository = mock(PromoCodeRepository.class);
//        PromoCode promoCode = new PromoCode();
//        promoCode.setPromoCode("TEST123");
//        promoCode.setDiscount(10);
//
//        when(promoCodeRepository.findByPromoCode("TEST123")).thenReturn(promoCode);
//        RoomModalPageService roomModalPageService = new RoomModalPageService(promoCodeRepository);
//
//        PromoCodeResponseDTO result = roomModalPageService.getPromoCodeValidation("TEST123");
//
//        assertEquals(true, result.isValid());
//        assertEquals("TEST123", result.getPromocode());
//        assertEquals(10, result.getDiscount());
//    }
//
//    @Test
//    public void testGetPromoCodeValidation_Invalid() {
//        PromoCodeRepository promoCodeRepository = mock(PromoCodeRepository.class);
//
//        when(promoCodeRepository.findByPromoCode("INVALID")).thenReturn(null);
//
//        RoomModalPageService roomModalPageService = new RoomModalPageService(promoCodeRepository);
//
//        PromoCodeResponseDTO result = roomModalPageService.getPromoCodeValidation("INVALID");
//
//        assertEquals(false, result.isValid());
//        assertEquals("", result.getPromocode());
//        assertEquals(0, result.getDiscount());
//    }
//
//    @Test
//    public void testInsertPromoCode() {
//        PromoCodeRepository promoCodeRepository = mock(PromoCodeRepository.class);
//
//        PromoCodeDTO promoCodeDTO = new PromoCodeDTO();
//        promoCodeDTO.setPromoCode("TEST123");
//        promoCodeDTO.setDiscount(10.0);
//
//        RoomModalPageService roomModalPageService = new RoomModalPageService(promoCodeRepository);
//
//        roomModalPageService.insertPromoCode(promoCodeDTO);
//
//        PromoCode promoCode = new PromoCode();
//        promoCode.setPromoCode("TEST123");
//        promoCode.setDiscount(10);
//        verify(promoCodeRepository).save(promoCode);
//    }
//}
