import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { resendVerificationEmail } from '../services/authServices';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      case 'usernameOrEmail':
        if (!value || value.trim() === '') {
          error = 'Username or email is required';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        }
        break;
      default:
        break;
    }
    
    return error;
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

    setIsLoading(true);

    try {
      const result = await login(formData.usernameOrEmail.trim(), formData.password);

      // ===== TOAST ALERTS =====
      if (result.success) {
        toast.success(result.message || 'Login successful! Welcome back!', {
          autoClose: 750,
          onClose: () => {
            navigate('/');
          }
        });
        // Redirect after toast closes
        setTimeout(() => {
          navigate('/');
        }, 750);
      } else {
        const errorMessage = result.message || 'Invalid username/email or password. Please try again.';
        const isEmailNotVerified = errorMessage.toLowerCase().includes('verify') || 
                                   (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('verify'));
        const isInvalidCredentials = errorMessage.toLowerCase().includes('invalid') || 
                                     errorMessage.toLowerCase().includes('password');
        
        // Set inline errors for username/email or password fields
        const newErrors = { ...errors };
        
        if (isInvalidCredentials && !isEmailNotVerified) {
          // Invalid credentials - show on both fields
          newErrors.usernameOrEmail = 'Invalid username/email or password';
          newErrors.password = 'Invalid username/email or password';
        }
        
        setErrors(newErrors);
        
        // Scroll to first error field
        setTimeout(() => {
          const firstErrorField = Object.keys(newErrors).find(key => newErrors[key]);
          if (firstErrorField) {
            const element = document.getElementById(firstErrorField);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.focus();
            }
          }
        }, 100);
        
        // Show toast with inline error reference
        const toastMessage = isInvalidCredentials && !isEmailNotVerified 
          ? 'Please check the highlighted fields below' 
          : errorMessage;
        
        toast.error(toastMessage, {
          autoClose: isEmailNotVerified ? 6000 : 3000
        });

        // Handle resend verification email separately if needed
        if (isEmailNotVerified) {
          // Show info toast with link to verify email page
          setTimeout(() => {
            toast.info('Please verify your email. Go to Verify Email page to resend verification email.', {
              autoClose: 5000
            });
          }, 1000);
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

  // ===== UI RENDERING =====
  return (
    <>
      {/* Hero Section */}
      <section className="py-5 bg-primary text-white" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-3">Welcome Back</h1>
              <p className="lead mb-0">
                Sign in to your account to continue making a difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Form */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="login-form-container" data-aos="fade-up">
                <div className="form-header text-center mb-4">
                  <h3 className="fw-bold mb-3">Sign In</h3>
                  <p className="text-muted">Enter your credentials to access your account</p>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form" noValidate>
                  {/* Login Credentials */}
                  <div className="form-section mb-4">
                    <div className="mb-3">
                      <label htmlFor="usernameOrEmail" className="form-label">Username or Email *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-user"></i>
                        </span>
                        <input
                          type="text"
                          name="usernameOrEmail"
                          id="usernameOrEmail"
                          className={`form-control ${errors.usernameOrEmail ? 'is-invalid' : ''}`}
                          placeholder="Enter your username or email"
                          value={formData.usernameOrEmail}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      {errors.usernameOrEmail && (
                        <div className="invalid-feedback d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>{errors.usernameOrEmail}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-lock"></i>
                        </span>
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
                      {errors.password && (
                        <div className="invalid-feedback d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>{errors.password}
                        </div>
                      )}
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="rememberMe" id="rememberMe" />
                        <label className="form-check-label" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <a href="#" className="text-primary text-decoration-none">
                        Forgot password?
                      </a>
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
                          Signing In...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>Sign In
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Social Login */}
                  <div className="form-section mb-4">
                    <div className="text-center mb-3">
                      <span className="text-muted">Or sign in with</span>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <button type="button" className="btn btn-outline-danger w-100">
                          <i className="fab fa-google me-2"></i>Google
                        </button>
                      </div>
                      <div className="col-6">
                        <button type="button" className="btn btn-outline-primary w-100">
                          <i className="fab fa-facebook-f me-2"></i>Facebook
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Register Link */}
                  <div className="form-section text-center">
                    <p className="text-muted">
                      Don't have an account? <Link to="/register" className="text-primary">Create one here</Link>
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

