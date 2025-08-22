// src/pages/admin/AdminNotifications.tsx
import React, { useState } from 'react';
import { useAdminNotifications } from '@/components/AdminNotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users,
    Calendar,
    CreditCard,
    AlertCircle,
    CheckCircle,
    XCircle,
    Filter,
    RefreshCw
} from 'lucide-react';

const AdminNotifications: React.FC = () => {
    const {
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markAsRead,
        markAllAsRead
    } = useAdminNotifications();

    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const getIconForType = (type: string) => {
        switch (type) {
            case 'USER_REGISTERED':
                return <Users className="w-4 h-4" />;
            case 'RESERVATION_CREATED':
            case 'RESERVATION_UPDATED':
            case 'RESERVATION_CANCELLED':
                return <Calendar className="w-4 h-4" />;
            case 'PAYMENT_COMPLETED':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'PAYMENT_FAILED':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getBadgeColor = (type: string) => {
        switch (type) {
            case 'USER_REGISTERED':
                return 'bg-blue-100 text-blue-800';
            case 'RESERVATION_CREATED':
                return 'bg-green-100 text-green-800';
            case 'RESERVATION_UPDATED':
                return 'bg-yellow-100 text-yellow-800';
            case 'RESERVATION_CANCELLED':
                return 'bg-red-100 text-red-800';
            case 'PAYMENT_COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PAYMENT_FAILED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString();
    };

    const filteredNotifications = notifications.filter((n) => {
        const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.message.toLowerCase().includes(search.toLowerCase());

        const matchesTab = activeTab === 'all' ||
            (activeTab === 'unread' && !n.read) ||
            (activeTab === 'users' && n.type.includes('USER')) ||
            (activeTab === 'reservations' && n.type.includes('RESERVATION')) ||
            (activeTab === 'payments' && n.type.includes('PAYMENT'));

        return matchesSearch && matchesTab;
    });

    const stats = {
        total: notifications.length,
        unread: unreadCount,
        users: notifications.filter(n => n.type.includes('USER')).length,
        reservations: notifications.filter(n => n.type.includes('RESERVATION')).length,
        payments: notifications.filter(n => n.type.includes('PAYMENT')).length,
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Monitor system activities, user registrations, reservations, and payments
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Notifications</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Filter className="w-8 h-8 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Unread</p>
                                <p className="text-2xl font-bold">{stats.unread}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Users</p>
                                <p className="text-2xl font-bold">{stats.users}</p>
                            </div>
                            <Users className="w-8 h-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Reservations</p>
                                <p className="text-2xl font-bold">{stats.reservations}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Payments</p>
                                <p className="text-2xl font-bold">{stats.payments}</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-purple-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>System Notifications</CardTitle>
                            <CardDescription>Monitor all system activities and user actions</CardDescription>
                        </div>
                        <div className="flex space-x-2">
                            <Button onClick={markAllAsRead} variant="outline" disabled={unreadCount === 0}>
                                Mark All Read
                            </Button>
                            <Button onClick={refreshNotifications} disabled={loading}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-4 mb-6">
                        <Input
                            placeholder="Search notifications..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1"
                        />
                    </div>

                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                            <TabsTrigger value="unread">Unread ({stats.unread})</TabsTrigger>
                            <TabsTrigger value="users">Users ({stats.users})</TabsTrigger>
                            <TabsTrigger value="reservations">Reservations ({stats.reservations})</TabsTrigger>
                            <TabsTrigger value="payments">Payments ({stats.payments})</TabsTrigger>
                        </TabsList>

                        <TabsContent value={activeTab} className="mt-6">
                            {filteredNotifications.length === 0 ? (
                                <p className="text-gray-500 text-center py-6">
                                    {loading ? 'Loading notifications...' : 'No notifications found.'}
                                </p>
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
                                                <div className="flex items-start space-x-3">
                                                    <div className="mt-1">{getIconForType(n.type)}</div>
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <h4 className="font-semibold">{n.title}</h4>
                                                            <span className={`px-2 py-1 text-xs rounded-full ${getBadgeColor(n.type)}`}>
                                                                {n.type.replace('_', ' ').toLowerCase()}
                                                            </span>
                                                            {!n.read && (
                                                                <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                                                                    New
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {formatDate(n.createdAt)}
                                                            {n.relatedEntityId && ` • ID: ${n.relatedEntityId}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    {!n.read && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => markAsRead(n.id.toString())}
                                                            className="h-8 w-8"
                                                        >
                                                            ✔
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminNotifications;