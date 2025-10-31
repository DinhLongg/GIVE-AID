import api from './api';

export const login = async (usernameOrEmail, password) => {
    try {
        const response = await api.post('/auth/login', {
            usernameOrEmail,
            password
        });

        localStorage.setItem('token', response.data.token);

        return {
            success: true, 
            message: response.data.message,
            token: response.data.token
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Login failed. Please try again.',
        };
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', {
            fullName: userData.fullName,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            phone: userData.phone || null,
            address: userData.address || null
        });

        localStorage.setItem('token', response.data.token);
        return{
            success: true,
            message: response.data.message,
            token: response.data.token
        }
    } catch (error) {
        return{
            success: false,
            message: error.response?.data?.message || 'Registration failed. Please try again.',
        };
    }
}

// Logout function
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  
  // Get current user (optional)
  export const getCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user info'
      };
    }
  };
  
  // Check auth status
  export const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };