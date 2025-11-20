import PageBanner from "../components/PageBanner";

export default function HelpPage() {
  return (
    <>
      {/* Hero Section */}
      <PageBanner
        title="Help Centre"
        subtitle="Find answers to your questions and get the support you need."
        eyebrowText="Support"
      />

      {/* Search Section */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="help-search text-center" data-aos="fade-up">
                <h5 className="mb-3">Search for Help</h5>
                <div className="search-box">
                  <div className="input-group">
                    <input type="text" className="form-control form-control-lg" placeholder="Search for help topics, questions, or issues..." id="helpSearch" />
                    <button className="btn btn-primary btn-lg" type="button">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
                <div className="search-suggestions mt-3">
                  <span className="text-muted">Popular searches:</span>
                  <a href="#donation-help" className="badge bg-light text-dark me-2">How to donate</a>
                  <a href="#account-help" className="badge bg-light text-dark me-2">Account issues</a>
                  <a href="#payment-help" className="badge bg-light text-dark me-2">Payment problems</a>
                  <a href="#program-help" className="badge bg-light text-dark">Program information</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-3">Quick Help Categories</h2>
              <p className="lead text-muted">
                Choose a category to find relevant help articles and guides.
              </p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
              <div className="help-category-card text-center h-100">
                <div className="category-icon">
                  <i className="fas fa-heart text-primary"></i>
                </div>
                <h5 className="category-title">Donations</h5>
                <p className="category-description">
                  Learn how to make donations, track your contributions, and manage your giving.
                </p>
                <a href="#donation-help" className="btn btn-outline-primary">View Articles</a>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
              <div className="help-category-card text-center h-100">
                <div className="category-icon">
                  <i className="fas fa-user text-primary"></i>
                </div>
                <h5 className="category-title">Account & Profile</h5>
                <p className="category-description">
                  Manage your account, update profile information, and resolve login issues.
                </p>
                <a href="#account-help" className="btn btn-outline-primary">View Articles</a>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="300">
              <div className="help-category-card text-center h-100">
                <div className="category-icon">
                  <i className="fas fa-credit-card text-primary"></i>
                </div>
                <h5 className="category-title">Payment & Billing</h5>
                <p className="category-description">
                  Payment methods, billing questions, and transaction-related support.
                </p>
                <a href="#payment-help" className="btn btn-outline-primary">View Articles</a>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="400">
              <div className="help-category-card text-center h-100">
                <div className="category-icon">
                  <i className="fas fa-hands-helping text-primary"></i>
                </div>
                <h5 className="category-title">Programs & Impact</h5>
                <p className="category-description">
                  Information about our programs, tracking impact, and getting involved.
                </p>
                <a href="#program-help" className="btn btn-outline-primary">View Articles</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5 bg-light" id="faq">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-3">Frequently Asked Questions</h2>
              <p className="lead text-muted">
                Quick answers to common questions about Give-AID.
              </p>
            </div>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="accordion" id="faqAccordion">
                {/* Donation FAQs */}
                <div className="accordion-item" data-aos="fade-up" data-aos-delay="100">
                  <h2 className="accordion-header" id="faq1">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true">
                      How do I make a donation?
                    </button>
                  </h2>
                  <div id="collapse1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      To make a donation, simply click on the "Donate Now" button, select your preferred program, choose an amount, and complete the secure payment form. You'll receive a confirmation email with your donation receipt.
                    </div>
                  </div>
                </div>

                <div className="accordion-item" data-aos="fade-up" data-aos-delay="200">
                  <h2 className="accordion-header" id="faq2">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                      Is my donation tax-deductible?
                    </button>
                  </h2>
                  <div id="collapse2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Yes, Give-AID is a registered non-profit organization, and all donations are tax-deductible. You'll receive a tax receipt via email after completing your donation.
                    </div>
                  </div>
                </div>

                <div className="accordion-item" data-aos="fade-up" data-aos-delay="300">
                  <h2 className="accordion-header" id="faq3">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
                      Can I set up a recurring donation?
                    </button>
                  </h2>
                  <div id="collapse3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Yes! When making a donation, you can choose to set up a recurring monthly, quarterly, or annual donation. You can modify or cancel your recurring donation at any time from your account dashboard.
                    </div>
                  </div>
                </div>

                <div className="accordion-item" data-aos="fade-up" data-aos-delay="400">
                  <h2 className="accordion-header" id="faq4">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4">
                      How can I track the impact of my donation?
                    </button>
                  </h2>
                  <div id="collapse4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      After making a donation, you can view impact reports and updates in your account dashboard. We also send regular email updates about the programs you've supported.
                    </div>
                  </div>
                </div>

                <div className="accordion-item" data-aos="fade-up" data-aos-delay="500">
                  <h2 className="accordion-header" id="faq5">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5">
                      What payment methods do you accept?
                    </button>
                  </h2>
                  <div id="collapse5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and bank transfers. All payments are processed securely through our encrypted payment gateway.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="contact-support-card" data-aos="fade-up">
                <div className="text-center mb-4">
                  <i className="fas fa-headset text-primary" style={{ fontSize: '3rem' }}></i>
                  <h3 className="fw-bold mt-3">Still Need Help?</h3>
                  <p className="text-muted">Our support team is here to assist you</p>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="support-option text-center p-4">
                      <i className="fas fa-envelope text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                      <h5>Email Support</h5>
                      <p className="text-muted">support@giveaid.org</p>
                      <p className="small">Response within 24 hours</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="support-option text-center p-4">
                      <i className="fas fa-phone text-primary mb-3" style={{ fontSize: '2rem' }}></i>
                      <h5>Phone Support</h5>
                      <p className="text-muted">+84 123 456 789</p>
                      <p className="small">Mon-Fri: 9AM - 6PM</p>
                    </div>
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

