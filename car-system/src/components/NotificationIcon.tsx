import React, { useState } from 'react';
import { useNotifications } from './NotificationContext';
import { Bell, Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

const NotificationIcon: React.FC = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading } = useNotifications();
    const [open, setOpen] = useState(false);

    const handleMarkAsRead = async (id: string) => await markAsRead(id);
    const handleMarkAllAsRead = async () => await markAllAsRead();
    const handleDelete = async (id: string) => await deleteNotification(id);

    const formatTime = (date: Date) => {
        const diff = Date.now() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-navy-700"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-lg shadow-lg z-50">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No notifications</div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={cn(
                                    'p-3 border-b last:border-b-0 cursor-pointer',
                                    !n.read && 'bg-gray-100 dark:bg-navy-700'
                                )}
                                onClick={() => handleMarkAsRead(n.id)} // ✅ mark as read on click
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">{n.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatTime(n.createdAt)}</p>

                                        {n.relatedReservationId && (
                                            <Link
                                                to="/reservations"
                                                className="text-xs text-blue-600 hover:underline mt-1 block"
                                                onClick={() => setOpen(false)}
                                            >
                                                View Reservation
                                            </Link>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(n.id);
                                        }}
                                        className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-navy-700 rounded"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="p-2 border-t">
                        <Link
                            to="/notifications"
                            className="block text-center text-sm text-blue-600 hover:underline"
                            onClick={() => setOpen(false)}
                        >
                            View all notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationIcon;
