//package com.team14.ibe.tests;
//
//import com.team14.ibe.controller.RoomModalPageController;
//import com.team14.ibe.dto.PromoCodeDTO;
//import com.team14.ibe.dto.response.PromoCodeResponseDTO;
//import com.team14.ibe.service.RoomModalPageService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//
//import java.util.Collections;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.Mockito.*;
//
//public class RoomModalPageControllerTest {
//
//    @Mock
//    private RoomModalPageService roomModalPageService;
//
//    @InjectMocks
//    private RoomModalPageController roomModalPageController;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    void testValidatePromoCode() {
//        // Mocking service response
//        PromoCodeResponseDTO responseDTO = new PromoCodeResponseDTO();
//        when(roomModalPageService.getPromoCodeValidation("SAMPLECODE")).thenReturn(responseDTO);
//
//        // Call the controller method
//        ResponseEntity<PromoCodeResponseDTO> responseEntity = roomModalPageController.validatePromoCode("SAMPLECODE");
//
//        // Verify service method is called
//        verify(roomModalPageService, times(1)).getPromoCodeValidation("SAMPLECODE");
//
//        // Assert response status code and body
//        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
//        assertEquals(responseDTO, responseEntity.getBody());
//    }
//
//    @Test
//    void testAddPromoCodes() {
//        // Prepare input data
//        PromoCodeDTO promoCodeDTO = new PromoCodeDTO("SAMPLECODE", 10.0);
//
//        // Call the controller method
//        ResponseEntity<Void> responseEntity = roomModalPageController.addPromoCodes(Collections.singletonList(promoCodeDTO));
//
//        // Verify service method is called
//        verify(roomModalPageService, times(1)).insertPromoCode(promoCodeDTO);
//
//        // Assert response status code
//        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
//    }
//}
