package com.team14.ibe.controller;

import com.team14.ibe.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

/**
 * Controller class to handle requests related to tenant configuration.
 */
@RestController
@RequestMapping("/api")
public class TenantConfigController {

    private final TenantService tenantConfigService;

    /**
     * Constructor for TenantConfigController.
     * @param tenantConfigService The service responsible for handling tenant configuration operations.
     */
    @Autowired
    public TenantConfigController(TenantService tenantConfigService) {
        this.tenantConfigService = tenantConfigService;
    }

    /**
     * Endpoint to retrieve tenant configuration data.
     * @return ResponseEntity containing the tenant configuration data.
     * @throws IOException if an I/O error occurs.
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getTenantConfig() throws IOException {
        Map<String, Object> configData = tenantConfigService.getTenantConfigData();
        return new ResponseEntity<>(configData, HttpStatus.OK);
    }
}
