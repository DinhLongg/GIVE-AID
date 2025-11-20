import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { verifyEmail, resendVerificationEmail } from '../services/authServices';
import { toast } from 'react-toastify';
import PageBanner from "../components/PageBanner";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  // Auto-verify if token exists in URL
  useEffect(() => {
    if (token) {
      // Decode token from URL
      const decodedToken = decodeURIComponent(token);
      console.log('[Debug] Token from URL:', token);
      console.log('[Debug] Decoded token:', decodedToken);
      handleVerify(decodedToken);
    }
  }, [token]);

  const handleVerify = async (verificationToken) => {
    if (!verificationToken) {
      setVerificationError('No verification token provided');
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);

    try {
      const result = await verifyEmail(verificationToken);

      // ===== TOAST ALERTS =====
      if (result.success) {
        setIsVerified(true);
        toast.success(
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>✅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#065f46' }}>
                Email Verified!
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {result.message || 'Your email has been verified successfully. You can now login.'}
              </div>
            </div>
          </div>,
          {
            autoClose: 3000,
            onClose: () => {
              navigate('/login');
            }
          }
        );
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setVerificationError(result.message || 'Failed to verify email');
        toast.error(
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>❌</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#991b1b' }}>
                Verification Failed
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {result.message || 'Invalid or expired verification token.'}
              </div>
            </div>
          </div>,
          { autoClose: 4000 }
        );
      }
    } catch (error) {
      setVerificationError('An error occurred while verifying your email');
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
        { autoClose: 5000 }
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();

    if (!email || !email.trim()) {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>❌</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#991b1b' }}>
              Email Required
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Please enter your email address
            </div>
          </div>
        </div>,
        { autoClose: 2000 }
      );
      return;
    }

    setIsResending(true);

    try {
      const result = await resendVerificationEmail(email.trim());

      // ===== TOAST ALERTS =====
      if (result.success) {
        toast.success(
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>📧</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#065f46' }}>
                Email Sent!
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {result.message || 'Verification email has been sent. Please check your inbox.'}
              </div>
            </div>
          </div>,
          { autoClose: 3000 }
        );
        setEmail('');
      } else {
        toast.error(
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px', marginRight: '12px', lineHeight: '1.2' }}>❌</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px', color: '#991b1b' }}>
                Failed to Send Email
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {result.message || 'Failed to resend verification email. Please try again.'}
              </div>
            </div>
          </div>,
          { autoClose: 4000 }
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
        { autoClose: 5000 }
      );
    } finally {
      setIsResending(false);
    }
  };

  // ===== UI RENDERING =====
  return (
    <>
      {/* Hero Section */}
      <PageBanner
        title="Verify Your Email"
        subtitle="Please verify your email address to complete your registration."
        eyebrowText="Account Security"
        accent="sunset"
      />

      {/* Verification Content */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="card shadow-sm" data-aos="fade-up">
                <div className="card-body p-4 p-md-5">
                  {isVerifying ? (
                    // Loading State
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <h5 className="fw-bold">Verifying your email...</h5>
                      <p className="text-muted">Please wait while we verify your email address</p>
                    </div>
                  ) : isVerified ? (
                    // Success State
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <i className="fas fa-check-circle text-success" style={{ fontSize: '80px' }}></i>
                      </div>
                      <h3 className="fw-bold mb-3 text-success">Email Verified!</h3>
                      <p className="text-muted mb-4">
                        Your email has been verified successfully. You can now login to your account.
                      </p>
                      <Link to="/login" className="btn btn-primary btn-lg">
                        <i className="fas fa-sign-in-alt me-2"></i>Go to Login
                      </Link>
                    </div>
                  ) : verificationError ? (
                    // Error State
                    <div className="text-center py-4">
                      <div className="mb-4">
                        <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: '80px' }}></i>
                      </div>
                      <h3 className="fw-bold mb-3 text-danger">Verification Failed</h3>
                      <p className="text-muted mb-4">
                        {verificationError}
                      </p>
                      
                      {/* Resend Verification Form */}
                      <div className="mt-4 p-4 bg-light rounded">
                        <h5 className="fw-bold mb-3">Resend Verification Email</h5>
                        <p className="text-muted small mb-3">
                          Enter your email address to receive a new verification link
                        </p>
                        <form onSubmit={handleResendVerification}>
                          <div className="mb-3">
                            <label htmlFor="resendEmail" className="form-label">Email Address</label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="fas fa-envelope"></i>
                              </span>
                              <input
                                type="email"
                                id="resendEmail"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isResending}
                          >
                            {isResending ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Sending...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-paper-plane me-2"></i>Resend Verification Email
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    // No Token State
                    <div className="text-center py-4">
                      <div className="mb-4">
                        <i className="fas fa-envelope text-primary" style={{ fontSize: '80px' }}></i>
                      </div>
                      <h3 className="fw-bold mb-3">Check Your Email</h3>
                      <p className="text-muted mb-4">
                        We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
                      </p>
                      <p className="text-muted small mb-4">
                        <i className="fas fa-info-circle me-2"></i>
                        The verification link will expire in 24 hours.
                      </p>

                      {/* Manual Token Input */}
                      <div className="mt-4 p-4 bg-light rounded">
                        <h5 className="fw-bold mb-3">Enter Verification Token</h5>
                        <p className="text-muted small mb-3">
                          If you received a token in your email, enter it below
                        </p>
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <i className="fas fa-key"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter verification token"
                            id="manualToken"
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          onClick={() => {
                            const tokenInput = document.getElementById('manualToken');
                            if (tokenInput && tokenInput.value.trim()) {
                              handleVerify(tokenInput.value.trim());
                            }
                          }}
                        >
                          <i className="fas fa-check me-2"></i>Verify Token
                        </button>
                      </div>

                      {/* Resend Verification Form */}
                      <div className="mt-4 p-4 bg-light rounded">
                        <h5 className="fw-bold mb-3">Didn't receive the email?</h5>
                        <p className="text-muted small mb-3">
                          Enter your email address to receive a new verification link
                        </p>
                        <form onSubmit={handleResendVerification}>
                          <div className="mb-3">
                            <label htmlFor="resendEmail" className="form-label">Email Address</label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="fas fa-envelope"></i>
                              </span>
                              <input
                                type="email"
                                id="resendEmail"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-outline-primary w-100"
                            disabled={isResending}
                          >
                            {isResending ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Sending...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-paper-plane me-2"></i>Resend Verification Email
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Back to Login Link */}
                  <div className="text-center mt-4">
                    <p className="text-muted">
                      Already verified? <Link to="/login" className="text-primary">Go to Login</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

