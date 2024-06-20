//package com.team14.ibe.tests;
//
//import com.team14.ibe.controller.TenantConfigController;
//import com.team14.ibe.service.TenantService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//
//import java.io.IOException;
//import java.util.HashMap;
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.Mockito.when;
//
//public class TenantConfigControllerTest {
//
//    @Mock
//    private TenantService tenantService;
//
//    @InjectMocks
//    private TenantConfigController tenantConfigController;
//
//    @BeforeEach
//    public void setUp() {
//        MockitoAnnotations.openMocks(this);
//    }
//
//    @Test
//    public void testGetTenantConfig() throws IOException {
//        // Mock data
//        Map<String, Object> mockConfigData = new HashMap<>();
//        mockConfigData.put("guestTypes", new String[]{"Adults", "Teens", "Kids"});
//        mockConfigData.put("pageTitleText", "Welcome to Our Hotel");
//        // Add more mock data as needed
//
//        // Mock the service method
//        when(tenantService.getTenantConfigData()).thenReturn(mockConfigData);
//
//        // Call the controller method
//        ResponseEntity<Map<String, Object>> actualResponseEntity = tenantConfigController.getTenantConfig();
//
//        // Verify the response
//        assertEquals(HttpStatus.OK, actualResponseEntity.getStatusCode());
//        assertEquals(mockConfigData, actualResponseEntity.getBody());
//    }
//}
