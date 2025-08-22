// src/lib/notificationService.ts
import api from './api';
import type { Notification, NotificationPreferences } from '@/types/notification';
import type {AxiosResponse} from "axios";

export const notificationService = {
    // User methods
    getUserNotifications: () => api.get<Notification[]>('/api/notifications'),

    markAsRead: (notificationId: string) =>
        api.patch(`/api/notifications/${notificationId}/read`),

    markAllAsRead: () => api.patch('/api/notifications/read-all'),

    deleteNotification: (notificationId: string) =>
        api.delete(`/api/notifications/${notificationId}`),

    updatePreferences: (preferences: Partial<NotificationPreferences>) =>
        api.patch('/api/notifications/preferences', preferences),

    // // Admin methods
    // getAdminNotifications: () => api.get<Notification[]>('/api/notifications/admin'),
    //
    // getAdminUnreadCount: () => api.get<number>('/api/notifications/admin/unread-count'),

    getAdminNotifications: async (): Promise<AxiosResponse<Notification[]>> => {
        console.log('Fetching admin notifications...');
        try {
            const response = await api.get<Notification[]>('/api/notifications/admin');
            console.log('Admin notifications response:', response);
            return response;
        } catch (error) {
            console.error('Error fetching admin notifications:', error);
            throw error;
        }
    },

    getAdminUnreadCount: async (): Promise<AxiosResponse<number>> => {
        console.log('Fetching admin unread count...');
        try {
            const response = await api.get<number>('/api/notifications/admin/unread-count');
            console.log('Admin unread count response:', response);
            return response;
        } catch (error) {
            console.error('Error fetching admin unread count:', error);
            throw error;
        }
    }

};