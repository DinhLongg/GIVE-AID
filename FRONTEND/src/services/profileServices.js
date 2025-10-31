import api from './api';

/**
 * Get current user's profile
 */
export const getProfile = async () => {
    try {
        const response = await api.get('/profile');
        // Handle null response (profile doesn't exist yet)
        return {
            success: true,
            profile: response.data || null
        };
    } catch (error) {
        // Handle 404 specifically - profile doesn't exist yet
        if (error.response?.status === 404) {
            return {
                success: true,
                profile: null
            };
        }
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to load profile',
            profile: null
        };
    }
};

/**
 * Update current user's profile
 */
export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/profile', profileData);
        return {
            success: true,
            message: response.data.message || 'Profile updated successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update profile'
        };
    }
};

/**
 * Change password for current user
 */
export const changePassword = async (passwordData) => {
    try {
        const response = await api.post('/profile/change-password', passwordData);
        return {
            success: true,
            message: response.data.message || 'Password changed successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to change password'
        };
    }
};

