package com.cars.cars.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cars.cars.model.Notification;
import com.cars.cars.model.User;
import com.cars.cars.model.Notification.NotificationType;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // These methods take User object
    List<Notification> findByUserOrderByCreatedAtDesc(User user); // ✅ Add this

    // These methods take Long userId
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // These don't take parameters
    List<Notification> findAllByOrderByCreatedAtDesc();
    List<Notification> findByTypeOrderByCreatedAtDesc(NotificationType type);
    long countByReadFalse();

    // Query methods
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.read = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUser(User user);

    @Query("SELECT n FROM Notification n WHERE n.read = false ORDER BY n.createdAt DESC")
    List<Notification> findAllUnread();

    long countByUserAndReadFalse(User user);
}