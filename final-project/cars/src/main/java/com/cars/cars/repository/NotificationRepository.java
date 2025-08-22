package com.cars.cars.repository;

import java.util.List;
import com.cars.cars.model.Notification;
import com.cars.cars.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
}
