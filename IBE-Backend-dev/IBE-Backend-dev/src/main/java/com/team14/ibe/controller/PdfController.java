package com.team14.ibe.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.io.FileOutputStream;
import java.io.IOException;

@RestController
public class PdfController {

    @PostMapping("/api/send-pdf")
    public String receivePdf(@RequestBody byte[] pdfData) {
        try {
            String filePath = "/booking.pdf";
            FileOutputStream fos = new FileOutputStream(filePath);
            fos.write(pdfData);
            fos.close();
            return "PDF file saved successfully";
        } catch (IOException e) {
            e.printStackTrace();
            return "Error saving PDF file";
        }
    }
}
