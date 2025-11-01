import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/authServices';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({
        ...errors,
        email: ''
      });
    }
  };

  const handleBlur = () => {
    const error = validateEmail(email);
    setErrors({
      ...errors,
      email: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await forgotPassword(email.trim());

      if (result.success) {
        setEmailSent(true);
        toast.success(result.message || 'If the email exists in our system, a password reset link has been sent. Please check your email.', {
          autoClose: 5000
        });
      } else {
        toast.error(result.message || 'Failed to send password reset email. Please try again.', {
          autoClose: 4000
        });
      }
    } catch (error) {
      toast.error('Connection error: Unable to connect to server. Please check your internet connection and try again.', {
        autoClose: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-5 bg-primary text-white" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-3">Reset Your Password</h1>
              <p className="lead mb-0">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Forgot Password Form */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="login-form-container" data-aos="fade-up">
                {!emailSent ? (
                  <>
                    <div className="form-header text-center mb-4">
                      <h3 className="fw-bold mb-3">Forgot Password?</h3>
                      <p className="text-muted">No worries! Enter your email address and we'll send you instructions to reset your password.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="login-form" noValidate>
                      <div className="form-section mb-4">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email Address *</label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="fas fa-envelope"></i>
                            </span>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                              placeholder="Enter your email address"
                              value={email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </div>
                          {errors.email && (
                            <div className="invalid-feedback d-block">
                              <i className="fas fa-exclamation-circle me-1"></i>{errors.email}
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
                              Sending...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-2"></i>Send Reset Link
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mb-4">
                      <i className="fas fa-envelope-circle-check" style={{ fontSize: '64px', color: '#28a745' }}></i>
                    </div>
                    <h3 className="fw-bold mb-3">Check Your Email</h3>
                    <p className="text-muted mb-4">
                      We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <p className="text-muted mb-4">
                      Please check your email inbox (and spam folder) and click on the link to reset your password.
                    </p>
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Note:</strong> The password reset link will expire in 1 hour.
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          setEmailSent(false);
                          setEmail('');
                        }}
                        className="btn btn-outline-primary me-2"
                      >
                        <i className="fas fa-redo me-2"></i>Send Another Email
                      </button>
                      <Link to="/login" className="btn btn-primary">
                        <i className="fas fa-arrow-left me-2"></i>Back to Login
                      </Link>
                    </div>
                  </div>
                )}
                
                {/* Back to Login Link */}
                {!emailSent && (
                  <div className="form-section text-center">
                    <p className="text-muted">
                      Remember your password? <Link to="/login" className="text-primary">Sign in here</Link>
                    </p>
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

