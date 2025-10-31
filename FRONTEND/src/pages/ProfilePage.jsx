import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { getProfile, updateProfile, changePassword } from '../services/profileService';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser } = useAuth();

  // ===== STATE MANAGEMENT =====
  const [profileData, setProfileData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'password'

  // ===== LOAD PROFILE DATA =====
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      setIsLoadingProfile(true);
      const result = await getProfile();
      
      if (result.success) {
        setProfileData({
          fullName: result.profile.fullName || '',
          username: result.profile.username || '',
          email: result.profile.email || '',
          phone: result.profile.phone || '',
          address: result.profile.address || ''
        });
      } else {
        toast.error(
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#991b1b' }}>
                Failed to Load Profile
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {result.message || 'Unable to load your profile. Please try again.'}
              </div>
            </div>
          </div>,
          { autoClose: 750 }
        );
      }
      setIsLoadingProfile(false);
    };

    loadProfile();
  }, [isAuthenticated, navigate]);

  // ===== HANDLERS =====
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    let isValid = true;

    if (!profileData.fullName || profileData.fullName.trim() === '') {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validatePassword = () => {
    const newErrors = {};
    let isValid = true;

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!validateProfile()) {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>❌</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#991b1b' }}>
              Validation Failed
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Please correct the errors in the form
            </div>
          </div>
        </div>,
        { autoClose: 750 }
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateProfile(profileData);

      if (result.success) {
        toast.success(
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>✅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#065f46' }}>
                Profile Updated!
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {result.message || 'Your profile has been updated successfully'}
              </div>
            </div>
          </div>,
          { autoClose: 750 }
        );
      } else {
        toast.error(
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>❌</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#991b1b' }}>
                Update Failed
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {result.message || 'Failed to update profile. Please try again.'}
              </div>
            </div>
          </div>,
          { autoClose: 750 }
        );
      }
    } catch (error) {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#991b1b' }}>
              Connection Error
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Unable to connect to server. Please check your internet connection and try again.
            </div>
          </div>
        </div>,
        { autoClose: 750 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>❌</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#991b1b' }}>
              Validation Failed
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Please correct the errors in the form
            </div>
          </div>
        </div>,
        { autoClose: 750 }
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await changePassword(passwordData);

      if (result.success) {
        toast.success(
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>✅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#065f46' }}>
                Password Changed!
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {result.message || 'Your password has been changed successfully'}
              </div>
            </div>
          </div>,
          { autoClose: 750 }
        );
        // Clear password form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>❌</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#991b1b' }}>
                Password Change Failed
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {result.message || 'Failed to change password. Please try again.'}
              </div>
            </div>
          </div>,
          { autoClose: 750 }
        );
      }
    } catch (error) {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#991b1b' }}>
              Connection Error
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Unable to connect to server. Please check your internet connection and try again.
            </div>
          </div>
        </div>,
        { autoClose: 750 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ===== UI RENDERING =====
  if (isLoadingProfile) {
    return (
      <section className="py-5" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-5" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-4">
                <h1 className="fw-bold">My Profile</h1>
                <p className="text-muted">Manage your personal information and account settings</p>
              </div>

              {/* Tabs */}
              <ul className="nav nav-tabs mb-4" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="fas fa-user me-2"></i>Profile Information
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                  >
                    <i className="fas fa-lock me-2"></i>Change Password
                  </button>
                </li>
              </ul>

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="card shadow-sm" data-aos="fade-up">
                  <div className="card-body p-4 p-md-5">
                    <form onSubmit={handleUpdateProfile} noValidate>
                      <div className="mb-4">
                        <h5 className="mb-3">Basic Information</h5>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="fullName" className="form-label">Full Name *</label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                              placeholder="Enter your full name"
                              value={profileData.fullName}
                              onChange={handleProfileChange}
                              required
                            />
                            {errors.fullName && (
                              <div className="invalid-feedback d-block">
                                <i className="fas fa-exclamation-circle me-1"></i>{errors.fullName}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                              type="text"
                              id="username"
                              className="form-control"
                              value={profileData.username}
                              disabled
                            />
                            <div className="form-text">Username cannot be changed</div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                              type="email"
                              id="email"
                              className="form-control"
                              value={profileData.email}
                              disabled
                            />
                            <div className="form-text">Email cannot be changed</div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              className="form-control"
                              placeholder="Enter your phone number"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="mb-3">Address</h5>
                        <div className="row">
                          <div className="col-12 mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input
                              type="text"
                              id="address"
                              name="address"
                              className="form-control"
                              placeholder="Enter your address"
                              value={profileData.address}
                              onChange={handleProfileChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => navigate('/')}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <div className="card shadow-sm" data-aos="fade-up">
                  <div className="card-body p-4 p-md-5">
                    <form onSubmit={handleChangePassword} noValidate>
                      <div className="mb-4">
                        <h5 className="mb-3">Change Password</h5>
                        <div className="row">
                          <div className="col-12 mb-3">
                            <label htmlFor="currentPassword" className="form-label">Current Password *</label>
                            <input
                              type="password"
                              id="currentPassword"
                              name="currentPassword"
                              className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                              placeholder="Enter your current password"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                            {errors.currentPassword && (
                              <div className="invalid-feedback d-block">
                                <i className="fas fa-exclamation-circle me-1"></i>{errors.currentPassword}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password *</label>
                            <input
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                              placeholder="Enter new password (min 6 characters)"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                            {errors.newPassword ? (
                              <div className="invalid-feedback d-block">
                                <i className="fas fa-exclamation-circle me-1"></i>{errors.newPassword}
                              </div>
                            ) : (
                              <div className="form-text">Password must be at least 6 characters</div>
                            )}
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm New Password *</label>
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                              placeholder="Confirm new password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                            {errors.confirmPassword && (
                              <div className="invalid-feedback d-block">
                                <i className="fas fa-exclamation-circle me-1"></i>{errors.confirmPassword}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setPasswordData({
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                            setErrors({});
                          }}
                        >
                          Clear
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Changing...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-key me-2"></i>Change Password
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
