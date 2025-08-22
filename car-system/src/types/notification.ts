export interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
    relatedEntityId?: number;    // ✅ Use this instead of relatedReservationId
    relatedEntityType?: string;  // ✅ This tells you what type of entity it is
    metadata?: string;
}

// Remove this since it doesn't exist in backend
// export interface NotificationPreferences {
//     email: boolean;
//     push: boolean;
//     sms: boolean;
//     reservationUpdates: boolean;
//     paymentUpdates: boolean;
//     promotions: boolean;
// }

// Add helper functions
export const isReservationNotification = (notification: Notification): boolean => {
    return notification.relatedEntityType === 'reservation' ||
        notification.type.includes('RESERVATION');
};

export const getReservationId = (notification: Notification): number | null => {
    if (isReservationNotification(notification) && notification.relatedEntityId) {
        return notification.relatedEntityId;
    }
    return null;
};