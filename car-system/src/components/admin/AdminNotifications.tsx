// src/pages/admin/AdminNotifications.tsx
import React, { useState } from 'react';
import { notificationService } from '@/lib/notificationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

const AdminNotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const response = await notificationService.getAllNotifications();
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredNotifications = notifications.filter((n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Admin Notifications</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage system notifications and user communications
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Notifications</CardTitle>
                    <CardDescription>View and manage all system notifications</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-4 mb-6">
                        <Input
                            placeholder="Search notifications..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button onClick={loadNotifications} disabled={loading}>
                            {loading ? 'Loading...' : 'Refresh'}
                        </Button>
                    </div>

                    {filteredNotifications.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">No notifications found.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredNotifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-4 border rounded-lg ${
                                        !n.read ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800' : ''
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold">{n.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setNotifications((prev) =>
                                                        prev.map((notif) =>
                                                            notif.id === n.id ? { ...notif, read: true } : notif
                                                        )
                                                    )
                                                }
                                                className="h-8 w-8"
                                            >
                                                ✔
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminNotifications;
