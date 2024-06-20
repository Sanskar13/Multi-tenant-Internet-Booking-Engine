package com.team14.ibe.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "purchases")
public class PurchaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String bookingId;
    private String travelfirstName;
    private String travellastName;
    private String travelphone;
    private String travelemail;
    private String billingfirstName;
    private String billinglastName;
    private String address1;
    private String address2;
    private String country;
    private String state;
    private String city;
    private String billingemail;
    private String billingphone;
    private String cardNumber;
    private String expMonth;
    private String expYear;
    private String zip;
    private String startDate;
    private String endDate;
    private double nightlyRate;
    private double totalAmount;
    private double subtotal;
    private double taxAmount;
    private double vatAmount;
    private double totalPrice;
    private int statusId;
    private int propertyId;
    private double priceFactor;
    private String promotionTitle;
    private String promotionDescription;
    private double promotionPriceFactor;
    private String promotionPromotionId;
    private double promotionMinimumDaysOfStay;
    private int adultCount;
    private int childCount;
    private int teenCount;
    private int numberOfRooms;
    private String roomname;
    private int roomTypeId;
    private long bookingCount;
    private boolean sendOffers;
    @Column(name = "is_cancelled", nullable = false, columnDefinition = "boolean default false")
    private boolean isCancelled;
}
