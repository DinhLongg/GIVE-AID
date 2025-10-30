import { Link } from 'react-router-dom';

export default function RegisterPage() {
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

      {/* Registration Form (Simplified to match backend) */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="registration-form-container" data-aos="fade-up">
                <div className="form-header text-center mb-4">
                  <h3 className="fw-bold mb-3">Create Your Account</h3>
                  <p className="text-muted">Please provide the required information</p>
                </div>

                <form id="registrationForm" className="registration-form">
                  {/* Full Name */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Personal Information</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label">First Name *</label>
                        <input type="text" name="firstName" id="firstName" className="form-control" required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name *</label>
                        <input type="text" name="lastName" id="lastName" className="form-control" required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email Address *</label>
                        <input type="email" name="email" id="email" className="form-control" required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input type="tel" name="phone" id="phone" className="form-control" />
                      </div>
                    </div>
                  </div>

                  {/* Address (single line to match backend) */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Address</h5>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" name="address" id="address" className="form-control" placeholder="e.g., 123 ABC Street, District 1, HCMC" />
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
                          <input type="password" name="password" id="password" className="form-control" required />
                          <button className="btn btn-outline-secondary" type="button" id="togglePassword">
                            <i className="fas fa-eye"></i>
                          </button>
                        </div>
                        <div className="form-text">Password must be at least 6 characters</div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                        <input type="password" name="confirmPassword" id="confirmPassword" className="form-control" required />
                      </div>
                    </div>
                  </div>

                  {/* Terms & Submit */}
                  <div className="form-section mb-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="terms" id="terms" required />
                      <label className="form-check-label" htmlFor="terms">
                        I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a> *
                      </label>
                    </div>
                  </div>

                  <div className="form-section text-center">
                    <button type="submit" className="btn btn-primary btn-lg px-5">
                      <i className="fas fa-user-plus me-2"></i>Create Account
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

