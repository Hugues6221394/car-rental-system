package com.cars.cars.config;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", System.getProperty("cloudinary.cloud-name", "dl1odfhfa"),
                "api_key", System.getProperty("cloudinary.api-key", "897119928293383"),
                "api_secret", System.getProperty("cloudinary.api-secret", "16964T2ABxBvQjtG7RlN33O49Ww")));
    }
}
