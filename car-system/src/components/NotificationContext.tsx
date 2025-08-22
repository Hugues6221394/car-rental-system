// src/components/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {Notification, NotificationPreferences} from '@/types/notification';
import { useAuth } from './AuthContext';
import { notificationService } from '@/lib/notificationService';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    preferences: NotificationPreferences;
    loading: boolean;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (notificationId: string) => Promise<void>;
    updatePreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
    refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        email: true,
        sms: true,
        push: true,
    });
    const [loading, setLoading] = useState(true);

    const unreadCount = notifications.filter(n => !n.read).length;

    const refreshNotifications = useCallback(async () => {
        if (!isAuthenticated || !user) return;

        try {
            setLoading(true);
            const response = await notificationService.getUserNotifications();
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    const markAsRead = async (notificationId: string) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(prev => prev.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            await notificationService.deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const updatePreferences = async (prefs: Partial<NotificationPreferences>) => {
        try {
            await notificationService.updatePreferences(prefs);
            setPreferences(prev => ({ ...prev, ...prefs }));
        } catch (error) {
            console.error('Failed to update preferences:', error);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false); // stop indefinite loading for non-authenticated users
            return;
        }

        refreshNotifications();
        const interval = setInterval(refreshNotifications, 30000);
        return () => clearInterval(interval);
    }, [isAuthenticated, refreshNotifications]);


    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                preferences,
                loading,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                updatePreferences,
                refreshNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};