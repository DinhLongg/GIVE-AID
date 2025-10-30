export default function ProfilePage() {
  return (
    <>
      <section className="py-5" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-4">
                <h1 className="fw-bold">Profile</h1>
                <p className="text-muted">Cập nhật thông tin cá nhân của bạn. (Hiện chưa kết nối API)</p>
              </div>

              <div className="card shadow-sm" data-aos="fade-up">
                <div className="card-body p-4 p-md-5">
                  <form>
                    {/* Basic Information */}
                    <div className="mb-4">
                      <h5 className="mb-3">Basic Information</h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="fullName" className="form-label">Full Name</label>
                          <input type="text" id="fullName" className="form-control" placeholder="John Doe" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input type="email" id="email" className="form-control" placeholder="john@example.com" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="phone" className="form-label">Phone</label>
                          <input type="tel" id="phone" className="form-control" placeholder="+84 123 456 789" />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                          <input type="date" id="dateOfBirth" className="form-control" />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label htmlFor="gender" className="form-label">Gender</label>
                          <select id="gender" className="form-select">
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
                      <h5 className="mb-3">Address</h5>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label htmlFor="address" className="form-label">Street Address</label>
                          <input type="text" id="address" className="form-control" placeholder="123 ABC Street" />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="city" className="form-label">City</label>
                          <input type="text" id="city" className="form-control" placeholder="Ho Chi Minh City" />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                          <label htmlFor="country" className="form-label">Country</label>
                          <select id="country" className="form-select">
                            <option value="">Select Country</option>
                            <option value="VN">Vietnam</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Professional */}
                    <div className="mb-4">
                      <h5 className="mb-3">Professional</h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="profession" className="form-label">Profession</label>
                          <input type="text" id="profession" className="form-control" placeholder="Teacher, Engineer..." />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="company" className="form-label">Company/Organization</label>
                          <input type="text" id="company" className="form-control" placeholder="Company Name" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="workPhone" className="form-label">Work Phone</label>
                          <input type="tel" id="workPhone" className="form-control" placeholder="+84 ..." />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="workEmail" className="form-label">Work Email</label>
                          <input type="email" id="workEmail" className="form-control" placeholder="you@company.com" />
                        </div>
                      </div>
                    </div>

                    

                    {/* Actions */}
                    <div className="d-flex gap-2 justify-content-end">
                      <button type="button" className="btn btn-outline-secondary">Cancel</button>
                      <button type="button" className="btn btn-primary">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


