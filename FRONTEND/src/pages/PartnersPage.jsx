import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import partnerService from '../services/partnerServices';
import PageBanner from "../components/PageBanner";

export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await partnerService.getAll();
        setPartners(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load partners:', error);
        toast.error('Failed to load partners. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <PageBanner
        title="Our Partners"
        subtitle="Working together with trusted organizations to create positive change in the community."
        eyebrowText="Collaboration"
        accent="ocean"
      />

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
              <p className="lead text-muted">
                {loading ? 'Loading partners...' : partners.length > 0 ? `We are proud to work with ${partners.length} trusted partners` : 'Meet our trusted partners'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-handshake fa-3x mb-3 text-muted"></i>
              <p className="text-muted">No partners available at the moment.</p>
              <p className="text-muted small">Check back soon for updates!</p>
            </div>
          ) : (
            <div className="row">
              {partners.map((partner, index) => (
                <div 
                  key={partner.id} 
                  className="col-lg-3 col-md-4 col-6 mb-4" 
                  data-aos="fade-up" 
                  data-aos-delay={index * 50}
                >
                  <div className="partner-logo-card h-100 d-flex flex-column align-items-center justify-content-center p-3 shadow-sm rounded">
                    <div className="mb-3" style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {partner.logoUrl ? (
                        <img 
                          src={partner.logoUrl} 
                          alt={partner.name || 'Partner'} 
                          className="img-fluid"
                          style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.parentElement.querySelector('.logo-fallback');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="logo-fallback d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '120px', 
                          height: '120px', 
                          display: partner.logoUrl ? 'none' : 'flex',
                          backgroundColor: '#e9ecef',
                          borderRadius: '8px'
                        }}
                      >
                        <i className="fas fa-building fa-3x text-muted"></i>
                      </div>
                    </div>
                    <h6 className="partner-name text-center mb-2" style={{ fontSize: '0.9rem', fontWeight: '600', minHeight: '2.5rem' }}>
                      {partner.name || 'Partner'}
                    </h6>
                    {partner.website && (
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary mt-auto"
                        style={{ fontSize: '0.75rem' }}
                      >
                        <i className="fas fa-external-link-alt me-1"></i>
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
      <PageBanner
        title="Become a Partner"
        subtitle="Join us in making a difference. Partner with Give-AID to create lasting positive change in communities."
        eyebrowText="Partner With Us"
        accent="sunset"
        topSpacing={false}
      >
        <div className="d-flex justify-content-center">
          <Link to="/contact" className="btn btn-light btn-lg">
            <i className="fas fa-envelope me-2"></i>Contact Us for Partnership
          </Link>
        </div>
      </PageBanner>
    </>
  );
}

