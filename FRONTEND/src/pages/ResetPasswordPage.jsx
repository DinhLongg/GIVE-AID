import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../services/authServices';
import { toast } from 'react-toastify';
import PageBanner from "../components/PageBanner";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'newPassword':
        if (!value) {
          error = 'New password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.newPassword) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

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
    // If confirming password, also check if passwords match
    if (name === 'confirmPassword' || name === 'newPassword') {
      if (formData.newPassword && formData.confirmPassword) {
        const confirmError = validateField('confirmPassword', formData.confirmPassword);
        if (confirmError && name === 'confirmPassword') {
          setErrors({
            ...errors,
            confirmPassword: confirmError
          });
        }
      }
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

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
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
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!token) {
      toast.error('Invalid reset link. Please request a new password reset.', {
        autoClose: 4000
      });
      navigate('/forgot-password');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await resetPassword(token, formData.newPassword, formData.confirmPassword);

      if (result.success) {
        setIsReset(true);
        toast.success(result.message || 'Password has been reset successfully!', {
          autoClose: 3000
        });
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // Parse error message and set inline errors
        const errorMessage = result.message || 'Failed to reset password. Please try again.';
        const newErrors = { ...errors };

        if (errorMessage.toLowerCase().includes('password must be at least')) {
          newErrors.newPassword = 'Password must be at least 6 characters';
        } else if (errorMessage.toLowerCase().includes('passwords do not match')) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('expired')) {
          toast.error(errorMessage, {
            autoClose: 5000
          });
          // Redirect to forgot password page if token is invalid/expired
          setTimeout(() => {
            navigate('/forgot-password');
          }, 3000);
          return;
        } else {
          toast.error(errorMessage, {
            autoClose: 4000
          });
        }

        setErrors(newErrors);

        // Scroll to first error field
        const firstErrorField = Object.keys(newErrors).find(key => newErrors[key]);
        if (firstErrorField) {
          requestAnimationFrame(() => {
            const element = document.getElementById(firstErrorField);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.focus();
            }
          });
        }
      }
    } catch (error) {
      toast.error('Connection error: Unable to connect to server. Please check your internet connection and try again.', {
        autoClose: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if token exists in URL
  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link. Please request a new password reset.', {
        autoClose: 4000
      });
      setTimeout(() => {
        navigate('/forgot-password');
      }, 2000);
    }
  }, [token, navigate]);

  return (
    <>
      {/* Hero Section */}
      <PageBanner
        title="Reset Your Password"
        subtitle="Enter your new password to complete the reset process."
        eyebrowText="Security"
        accent="lavender"
      />

      {/* Reset Password Form */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="login-form-container" data-aos="fade-up">
                {!isReset ? (
                  <>
                    <div className="form-header text-center mb-4">
                      <h3 className="fw-bold mb-3">Create New Password</h3>
                      <p className="text-muted">Please enter your new password below.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="login-form" noValidate>
                      {/* New Password */}
                      <div className="form-section mb-4">
                        <div className="mb-3">
                          <label htmlFor="newPassword" className="form-label">New Password *</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="fas fa-lock"></i>
                            </span>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="newPassword"
                              id="newPassword"
                              className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                              placeholder="Enter your new password"
                              value={formData.newPassword}
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
                          {errors.newPassword ? (
                            <div className="invalid-feedback d-block">
                              <i className="fas fa-exclamation-circle me-1"></i>{errors.newPassword}
                            </div>
                          ) : (
                            <div className="form-text">Password must be at least 6 characters</div>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="confirmPassword" className="form-label">Confirm New Password *</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="fas fa-lock"></i>
                            </span>
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              id="confirmPassword"
                              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                              placeholder="Confirm your new password"
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
                      
                      {/* Submit Button */}
                      <div className="form-section text-center mb-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg w-100"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Resetting Password...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-key me-2"></i>Reset Password
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mb-4">
                      <i className="fas fa-check-circle" style={{ fontSize: '64px', color: '#28a745' }}></i>
                    </div>
                    <h3 className="fw-bold mb-3">Password Reset Successful!</h3>
                    <p className="text-muted mb-4">
                      Your password has been reset successfully. You can now login with your new password.
                    </p>
                    <Link to="/login" className="btn btn-primary">
                      <i className="fas fa-sign-in-alt me-2"></i>Go to Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

