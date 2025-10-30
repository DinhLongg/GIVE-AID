export default function PartnersPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-5 bg-primary text-white" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-3">Our Partners</h1>
              <p className="lead mb-0">
                Working together with trusted organizations to create positive change in the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Overview */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-3">Trusted Partnerships</h2>
              <p className="lead text-muted">
                We collaborate with leading organizations to maximize our impact and reach communities in need.
              </p>
            </div>
          </div>

          {/* Partner Categories */}
          <div className="row mb-5">
            <div className="col-lg-4 mb-4" data-aos="fade-up" data-aos-delay="100">
              <div className="partner-category-card text-center h-100">
                <div className="category-icon">
                  <i className="fas fa-building text-primary"></i>
                </div>
                <h5 className="category-title">NGO Partners</h5>
                <p className="category-description">
                  Collaborating with established NGOs to implement programs effectively.
                </p>
              </div>
            </div>

            <div className="col-lg-4 mb-4" data-aos="fade-up" data-aos-delay="200">
              <div className="partner-category-card text-center h-100">
                <div className="category-icon">
                  <i className="fas fa-briefcase text-primary"></i>
                </div>
                <h5 className="category-title">Corporate Partners</h5>
                <p className="category-description">
                  Partnering with businesses to support community development initiatives.
                </p>
              </div>
            </div>

            <div className="col-lg-4 mb-4" data-aos="fade-up" data-aos-delay="300">
              <div className="partner-category-card text-center h-100">
                <div className="category-icon">
                  <i className="fas fa-graduation-cap text-primary"></i>
                </div>
                <h5 className="category-title">Education Partners</h5>
                <p className="category-description">
                  Working with schools and universities to provide educational opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos Grid */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-3">Our Partner Organizations</h2>
            </div>
          </div>

          <div className="row">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-6 mb-4" data-aos="fade-up" data-aos-delay={index * 50}>
                <div className="partner-logo-card">
                  <img 
                    src={`https://ui-avatars.com/api/?name=Partner+${item}&background=2563eb&color=fff&size=200`} 
                    alt={`Partner ${item}`} 
                    className="img-fluid" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-3">Why Partner With Us?</h2>
              <p className="lead text-muted">
                Benefits of partnering with Give-AID for social impact.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
              <div className="benefit-card text-center h-100">
                <div className="benefit-icon">
                  <i className="fas fa-chart-line text-primary"></i>
                </div>
                <h5 className="benefit-title">Measurable Impact</h5>
                <p className="benefit-description">
                  Track and measure the social impact of your contributions with detailed reporting.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
              <div className="benefit-card text-center h-100">
                <div className="benefit-icon">
                  <i className="fas fa-handshake text-primary"></i>
                </div>
                <h5 className="benefit-title">Strong Network</h5>
                <p className="benefit-description">
                  Connect with a wide network of NGOs, businesses, and community leaders.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="300">
              <div className="benefit-card text-center h-100">
                <div className="benefit-icon">
                  <i className="fas fa-shield-alt text-primary"></i>
                </div>
                <h5 className="benefit-title">Transparency</h5>
                <p className="benefit-description">
                  Full transparency in fund allocation and program implementation.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="400">
              <div className="benefit-card text-center h-100">
                <div className="benefit-icon">
                  <i className="fas fa-award text-primary"></i>
                </div>
                <h5 className="benefit-title">Recognition</h5>
                <p className="benefit-description">
                  Recognition for your organization's commitment to social responsibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="fw-bold mb-4">Become a Partner</h2>
              <p className="lead mb-4">
                Join us in making a difference. Partner with Give-AID to create lasting positive change in communities.
              </p>
              <a href="#" className="btn btn-light btn-lg">
                <i className="fas fa-envelope me-2"></i>Contact Us for Partnership
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

