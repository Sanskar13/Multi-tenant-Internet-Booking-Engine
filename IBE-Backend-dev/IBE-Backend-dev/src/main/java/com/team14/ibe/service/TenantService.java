package com.team14.ibe.service;

import com.team14.ibe.models.TenantConfig;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

/**
 * Service class to handle tenant-related operations.
 */
@Service
public class TenantService {

    /**
     * Retrieves tenant configuration data.
     * @return Map containing tenant configuration data.
     * @throws IOException if an I/O error occurs while retrieving the configuration data.
     */
    public Map<String, Object> getTenantConfigData() throws IOException {
        TenantConfig tenantConfig = new TenantConfig();
        return tenantConfig.getConfigData();
    }
}
