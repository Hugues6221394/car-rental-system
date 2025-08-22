package com.cars.cars.model;


import com.cars.cars.model.Notification.NotificationType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class NotificationTypeConverter implements AttributeConverter<NotificationType, String> {

    @Override
    public String convertToDatabaseColumn(NotificationType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name();
    }

    @Override
    public NotificationType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return NotificationType.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Handle unknown values gracefully
            return null;
        }
    }
}