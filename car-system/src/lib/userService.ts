// In your lib/userService.ts
import api from './api';

export const userService = {
    updateProfile: (data: any) => api.put('/api/users/profile', data),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.post('/api/users/change-password', data),

    uploadProfileImage: (formData: FormData) =>
        api.post('/api/users/upload-profile-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};