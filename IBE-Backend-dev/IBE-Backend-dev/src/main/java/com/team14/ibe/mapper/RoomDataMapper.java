package com.team14.ibe.mapper;

import com.team14.ibe.dto.response.RoomAvailabilityDTO;
import com.team14.ibe.dto.response.RoomRateDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RoomDataMapper {

    public Map<String, Double> mapRoomData(List<RoomRateDTO> roomRates, List<RoomAvailabilityDTO> roomAvailabilities) {
        Map<String, Double> resultMap = new HashMap<>();
        Map<String, Map<String, Double>> combinedData = combineData(roomRates, roomAvailabilities);

        for (Map.Entry<String, Map<String, Double>> entry : combinedData.entrySet()) {
            String roomType = entry.getKey();
            Map<String, Double> ratesByDate = entry.getValue();


            double totalRate = 0.0;
            int availableDays = 0;

            for (Map.Entry<String, Double> rateEntry : ratesByDate.entrySet()) {
                Double rate = rateEntry.getValue();
                if (rate != null) {
                    totalRate += rate;
                    availableDays++;
                }
            }

            double averageRate = availableDays > 0 ? totalRate / availableDays : 0.0;
            resultMap.put(roomType, averageRate);
        }

        return resultMap;
    }

    private Map<String, Map<String, Double>> combineData(List<RoomRateDTO> roomRates, List<RoomAvailabilityDTO> roomAvailabilities) {
        Map<String, Map<String, Double>> combinedData = new HashMap<>();

        for (RoomRateDTO roomRate : roomRates) {
            String roomType = roomRate.getRoomTypeName();
            String date = roomRate.getDate();
            double rate = roomRate.getBasicNightlyRate();

            if (!combinedData.containsKey(roomType)) {
                combinedData.put(roomType, new HashMap<>());
            }
            combinedData.get(roomType).put(date, rate);
        }

        for (RoomAvailabilityDTO roomAvailability : roomAvailabilities) {
            String roomType = roomAvailability.getRoomTypeName();
            String date = roomAvailability.getDate();

            if (!combinedData.containsKey(roomType)) {
                combinedData.put(roomType, new HashMap<>());
            }
        }
        return combinedData;
    }

}

