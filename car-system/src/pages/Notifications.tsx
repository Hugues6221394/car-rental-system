// src/pages/Notifications.tsx
import React from 'react';
import { useNotifications } from '@/components/NotificationContext';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Trash2, Bell } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { getReservationId} from '@/types/notification'; // ✅ Import helpers

const NotificationsPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const {
        notifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        unreadCount,
        loading,
    } = useNotifications();

    const formatTime = (date: Date) => new Date(date).toLocaleString();

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'RESERVATION_CREATED':
            case 'RESERVATION_UPDATED':
            case 'RESERVATION_CANCELLED':
                return '📋';
            case 'USER_REGISTERED':
                return '👤';
            case 'PAYMENT_COMPLETED':
                return '💳';
            case 'PAYMENT_FAILED':
                return '❌';
            case 'PROMOTION':
                return '🎁';
            case 'SYSTEM_ALERT':
                return '⚙️';
            default:
                return '🔔';
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                Please log in to view notifications.
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                Loading notifications...
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your notifications and preferences
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={markAllAsRead} variant="outline">
                        <Check className="h-4 w-4 mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Notifications</CardTitle>
                    <CardDescription>
                        {notifications.length} total notifications ({unreadCount} unread)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {notifications.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
                            <p className="text-muted-foreground">
                                You'll see important updates about your reservations here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => {
                                const reservationId = getReservationId(notification);

                                return (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border rounded-lg ${
                                            !notification.read
                                                ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-3 flex-1">
                                                <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h4 className="font-semibold">{notification.title}</h4>
                                                        {!notification.read && (
                                                            <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                                                                New
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-muted-foreground mb-2">{notification.message}</p>
                                                    <p className="text-xs text-muted-foreground">{formatTime(notification.createdAt)}</p>

                                                    {reservationId && (
                                                        <Link
                                                            to="/reservations"
                                                            search={{ id: reservationId.toString() }}
                                                            className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                                                        >
                                                            View Reservation Details
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 ml-4">
                                                {!notification.read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => markAsRead(notification.id.toString())} // ✅ Convert to string
                                                        className="h-8 w-8"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteNotification(notification.id.toString())} // ✅ Convert to string
                                                    className="h-8 w-8"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default NotificationsPage;