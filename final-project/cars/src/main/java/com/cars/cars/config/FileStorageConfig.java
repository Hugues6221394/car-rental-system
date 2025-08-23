package com.cars.cars.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Configuration
public class FileStorageConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:D:/Desktop/AUCA/WEBTECH/We_tech_final/car-system/public/cars}")
    private String uploadDir;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize().toString();

        logInfo("Configuring resource handler");
        logInfo("Upload directory path: " + uploadPath);

        // Serve uploaded files from /cars/** (not /uploads/**)
        registry.addResourceHandler("/cars/**")
                .addResourceLocations("file:" + uploadPath + "/");

        logInfo("Resource handler configured successfully");
        logInfo("Resource pattern: /cars/**");
        logInfo("Resource location: file:" + uploadPath + "/");
    }

    private void logInfo(String message) {
        System.out.println(String.format("[%s] [INFO] [%s] %s",
                LocalDateTime.now().format(formatter),
                "FileStorageConfig",
                message));
    }
}