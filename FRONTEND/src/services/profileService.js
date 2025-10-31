import api from './api';

/**
 * Get current user's profile information
 */
export const getProfile = async () => {
    try {
        const response = await api.get('/profile');
        return {
            success: true,
            profile: response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to load profile. Please try again.'
        };
    }
};

/**
 * Update user profile information
 * @param {Object} profileData - { fullName?, phone?, address? }
 */
export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/profile', {
            fullName: profileData.fullName?.trim() || null,
            phone: profileData.phone?.trim() || null,
            address: profileData.address?.trim() || null
        });
        return {
            success: true,
            message: response.data.message,
            profile: response.data.profile
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update profile. Please try again.'
        };
    }
};

/**
 * Change user password
 * @param {Object} passwordData - { currentPassword, newPassword, confirmPassword }
 */
export const changePassword = async (passwordData) => {
    try {
        const response = await api.put('/profile/password', {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword
        });
        return {
            success: true,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to change password. Please try again.'
        };
    }
};

