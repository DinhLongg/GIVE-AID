import { Link } from 'react-router-dom';

export default function LoginPage() {
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
                
                <form id="loginForm" className="login-form">
                  {/* Login Credentials */}
                  <div className="form-section mb-4">
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username or Email *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-user"></i>
                        </span>
                        <input type="text" name="username" id="username" className="form-control" placeholder="Enter your username or email" required />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-lock"></i>
                        </span>
                        <input type="password" name="password" id="password" className="form-control" placeholder="Enter your password" required />
                        <button className="btn btn-outline-secondary" type="button" id="togglePassword">
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="rememberMe" id="rememberMe" />
                        <label className="form-check-label" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      <a href="#" className="text-primary text-decoration-none" id="forgotPasswordLink">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="form-section text-center mb-4">
                    <button type="submit" className="btn btn-primary btn-lg w-100">
                      <i className="fas fa-sign-in-alt me-2"></i>Sign In
                    </button>
                  </div>
                  
                  {/* Social Login */}
                  <div className="form-section mb-4">
                    <div className="text-center mb-3">
                      <span className="text-muted">Or sign in with</span>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <button type="button" className="btn btn-outline-danger w-100" id="googleLogin">
                          <i className="fab fa-google me-2"></i>Google
                        </button>
                      </div>
                      <div className="col-6">
                        <button type="button" className="btn btn-outline-primary w-100" id="facebookLogin">
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

