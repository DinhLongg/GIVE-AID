export default function DonatePage() {
    return (
        <>
      {/* Hero Section */}
      <section className="py-5 bg-primary text-white" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-3">Donate for a Better Future</h1>
              <p className="lead mb-0">
                Every donation you make will create a difference in the lives of those in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Categories */}
      <section id="categories" className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-3">Choose the Program You Want to Support</h2>
              <p className="lead text-muted">
                All donations are used transparently and effectively.
              </p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
              <div className="category-card h-100" data-category="education">
                <div className="category-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h5 className="category-title">Children Education</h5>
                <p className="category-description">
                  Supporting school fees, books, and learning materials for children in difficult circumstances.
                </p>
                <div className="category-stats">
                  <span className="amount-raised">$15,000</span>
                  <span className="progress-text">75% Complete</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
              <div className="category-card h-100" data-category="healthcare">
                <div className="category-icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <h5 className="category-title">Healthcare Support</h5>
                <p className="category-description">
                  Providing free medical services and medicines for the poor and disabled.
                </p>
                <div className="category-stats">
                  <span className="amount-raised">$12,000</span>
                  <span className="progress-text">60% Complete</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="300">
              <div className="category-card h-100" data-category="women">
                <div className="category-icon">
                  <i className="fas fa-female"></i>
                </div>
                <h5 className="category-title">Women Empowerment</h5>
                <p className="category-description">
                  Supporting women in developing professional skills and starting businesses.
                </p>
                <div className="category-stats">
                  <span className="amount-raised">$9,000</span>
                  <span className="progress-text">45% Complete</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="400">
              <div className="category-card h-100" data-category="children">
                <div className="category-icon">
                  <i className="fas fa-child"></i>
                </div>
                <h5 className="category-title">Child Protection</h5>
                <p className="category-description">
                  Protecting and caring for children in particularly difficult circumstances.
                </p>
                <div className="category-stats">
                  <span className="amount-raised">$8,500</span>
                  <span className="progress-text">42% Complete</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: '42%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="500">
              <div className="category-card h-100" data-category="elderly">
                <div className="category-icon">
                  <i className="fas fa-user-friends"></i>
                </div>
                <h5 className="category-title">Elderly Care</h5>
                <p className="category-description">
                  Supporting healthcare and daily activities for lonely elderly people.
                </p>
                <div className="category-stats">
                  <span className="amount-raised">$6,000</span>
                  <span className="progress-text">30% Complete</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="600">
              <div className="category-card h-100" data-category="disabled">
                <div className="category-icon">
                  <i className="fas fa-wheelchair"></i>
                </div>
                <h5 className="category-title">Disability Support</h5>
                <p className="category-description">
                  Providing assistive devices and vocational training for people with disabilities.
                </p>
                <div className="category-stats">
                  <span className="amount-raised">$5,500</span>
                  <span className="progress-text">28% Complete</span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: '28%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="donation-form-container" data-aos="fade-up">
                <div className="form-header text-center mb-4">
                  <h3 className="fw-bold mb-3">Donation Information</h3>
                  <p className="text-muted">Please fill in all information to complete your donation</p>
                </div>
                
                <form id="donationForm" className="donation-form">
                  {/* Donation Amount */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Donation Amount</h5>
                    <div className="amount-options">
                      <div className="row">
                        <div className="col-md-3 col-6 mb-3">
                          <input type="radio" name="amount" value="50" id="amount-50" className="amount-radio" />
                          <label htmlFor="amount-50" className="amount-option">
                            <span className="amount">$50</span>
                            <span className="currency">USD</span>
                          </label>
                        </div>
                        <div className="col-md-3 col-6 mb-3">
                          <input type="radio" name="amount" value="100" id="amount-100" className="amount-radio" />
                          <label htmlFor="amount-100" className="amount-option">
                            <span className="amount">$100</span>
                            <span className="currency">USD</span>
                          </label>
                        </div>
                        <div className="col-md-3 col-6 mb-3">
                          <input type="radio" name="amount" value="200" id="amount-200" className="amount-radio" />
                          <label htmlFor="amount-200" className="amount-option">
                            <span className="amount">$200</span>
                            <span className="currency">USD</span>
                          </label>
                        </div>
                        <div className="col-md-3 col-6 mb-3">
                          <input type="radio" name="amount" value="500" id="amount-500" className="amount-radio" />
                          <label htmlFor="amount-500" className="amount-option">
                            <span className="amount">$500</span>
                            <span className="currency">USD</span>
                          </label>
                        </div>
                      </div>
                      <div className="custom-amount mt-3">
                        <div className="input-group">
                          <span className="input-group-text">USD</span>
                          <input type="number" name="customAmount" id="customAmount" className="form-control" placeholder="Enter other amount" min="10" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Selection */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Choose Program</h5>
                    <select name="category" id="category" className="form-select" required>
                      <option value="">-- Select Program --</option>
                      <option value="education">Children Education</option>
                      <option value="healthcare">Healthcare Support</option>
                      <option value="women">Women Empowerment</option>
                      <option value="children">Child Protection</option>
                      <option value="elderly">Elderly Care</option>
                      <option value="disabled">Disability Support</option>
                    </select>
                  </div>
                  
                  {/* Personal Information */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Personal Information</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="fullName" className="form-label">Full Name *</label>
                        <input type="text" name="fullName" id="fullName" className="form-control" required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input type="email" name="email" id="email" className="form-control" required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input type="tel" name="phone" id="phone" className="form-control" />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" name="address" id="address" className="form-control" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Information */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Payment Information</h5>
                    <div className="payment-methods mb-3">
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="paymentMethod" id="creditCard" value="credit" defaultChecked />
                        <label className="form-check-label" htmlFor="creditCard">
                          <i className="fas fa-credit-card me-2"></i>Credit Card
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="paymentMethod" id="debitCard" value="debit" />
                        <label className="form-check-label" htmlFor="debitCard">
                          <i className="fas fa-credit-card me-2"></i>Debit Card
                        </label>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-12 mb-3">
                        <label htmlFor="cardNumber" className="form-label">Card Number *</label>
                        <div className="input-group">
                          <input type="text" name="cardNumber" id="cardNumber" className="form-control" placeholder="1234 5678 9012 3456" maxLength="19" required />
                          <span className="input-group-text card-type-icon">
                            <i className="fas fa-credit-card text-muted"></i>
                          </span>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="expiryMonth" className="form-label">Expiry Month *</label>
                        <select name="expiryMonth" id="expiryMonth" className="form-select" required>
                          <option value="">Month</option>
                          <option value="01">01</option>
                          <option value="02">02</option>
                          <option value="03">03</option>
                          <option value="04">04</option>
                          <option value="05">05</option>
                          <option value="06">06</option>
                          <option value="07">07</option>
                          <option value="08">08</option>
                          <option value="09">09</option>
                          <option value="10">10</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="expiryYear" className="form-label">Expiry Year *</label>
                        <select name="expiryYear" id="expiryYear" className="form-select" required>
                          <option value="">Year</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                          <option value="2029">2029</option>
                          <option value="2030">2030</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="cvv" className="form-label">CVV *</label>
                        <input type="text" name="cvv" id="cvv" className="form-control" placeholder="123" maxLength="4" required />
                      </div>
                    </div>
                    
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" name="saveCard" id="saveCard" />
                      <label className="form-check-label" htmlFor="saveCard">
                        Save card information for faster donations next time
                      </label>
                    </div>
                  </div>
                  
                  {/* Additional Options */}
                  <div className="form-section mb-4">
                    <h5 className="section-title">Additional Options</h5>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" name="anonymous" id="anonymous" />
                      <label className="form-check-label" htmlFor="anonymous">
                        Anonymous donation
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" name="newsletter" id="newsletter" defaultChecked />
                      <label className="form-check-label" htmlFor="newsletter">
                        Receive email updates about programs
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" name="inviteFriends" id="inviteFriends" />
                      <label className="form-check-label" htmlFor="inviteFriends">
                        Send email invitation to friends
                      </label>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="form-section text-center">
                    <button type="submit" className="btn btn-primary btn-lg px-5">
                      <i className="fas fa-heart me-2"></i>Donate Now
                    </button>
                    <p className="text-muted mt-3 small">
                      <i className="fas fa-lock me-1"></i>
                      Payment information is encrypted and secure
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
