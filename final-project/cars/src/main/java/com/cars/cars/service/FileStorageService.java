package com.cars.cars.service;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:D:/Desktop/AUCA/WEBTECH/We_tech_final/car-system/public/cars}")
    private String uploadPath;

    private Path uploadDir;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @PostConstruct
    public void init() {
        this.uploadDir = Paths.get(uploadPath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadDir);
            logInfo("Upload directory initialized: " + uploadDir.toAbsolutePath());
        } catch (IOException e) {
            logError("Could not create upload directory: " + e.getMessage());
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            logError("Failed to store empty file");
            throw new IOException("Failed to store empty file");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            logError("Original filename is empty");
            throw new IOException("Original filename cannot be empty");
        }

        String extension = FilenameUtils.getExtension(originalFilename);
        if (!isValidImageExtension(extension)) {
            logError("Invalid file type: " + extension);
            throw new IOException("Invalid file type. Only JPG, PNG, and WebP are allowed");
        }

        String filename = UUID.randomUUID().toString() + "." + extension;
        Path destinationFile = uploadDir.resolve(filename);

        Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

        if (!Files.exists(destinationFile)) {
            logError("File was not saved successfully: " + filename);
            throw new IOException("Failed to save file: " + filename);
        }

        // Return path that matches the resource handler configuration
        return "/cars/" + filename;
    }

    private boolean isValidImageExtension(String extension) {
        if (extension == null) return false;
        String ext = extension.toLowerCase();
        return ext.equals("jpg") || ext.equals("jpeg") || ext.equals("png") || ext.equals("webp") || ext.equals("gif");
    }

    private void logInfo(String message) {
        System.out.println(String.format("[%s] [INFO] [%s] %s",
                LocalDateTime.now().format(formatter),
                "FileStorageService",
                message));
    }

    private void logError(String message) {
        System.err.println(String.format("[%s] [ERROR] [%s] %s",
                LocalDateTime.now().format(formatter),
                "FileStorageService",
                message));
    }
}