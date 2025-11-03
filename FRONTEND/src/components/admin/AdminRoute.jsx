import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Show notification when redirecting
    if (!isLoading) {
      if (!isAuthenticated) {
        // Store the admin path to redirect after login
        localStorage.setItem('redirectAfterLogin', location.pathname);
        toast.error('Please login to access Admin Dashboard');
      } else if (user?.role !== 'Admin') {
        toast.error('Access denied. Admin privileges required.');
      }
    }
  }, [isLoading, isAuthenticated, user, location.pathname]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

