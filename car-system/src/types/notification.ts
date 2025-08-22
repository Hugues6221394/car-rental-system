// src/types/notification.ts
export interface Notification {
    id: string;
    userId: number;
    type: 'reservation_update' | 'system' | 'promotion';
    title: string;
    message: string;
    read: boolean;
    relatedReservationId?: number;
    createdAt: Date;
    metadata?: Record<string, any>;
}

export interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    push: boolean;
}