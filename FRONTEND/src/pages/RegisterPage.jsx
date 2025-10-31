import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();


  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

 
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'fullName':
        if (!value || value.trim() === '') {
          error = 'Full name is required';
        }
        break;
      case 'username':
        if (!value || value.trim() === '') {
          error = 'Username is required';
        } else if (value.trim().length < 3) {
          error = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) {
          error = 'Username can only contain letters, numbers, and underscores';
        }
        break;
      case 'email':
        if (!value || value.trim() === '') {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
    // Clear error when user checks
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key !== 'phone' && key !== 'address') { // Phone and address are optional
        if (key === 'terms') {
          // Special validation for checkbox
          if (!formData[key]) {
            newErrors[key] = 'You must agree to the Terms of Service and Privacy Policy';
            isValid = false;
          }
        } else {
          const error = validateField(key, formData[key]);
          if (error) {
            newErrors[key] = error;
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);

    // Scroll to first error field
    if (!isValid) {
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
    }

    return isValid;
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); // Quan trọng: ngăn form tự submit và reload trang

    // Bước 1: Validate form trước
    if (!validateForm()) {
      return; // Nếu validate fail thì dừng, không gọi API
    }

    // Bước 2: Set loading = true (đang xử lý)
    setIsLoading(true);

    try {
      // Bước 3: Chuẩn bị data gửi lên server
      const userData = {
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone?.trim() || null,
        address: formData.address?.trim() || null
      };

      // Bước 4: Gọi API register
      // register() trả về Promise (có thể thành công hoặc thất bại)
      const result = await register(userData);

      // ===== TOAST ALERTS =====
      if (result.success) {
        toast.success(
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>🎉</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#065f46' }}>
                Registration Successful!
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {result.message || 'Your account has been created successfully. Redirecting to login...'}
              </div>
            </div>
          </div>,
          {
            autoClose: 750,
            onClose: () => {
              navigate('/login');
            }
          }
        );
        // Redirect after toast closes
        setTimeout(() => {
          navigate('/login');
        }, 750);
      } else {
        toast.error(
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>❌</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#991b1b' }}>
                Registration Failed
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {result.message || 'Something went wrong. Please try again.'}
              </div>
            </div>
          </div>,
          {
            autoClose: 750
          }
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
        {
          autoClose: 750
        }
      );
    } finally {
      // Bước 6: Luôn chạy dù thành công hay thất bại
      // Tắt loading state
      setIsLoading(false);
    }
  };

  // ===== UI RENDERING =====
  return (
    <>
      {/* Hero Section */}
      <section className="py-5 bg-primary text-white" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-3">Join Give-AID Community</h1>
              <p className="lead mb-0">
                Create your account to start making a difference in the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="registration-form-container" data-aos="fade-up">
                <div className="form-header text-center mb-4">
                  <h3 className="fw-bold mb-3">Create Your Account</h3>
                  <p className="text-muted">Please provide the required information</p>
                </div>

                <form onSubmit={handleSubmit} className="registration-form" noValidate>
                  {/* Personal Information */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Personal Information</h5>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <label htmlFor="fullName" className="form-label">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          id="fullName"
                          className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.fullName && (
                          <div className="invalid-feedback d-block">
                            <i className="fas fa-exclamation-circle me-1"></i>{errors.fullName}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="username" className="form-label">Username *</label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                          placeholder="Choose a username (min 3 characters)"
                          value={formData.username}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.username ? (
                          <div className="invalid-feedback d-block">
                            <i className="fas fa-exclamation-circle me-1"></i>{errors.username}
                          </div>
                        ) : (
                          <div className="form-text">Username must be at least 3 characters</div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.email && (
                          <div className="invalid-feedback d-block">
                            <i className="fas fa-exclamation-circle me-1"></i>{errors.email}
                          </div>
                        )}
                      </div>
                      <div className="col-12 mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          className="form-control"
                          placeholder="Enter your phone number (optional)"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Address</h5>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          className="form-control"
                          placeholder="e.g., 123 ABC Street, District 1, HCMC"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Account Security</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="form-label">Password *</label>
                        <div className="input-group">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                          </button>
                        </div>
                        {errors.password ? (
                          <div className="invalid-feedback d-block">
                            <i className="fas fa-exclamation-circle me-1"></i>{errors.password}
                          </div>
                        ) : (
                          <div className="form-text">Password must be at least 6 characters</div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                        <div className="input-group">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            id="confirmPassword"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <div className="invalid-feedback d-block">
                            <i className="fas fa-exclamation-circle me-1"></i>{errors.confirmPassword}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Terms & Submit */}
                  <div className="form-section mb-3">
                    <div className="form-check">
                      <input 
                        className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                        type="checkbox" 
                        name="terms" 
                        id="terms"
                        checked={formData.terms}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a> *
                      </label>
                    </div>
                    {errors.terms && (
                      <div className="invalid-feedback d-block">
                        <i className="fas fa-exclamation-circle me-1"></i>{errors.terms}
                      </div>
                    )}
                  </div>

                  <div className="form-section text-center">
                    {/* ===== GIẢI THÍCH: disabled={isLoading} =====
                        Khi đang loading (isLoading = true) thì disable button
                        Không cho user click nhiều lần, tránh gửi request trùng lặp */}
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-5"
                      disabled={isLoading}
                    >
                      {/* ===== GIẢI THÍCH: Hiển thị spinner khi loading =====
                          Nếu đang loading thì show spinner, không thì show text bình thường */}
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>Create Account
                        </>
                      )}
                    </button>
                    <p className="text-muted mt-3">
                      Already have an account? <Link to="/login" className="text-primary">Sign in here</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

