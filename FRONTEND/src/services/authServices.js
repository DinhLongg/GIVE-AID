import api from './api';

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', {
            email,
            password
        });

        localStorage.setItem('token', response.data.token);

        return {
            success: true, 
            messsage: response.data.message,
            token: response.data.token
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Login failed. Please try again.',
        };
    }
};

