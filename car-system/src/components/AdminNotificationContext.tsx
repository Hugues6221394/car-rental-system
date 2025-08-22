// src/contexts/AdminNotificationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Notification } from '@/types/notification';
import { notificationService } from '@/lib/notificationService';

interface AdminNotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    refreshNotifications: () => Promise<void>;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const AdminNotificationContext = createContext<AdminNotificationContextType | undefined>(undefined);

export const AdminNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const refreshNotifications = async () => {
        try {
            setLoading(true);
            const [notificationsResponse, unreadCountResponse] = await Promise.all([
                notificationService.getAdminNotifications(),
                notificationService.getAdminUnreadCount()
            ]);

            setNotifications(notificationsResponse.data);
            setUnreadCount(unreadCountResponse.data);
        } catch (error) {
            console.error('Failed to fetch admin notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(prev => prev.map(n =>
                n.id.toString() === notificationId ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => prev - 1);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    useEffect(() => {
        refreshNotifications();

        // Refresh every 30 seconds for real-time updates
        const interval = setInterval(refreshNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AdminNotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                refreshNotifications,
                markAsRead,
                markAllAsRead
            }}
        >
            {children}
        </AdminNotificationContext.Provider>
    );
};

export const useAdminNotifications = () => {
    const context = useContext(AdminNotificationContext);
    if (context === undefined) {
        throw new Error('useAdminNotifications must be used within an AdminNotificationProvider');
    }
    return context;
};