import { createContext, useState, useEffect, useContext } from 'react';
import { login as loginService, register as registerService, logout as logoutService } from '../services/authServices';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Decode JWT token to get user info
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      
      // Map JWT claims to user data
      // Try multiple possible claim names for each field
      return {
        id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] 
          || decoded['nameidentifier']
          || decoded.nameid 
          || decoded.sub
          || decoded.Id,
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
          || decoded['emailaddress']
          || decoded.email
          || decoded.Email,
        fullName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
          || decoded['name']
          || decoded.FullName
          || decoded.fullName
          || decoded.unique_name,
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          || decoded['role']
          || decoded.Role
          || decoded.role
      };
    } catch (error) {
      return null;
    }
  };

  // Load user from localStorage on mount
  useEffect(() => {
    // First try to load from localStorage user object
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData && userData.email) {
          setUser(userData);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        // Error parsing saved user, continue to decode token
      }
    }
    
    // If no saved user, try to decode token
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.email) {
        const userData = {
          fullName: decoded.fullName && decoded.fullName.trim() ? decoded.fullName : 'User',
          email: decoded.email || '',
          id: decoded.id || null,
          role: decoded.role || 'User'
        };
        setUser(userData);
        // Save to localStorage for next time
        localStorage.setItem('user', JSON.stringify(userData));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    const result = await loginService(usernameOrEmail, password);
    if (result.success) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.email) {
          const userData = {
            fullName: decoded.fullName || 'User',
            email: decoded.email || '',
            id: decoded.id || null,
            role: decoded.role || 'User'
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    }
    return result;
  };

  const register = async (userData) => {
    const result = await registerService(userData);
    if (result.success) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.email) {
          // Prioritize decoded.fullName from token, fallback to userData.fullName from form
          const fullName = decoded.fullName && decoded.fullName.trim() 
            ? decoded.fullName 
            : (userData.fullName && userData.fullName.trim() ? userData.fullName : 'User');
          
          const userInfo = {
            fullName: fullName,
            email: decoded.email || userData.email || '',
            id: decoded.id || null,
            role: decoded.role || 'User'
          };
          setUser(userInfo);
          localStorage.setItem('user', JSON.stringify(userInfo));
        } else {
          // If decode fails, use form data directly
          const userInfo = {
            fullName: userData.fullName || 'User',
            email: userData.email || '',
            id: null,
            role: 'User'
          };
          setUser(userInfo);
          localStorage.setItem('user', JSON.stringify(userInfo));
        }
      }
    }
    return result;
  };

  const logout = () => {
    logoutService();
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

    