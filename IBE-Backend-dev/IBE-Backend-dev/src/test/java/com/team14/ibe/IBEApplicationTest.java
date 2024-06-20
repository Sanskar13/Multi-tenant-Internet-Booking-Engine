//package com.team14.ibe;
//
//import com.team14.ibe.dto.response.RoomResponseDTOTest;
//import com.team14.ibe.service.GraphQLTestingServiceTest;
//import com.team14.ibe.service.LandingPageServiceTest;
//import com.team14.ibe.tests.*;
//import org.junit.jupiter.api.MethodOrderer;
//import org.junit.jupiter.api.Order;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.TestMethodOrder;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.io.IOException;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//@ComponentScan("com.team14.ibe")
//@ExtendWith(SpringExtension.class)
//@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
//public class IBEApplicationTest {
//
//	@Autowired
//	private MockMvc mockMvc;
//
//	@Test
//	@Order(1)
//	void testLandingPageController() {
//		LandingPageControllerTest landingPageControllerTest = new LandingPageControllerTest();
//		landingPageControllerTest.setUp();
//		landingPageControllerTest.testGetPropertyRates();
//	}
//
//	@Test
//	@Order(2)
//	void testTenantConfigController() throws Exception {
//		TenantConfigControllerTest tenantConfigControllerTest = new TenantConfigControllerTest();
//		tenantConfigControllerTest.setUp();
//		tenantConfigControllerTest.testGetTenantConfig();
//	}
//
//	@Test
//	@Order(3)
//	void testTenantConfigDTO() {
//		TenantConfigDTOTest tenantConfigDTOTest = new TenantConfigDTOTest();
//		tenantConfigDTOTest.testTenantConfigDTO();
//	}
//
//	@Test
//	@Order(4)
//	void testRoomPageController() {
//		RoomPageControllerTest roomPageControllerTest = new RoomPageControllerTest();
//		roomPageControllerTest.setUp();
//		roomPageControllerTest.testGetAllRoomTypes();
//		roomPageControllerTest.testGetAllPromotions();
//		roomPageControllerTest.testGetRoomAvailability();
////		roomPageControllerTest.testGetRoomRates();
//	}
//
//	@Test
//	@Order(5)
//	void testTenantService() throws IOException {
//		TenantServiceTest tenantServiceTest = new TenantServiceTest();
//		tenantServiceTest.testGetTenantConfigData();
//	}
//
//	@Test
//	@Order(6)
//	void testRoomModalPageService() {
//		RoomModalPageServiceTest roomModalPageServiceTest = new RoomModalPageServiceTest();
//		roomModalPageServiceTest.testGetPromoCodeValidation_Valid();
//		roomModalPageServiceTest.testGetPromoCodeValidation_Invalid();
//		roomModalPageServiceTest.testInsertPromoCode();
//	}
//
//	@Test
//	@Order(7)
//	void testRatingReviewService() {
//		RatingReviewServiceTest ratingReviewServiceTest = new RatingReviewServiceTest();
//		ratingReviewServiceTest.testGetRatingReviewResponse();
//	}
//
//	@Test
//	@Order(8)
//	void testLandingPageService() {
//		LandingPageServiceTest landingPageServiceTest = new LandingPageServiceTest();
//		landingPageServiceTest.setUp();
//		landingPageServiceTest.getMinimumPricesByDate_Success();
//	}
//
//	@Test
//	@Order(9)
//	void testGraphQLTestingService() {
//		GraphQLTestingServiceTest graphQLTestingServiceTest = new GraphQLTestingServiceTest();
//		graphQLTestingServiceTest.setUp();
//		graphQLTestingServiceTest.testGetRooms_Success();
//	}
//
//	@Test
//	@Order(10) // This will be executed after testGraphQLTestingService
//	void testRoomResponseDTO() {
//		RoomResponseDTOTest roomResponseDTOTest = new RoomResponseDTOTest();
//		roomResponseDTOTest.testRoomResponseDTO();
//	}
//
//}
