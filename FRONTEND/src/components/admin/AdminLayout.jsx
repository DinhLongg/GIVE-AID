import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const menuItems = [
    { path: '/admin/users', icon: 'fas fa-users', label: 'Users', key: 'users' },
    { path: '/admin/queries', icon: 'fas fa-question-circle', label: 'Queries', key: 'queries' },
    { path: '/admin/donations', icon: 'fas fa-donate', label: 'Donations', key: 'donations' },
    { path: '/admin/programs', icon: 'fas fa-calendar-alt', label: 'Programs', key: 'programs' },
    { path: '/admin/ngos', icon: 'fas fa-building', label: 'NGOs', key: 'ngos' },
    { path: '/admin/gallery', icon: 'fas fa-images', label: 'Gallery', key: 'gallery' },
    { path: '/admin/partners', icon: 'fas fa-handshake', label: 'Partners', key: 'partners' },
    { path: '/admin/about', icon: 'fas fa-info-circle', label: 'About Sections', key: 'about' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <div
        className={`bg-dark text-white ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{
          width: sidebarOpen ? '250px' : '70px',
          minHeight: '100vh',
          transition: 'width 0.3s',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1000,
          paddingTop: '60px'
        }}
      >
        <div className="p-3">
          {/* Toggle Button */}
          <button
            className="btn btn-link text-white p-0 mb-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ border: 'none', textDecoration: 'none' }}
          >
            <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>

          {/* Menu Items */}
          <nav className="nav flex-column">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`nav-link text-white mb-2 rounded ${
                  isActive(item.path) ? 'bg-primary' : ''
                }`}
                style={{
                  textDecoration: 'none',
                  padding: '10px 15px',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <i className={item.icon} style={{ width: '20px', marginRight: sidebarOpen ? '10px' : '0' }}></i>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarOpen ? '250px' : '70px',
          transition: 'margin-left 0.3s',
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflowX: 'hidden'
        }}
      >
        {/* Top Bar */}
        <nav
          className="navbar navbar-light bg-white shadow-sm"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 999,
            padding: '10px 30px',
          }}
        >
          <div className="d-flex justify-content-between align-items-center w-100">
            <h5 className="mb-0">Admin Dashboard</h5>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">
                <i className="fas fa-user-circle me-2"></i>
                {user?.fullName || user?.email}
              </span>
              <Link to="/" className="btn btn-sm btn-outline-primary">
                <i className="fas fa-home me-1"></i> Home
              </Link>
              <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-1"></i> Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div style={{ padding: '30px', minHeight: 'calc(100vh - 70px)', minWidth: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

