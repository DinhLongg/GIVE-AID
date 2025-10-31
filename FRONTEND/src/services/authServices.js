import api from './api';

export const login = async (usernameOrEmail, password) => {
    try {
        const response = await api.post('/auth/login', {
            usernameOrEmail: usernameOrEmail?.trim() || '',
            password: password || ''
        });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }

        return {
            success: true, 
            message: response.data.message,
            token: response.data.token || null
        };
    } catch (error) {
        // Log error details for debugging
        console.error('Login error:', error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || error.response?.data?.errors || 'Login failed. Please try again.',
            errors: error.response?.data?.errors
        };
    }
};

export const register = async (userData) => {
    try {
        // Ensure all required fields are present and trimmed
        const requestData = {
            fullName: userData.fullName?.trim() || '',
            username: userData.username?.trim() || '',
            email: userData.email?.trim() || '',
            password: userData.password || '',
            phone: userData.phone?.trim() || null,
            address: userData.address?.trim() || null
        };

        // Log request for debugging
        console.log('[Debug] Register request:', { ...requestData, password: '***' });

        const response = await api.post('/auth/register', requestData);

        // Only save token if it exists (email verification disabled)
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        
        return {
            success: true,
            message: response.data.message,
            token: response.data.token || null
        }
    } catch (error) {
        // Log error details for debugging
        console.error('Register error:', error.response?.data);
        return {
            success: false,
            message: error.response?.data?.message || error.response?.data?.errors || 'Registration failed. Please try again.',
            errors: error.response?.data?.errors
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

  /**
   * Verify email with token
   */
  export const verifyEmail = async (token) => {
    try {
      // Log token for debugging
      console.log('[Debug] Verifying email with token (original):', token);
      
      // Try to decode token, but catch error if already decoded
      let decodedToken = token;
      try {
        decodedToken = decodeURIComponent(token || '');
        if (decodedToken !== token) {
          console.log('[Debug] Token was URL encoded, decoded to:', decodedToken);
        }
      } catch (e) {
        // Token might already be decoded
        console.log('[Debug] Token appears to be already decoded');
      }
      
      const response = await api.post('/auth/verify-email', { token: decodedToken });
      return {
        success: true,
        message: response.data.message || 'Email verified successfully'
      };
    } catch (error) {
      console.error('Verify email error:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to verify email'
      };
    }
  };

  /**
   * Resend verification email
   */
  export const resendVerificationEmail = async (email) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return {
        success: true,
        message: response.data.message || 'Verification email has been sent'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to resend verification email'
      };
    }
  };