// src/lib/notificationService.ts
import api from './api'; // now works with default export
import type { Notification, NotificationPreferences } from '@/types/notification';

export const notificationService = {
    getUserNotifications: () => api.get<Notification[]>('/api/notifications'),

    markAsRead: (notificationId: string) =>
        api.patch(`/api/notifications/${notificationId}/read`),

    markAllAsRead: () => api.patch('/api/notifications/read-all'),

    deleteNotification: (notificationId: string) =>
        api.delete(`/api/notifications/${notificationId}`),

    updatePreferences: (preferences: Partial<NotificationPreferences>) =>
        api.patch('/api/notifications/preferences', preferences),

    // For admin - get all notifications
    getAllNotifications: (params?: { page?: number; size?: number }) =>
        api.get('/api/admin/notifications', { params }),
};
