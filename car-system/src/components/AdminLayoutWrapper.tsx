// src/components/AdminLayoutWrapper.tsx
import { AdminNotificationProvider } from '@/components/AdminNotificationContext';

export const AdminLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AdminNotificationProvider>
            {children}
        </AdminNotificationProvider>
    );
};