package com.team14.ibe.service;

import com.team14.ibe.dto.Request.PurchaseDTO;
import com.team14.ibe.dto.Request.RoomAvailabilityRequestDTO;
import com.team14.ibe.dto.response.PurchaseResponseDTO;
import com.team14.ibe.models.PurchaseEntity;
import com.team14.ibe.models.SendOfferEntity;
import com.team14.ibe.repository.PurchaseRepository;
import com.team14.ibe.repository.SendOfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.stream.Collectors;


@Service
public class PurchaseService {
    private PurchaseRepository purchaseRepository;
    private RoomAvailabilityService roomAvailabilityService;
    private SendOfferRepository sendOfferRepository;

    @Autowired
    public PurchaseService(PurchaseRepository purchaseRepository, RoomAvailabilityService roomAvailabilityService, SendOfferRepository sendOfferRepository) {
        this.purchaseRepository = purchaseRepository;
        this.roomAvailabilityService = roomAvailabilityService;
        this.sendOfferRepository = sendOfferRepository;
    }

    @Transactional
    public boolean checkFormData(PurchaseDTO mappedData) {
        try {
            long bookingCount = purchaseRepository.count() + 1;
            PurchaseEntity purchaseEntity = mapDtoToEntity(mappedData, bookingCount);
            String travelEmail = purchaseEntity.getTravelemail();
            System.out.println( "offer value: " +  purchaseEntity.isSendOffers());
            if(purchaseEntity.isSendOffers()) {
                SendOfferEntity sendOfferEntity = SendOfferEntity.builder()
                        .userEmail(travelEmail)
                        .build();
                System.out.println(sendOfferEntity);
                sendOfferRepository.save(sendOfferEntity);
            }
            RoomAvailabilityRequestDTO roomAvailabilityResponseDTO = new RoomAvailabilityRequestDTO((long)purchaseEntity.getPropertyId(), (long)purchaseEntity.getRoomTypeId(), purchaseEntity.getStartDate(), purchaseEntity.getEndDate(), purchaseEntity.getBookingId(), purchaseEntity.getNumberOfRooms());
            boolean checkRoomAvailability = roomAvailabilityService.processRoomAvailabilities(roomAvailabilityResponseDTO, purchaseEntity, purchaseEntity.getBookingCount());

            if(checkRoomAvailability) {
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    public List<PurchaseResponseDTO> getAllPurchases() {
        List<PurchaseEntity> purchases = purchaseRepository.findAll();
        return purchases.stream().map(this::mapEntityToResponseDTO).collect(Collectors.toList());
    }


    private PurchaseEntity mapDtoToEntity(PurchaseDTO dto, long bookingCount) {
        PurchaseEntity entity = new PurchaseEntity();

        String startDate = convertToDate(dto.getStartDate());
        String endDate = convertToDate(dto.getEndDate());

        entity.setBookingCount(bookingCount);
        entity.setBookingId(dto.getBookingId());
        entity.setTravelfirstName(dto.getTravelfirstName());
        entity.setTravellastName(dto.getTravellastName());
        entity.setTravelphone(dto.getTravelphone());
        entity.setTravelemail(dto.getTravelemail());
        entity.setBillingfirstName(dto.getBillingfirstName());
        entity.setBillinglastName(dto.getBillinglastName());
        entity.setAddress1(dto.getAddress1());
        entity.setAddress2(dto.getAddress2());
        entity.setCountry(dto.getCountry());
        entity.setState(dto.getState());
        entity.setCity(dto.getCity());
        entity.setBillingemail(dto.getBillingemail());
        entity.setBillingphone(dto.getBillingphone());
        entity.setCardNumber(dto.getCardNumber());
        entity.setExpMonth(dto.getExpMonth());
        entity.setExpYear(dto.getExpYear());
        entity.setZip(dto.getZip());
        entity.setStartDate(startDate);
        entity.setEndDate(endDate);
        entity.setNightlyRate(dto.getNightlyRate());
        entity.setTotalAmount(dto.getTotalAmount());
        entity.setSubtotal(dto.getSubtotal());
        entity.setTaxAmount(dto.getTaxAmount());
        entity.setVatAmount(dto.getVatAmount());
        entity.setTotalPrice(dto.getTotalPrice());
        entity.setRoomTypeId(dto.getRoomTypeId());
        entity.setRoomname(dto.getRoomname());
        entity.setPropertyId(dto.getProperty());
        entity.setAdultCount(dto.getAdultCount());
        entity.setNumberOfRooms(dto.getNumberOfRooms());

        entity.setChildCount(dto.getChildCount());

        entity.setPromotionTitle(dto.getPromotionTitle());

        entity.setPromotionDescription(dto.getPromotionDescription());

        entity.setPromotionPriceFactor(dto.getPromotionPriceFactor());

        entity.setNightlyRate(dto.getNightlyRate());
        entity.setSendOffers(dto.isSendOffers());

        return entity;
    }

    public static String convertToDate(Date inputDate) {
        SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        outputFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        return outputFormat.format(inputDate);
    }

    public static Date convertToDateObject(String inputDateStr) {
        SimpleDateFormat inputFormat;
        if (inputDateStr.contains("T")) {
            inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        } else if (inputDateStr.contains(".")) {
            inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        } else {
            inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        }

        inputFormat.setTimeZone(TimeZone.getTimeZone("UTC"));

        try {
            return inputFormat.parse(inputDateStr);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

    private PurchaseResponseDTO mapEntityToResponseDTO(PurchaseEntity entity) {
        PurchaseResponseDTO dto = new PurchaseResponseDTO();


        Date startDate = convertToDateObject(entity.getStartDate());
        Date endDate = convertToDateObject(entity.getEndDate());

        dto.setBookingId(entity.getBookingId());
        dto.setTravelfirstName(entity.getTravelfirstName());
        dto.setTravellastName(entity.getTravellastName());
        dto.setTravelphone(entity.getTravelphone());
        dto.setTravelemail(entity.getTravelemail());
        dto.setBillingfirstName(entity.getBillingfirstName());
        dto.setBillinglastName(entity.getBillinglastName());
        dto.setAddress1(entity.getAddress1());
        dto.setAddress2(entity.getAddress2());
        dto.setCountry(entity.getCountry());
        dto.setState(entity.getState());
        dto.setCity(entity.getCity());
        dto.setBillingemail(entity.getBillingemail());
        dto.setBillingphone(entity.getBillingphone());
        dto.setCardNumber(entity.getCardNumber());
        dto.setExpMonth(entity.getExpMonth());
        dto.setExpYear(entity.getExpYear());
        dto.setZip(entity.getZip());
        dto.setStartDate(startDate);
        dto.setEndDate(endDate);
        dto.setNightlyRate(entity.getNightlyRate());
        dto.setTotalAmount(entity.getTotalAmount());
        dto.setSubtotal(entity.getSubtotal());
        dto.setTaxAmount(entity.getTaxAmount());
        dto.setVatAmount(entity.getVatAmount());
        dto.setTotalPrice(entity.getTotalPrice());
        dto.setRoomname(entity.getRoomname());
        dto.setPromotionTitle(entity.getPromotionTitle());
        dto.setPromotionDescription(entity.getPromotionDescription());
        dto.setPromotionPriceFactor(entity.getPromotionPriceFactor());
        dto.setPromotionPromotionId(entity.getPromotionPromotionId());
        dto.setAdultCount(entity.getAdultCount());
        dto.setChildCount(entity.getChildCount());
        dto.setTeenCount(entity.getTeenCount());
        System.out.println("number of rooms dto: " + dto.getNumberOfRooms());
        System.out.println("number of rooms: " + entity.getNumberOfRooms());
        dto.setNumberOfRooms(entity.getNumberOfRooms());
        dto.setProperty(entity.getPropertyId());
        dto.setRoomTypeId(entity.getRoomTypeId());
        dto.setSendOffers(entity.isSendOffers());
        return dto;
    }
}