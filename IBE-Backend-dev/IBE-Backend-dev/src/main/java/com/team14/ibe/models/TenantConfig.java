// package com.team14.ibe.models;

// import com.azure.storage.blob.BlobClient;
// import com.azure.storage.blob.BlobContainerClient;
// import com.azure.storage.blob.BlobServiceClientBuilder;
// import org.springframework.context.annotation.PropertySource;
// import org.springframework.stereotype.Component;
// import com.fasterxml.jackson.core.type.TypeReference;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.io.ByteArrayOutputStream;
// import java.io.IOException;
// import java.util.Map;

// @Data
// @AllArgsConstructor
// @NoArgsConstructor
// @Component
// @PropertySource("classpath:application.properties")
// public class TenantConfig {

// private String connectionString =
// "DefaultEndpointsProtocol=https;AccountName=team14ibestorageaccount;AccountKey=cf1mJ6YM0XX4+U5RxAtZQsvVb7FkwLYVw1eXh9WaLrEpj2Xh4GLL7hsq0rIpr/UwZ8fp++sHvMrg+AStpzMG0w==;EndpointSuffix=core.windows.net";
// private String containerName = "team14";

// private String headerLogoImageUrl;
// private String pageTitleText;
// private String bannerImageUrl;
// private int maxStayDays;
// private String[] guestTypes;
// private int maxGuestCount;
// private Integer[] roomCountOptions;
// private int maxRooms;
// private String[] amenities;
// private String description;

// public Map<String, Object> getConfigData() throws IOException {
// BlobServiceClientBuilder blobServiceClientBuilder = new
// BlobServiceClientBuilder().connectionString(connectionString);
// BlobContainerClient containerClient =
// blobServiceClientBuilder.buildClient().getBlobContainerClient(containerName);

// BlobClient blobClient = containerClient.getBlobClient("data.json");
// ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
// blobClient.download(outputStream);

// String jsonData = new String(outputStream.toByteArray());
// ObjectMapper mapper = new ObjectMapper();
// Map<String, Object> configData = mapper.readValue(jsonData, new
// TypeReference<Map<String, Object>>() {});
// return configData;
// }
// }