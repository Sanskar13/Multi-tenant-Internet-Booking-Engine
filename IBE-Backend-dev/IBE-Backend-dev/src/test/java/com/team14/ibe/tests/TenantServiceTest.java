//package com.team14.ibe.tests;
//
//import com.team14.ibe.service.TenantService;
//import org.junit.jupiter.api.Test;
//
//import java.io.IOException;
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//
//public class TenantServiceTest {
//
//    private TenantService tenantService = new TenantService();
//
//    @Test
//    public void testGetTenantConfigData() throws IOException {
//        Map<String, Object> tenantConfigData = tenantService.getTenantConfigData();
//        String actual = (String) tenantConfigData.get("pageTitleText");
//        String expected = "Welcome to Our Hotel";
//        assertEquals(expected, actual);
//    }
//}
