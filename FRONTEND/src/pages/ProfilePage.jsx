import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile, changePassword } from '../services/profileServices';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Password change state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    streetAddress: '',
    city: '',
    country: ''
  });

  // Redirect to login if not authenticated (only after auth is loaded)
  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      // Wait for auth to load and check authentication
      if (authLoading) return;
      if (!isAuthenticated) return;

      setIsLoading(true);
      try {
        const result = await getProfile();
        if (result.success) {
          if (result.profile) {
            // Profile exists - load data
            const profile = result.profile;
            setFormData({
              fullName: profile.fullName || '',
              email: profile.email || '',
              phone: profile.phone || '',
              dateOfBirth: profile.dateOfBirth 
                ? new Date(profile.dateOfBirth).toISOString().split('T')[0] 
                : '',
              gender: profile.gender || '',
              streetAddress: profile.streetAddress || '',
              city: profile.city || '',
              country: profile.country || ''
            });
          } else {
            // Profile doesn't exist yet - initialize with user data from auth
            if (user) {
              setFormData(prev => ({
                ...prev,
                fullName: user.fullName || '',
                email: user.email || ''
              }));
            }
          }
        } else {
          // Error loading profile - initialize with user data from auth
          console.error('Error loading profile:', result.message);
          if (user) {
            setFormData(prev => ({
              ...prev,
              fullName: user.fullName || '',
              email: user.email || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
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

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.fullName || formData.fullName.trim() === '') {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
        { autoClose: 2000 }
      );
      return;
    }

    setIsSaving(true);

    try {
      // Prepare data for API
      const profileData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || '',
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        gender: formData.gender || null,
        streetAddress: formData.streetAddress?.trim() || null,
        city: formData.city?.trim() || null,
        country: formData.country || null
      };

      const result = await updateProfile(profileData);

      // ===== TOAST ALERTS =====
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
    } catch {
      // Connection error - show user-friendly message
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
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reload profile data to reset form
    window.location.reload();
  };

  // Password change handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: ''
      });
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!passwordData.currentPassword || passwordData.currentPassword.trim() === '') {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword || passwordData.newPassword.trim() === '') {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
      isValid = false;
    }

    if (!passwordData.confirmPassword || passwordData.confirmPassword.trim() === '') {
      newErrors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
      isValid = false;
    }

    setPasswordErrors(newErrors);
    return isValid;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
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
        { autoClose: 2000 }
      );
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      // ===== TOAST ALERTS =====
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
          { autoClose: 2000 }
        );
        
        // Reset form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowChangePassword(false);
        setPasswordErrors({});
      } else {
        // Set error to appropriate field based on error message
        const errorMessage = result.message || 'Failed to change password. Please try again.';
        
        if (errorMessage.toLowerCase().includes('current password')) {
          // Current password error - set to currentPassword field
          setPasswordErrors({
            ...passwordErrors,
            currentPassword: 'Current password is incorrect'
          });
        } else if (errorMessage.toLowerCase().includes('new password') || errorMessage.toLowerCase().includes('confirm')) {
          // New password or confirm password error
          if (errorMessage.toLowerCase().includes('match')) {
            setPasswordErrors({
              ...passwordErrors,
              confirmPassword: 'Passwords do not match'
            });
          } else if (errorMessage.toLowerCase().includes('length') || errorMessage.toLowerCase().includes('6')) {
            setPasswordErrors({
              ...passwordErrors,
              newPassword: 'New password must be at least 6 characters'
            });
          }
        }
        
        toast.error(
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>❌</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#991b1b' }}>
                Change Password Failed
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {errorMessage}
              </div>
            </div>
          </div>,
          { autoClose: 2000 }
        );
      }
    } catch {
      // Connection error - show user-friendly message
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
        { autoClose: 2000 }
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Show loading spinner while loading (auth or profile)
  if (authLoading || isLoading) {
    return (
      <section className="py-5" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">
                  {authLoading ? 'Verifying authentication...' : 'Loading profile...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render form if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // ===== UI RENDERING =====
  return (
    <>
      <section className="py-5" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-4" data-aos="fade-up">
                <h1 className="fw-bold">Profile</h1>
                <p className="text-muted">Update your personal information</p>
              </div>

              <div className="card shadow-sm" data-aos="fade-up">
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Basic Information */}
                    <div className="mb-4">
                      <h5 className="mb-3 section-title">Basic Information</h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="fullName" className="form-label">Full Name *</label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                          />
                          {errors.fullName && (
                            <div className="invalid-feedback d-block">
                              <i className="fas fa-exclamation-circle me-1"></i>{errors.fullName}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="email" className="form-label">Email *</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                          />
                          {errors.email && (
                            <div className="invalid-feedback d-block">
                              <i className="fas fa-exclamation-circle me-1"></i>{errors.email}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="phone" className="form-label">Phone</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="form-control"
                            placeholder="+84 123 456 789"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                          <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            className="form-control"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label htmlFor="gender" className="form-label">Gender</label>
                          <select
                            id="gender"
                            name="gender"
                            className="form-select"
                            value={formData.gender}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                      <h5 className="mb-3 section-title">Address</h5>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label htmlFor="streetAddress" className="form-label">Street Address</label>
                          <input
                            type="text"
                            id="streetAddress"
                            name="streetAddress"
                            className="form-control"
                            placeholder="123 ABC Street"
                            value={formData.streetAddress}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="city" className="form-label">City</label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            className="form-control"
                            placeholder="Ho Chi Minh City"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="country" className="form-label">Country</label>
                          <select
                            id="country"
                            name="country"
                            className="form-select"
                            value={formData.country}
                            onChange={handleChange}
                          >
                            <option value="">Select Country</option>
                            <option value="VN">Vietnam</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                            <option value="SG">Singapore</option>
                            <option value="MY">Malaysia</option>
                            <option value="TH">Thailand</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleCancel}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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

              {/* Change Password Section */}
              <div className="card shadow-sm mt-4" data-aos="fade-up">
                <div className="card-body p-4 p-md-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h5 className="mb-1 section-title">Change Password</h5>
                      <p className="text-muted mb-0 small">Update your account password</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setShowChangePassword(!showChangePassword)}
                    >
                      <i className={`fas ${showChangePassword ? 'fa-chevron-up' : 'fa-chevron-down'} me-2`}></i>
                      {showChangePassword ? 'Hide' : 'Change Password'}
                    </button>
                  </div>

                  {showChangePassword && (
                    <form onSubmit={handlePasswordSubmit} noValidate>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label htmlFor="currentPassword" className="form-label">Current Password *</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="fas fa-lock"></i>
                            </span>
                            <input
                              type={showPasswords.current ? 'text' : 'password'}
                              id="currentPassword"
                              name="currentPassword"
                              className={`form-control ${passwordErrors.currentPassword ? 'is-invalid' : ''}`}
                              placeholder="Enter your current password"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                            >
                              <i className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                          </div>
                          {passwordErrors.currentPassword && (
                            <div className="invalid-feedback d-block">
                              <i className="fas fa-exclamation-circle me-1"></i>{passwordErrors.currentPassword}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="newPassword" className="form-label">New Password *</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="fas fa-lock"></i>
                            </span>
                            <input
                              type={showPasswords.new ? 'text' : 'password'}
                              id="newPassword"
                              name="newPassword"
                              className={`form-control ${passwordErrors.newPassword ? 'is-invalid' : ''}`}
                              placeholder="Enter new password (min 6 characters)"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            >
                              <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                          </div>
                          {passwordErrors.newPassword ? (
                            <div className="invalid-feedback d-block">
                              <i className="fas fa-exclamation-circle me-1"></i>{passwordErrors.newPassword}
                            </div>
                          ) : (
                            <div className="form-text">Password must be at least 6 characters</div>
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="confirmPassword" className="form-label">Confirm New Password *</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="fas fa-lock"></i>
                            </span>
                            <input
                              type={showPasswords.confirm ? 'text' : 'password'}
                              id="confirmPassword"
                              name="confirmPassword"
                              className={`form-control ${passwordErrors.confirmPassword ? 'is-invalid' : ''}`}
                              placeholder="Confirm new password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            >
                              <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                          </div>
                          {passwordErrors.confirmPassword && (
                            <div className="invalid-feedback d-block">
                              <i className="fas fa-exclamation-circle me-1"></i>{passwordErrors.confirmPassword}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="d-flex gap-2 justify-content-end mt-3">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setShowChangePassword(false);
                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            setPasswordErrors({});
                          }}
                          disabled={isChangingPassword}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isChangingPassword}
                        >
                          {isChangingPassword ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
