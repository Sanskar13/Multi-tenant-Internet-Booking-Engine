package com.team14.ibe.controller;

import com.team14.ibe.service.LandingPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controller class to handle requests related to the landing page.
 */
@RestController
@RequestMapping("/api")
public class LandingPageController {

    @Autowired
    private LandingPageService landingPageService;

    /**
     * Endpoint to fetch property rates.
     * @return A map containing property rates.
     */
    @GetMapping(value = "/property-rates", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Double> getPropertyRates() {
        return landingPageService.getMinimumPricesByDate();
    }
}
