import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCounter } from "../utilis/useCounter";
import programService from "../services/programServices";

export default function HomePage() {
  // Counter animations for statistics
  const peopleHelped = useCounter(50000, 2000);
  const donors = useCounter(2500, 2000);
  const partners = useCounter(150, 2000);
  const usdDonated = useCounter(5000000, 2000);

  const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [programStats, setProgramStats] = useState({});

  useEffect(() => {
    const fetchFeaturedPrograms = async () => {
      try {
        const programs = await programService.getAll();
        // Take first 3 programs or all if less than 3
        const featured = (programs || []).slice(0, 3);
        setFeaturedPrograms(featured);

        // Fetch stats for each program
        const statsPromises = featured.map(async (program) => {
          try {
            const stats = await programService.getStats(program.id);
            return { programId: program.id, stats };
          } catch (error) {
            console.error(
              `Failed to load stats for program ${program.id}:`,
              error
            );
            return { programId: program.id, stats: null };
          }
        });

        const statsResults = await Promise.all(statsPromises);
        const statsMap = {};
        statsResults.forEach(({ programId, stats }) => {
          statsMap[programId] = stats;
        });
        setProgramStats(statsMap);
      } catch (error) {
        console.error("Failed to load featured programs:", error);
      }
    };

    fetchFeaturedPrograms();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6" data-aos="fade-right">
              <h1 className="display-4 fw-bold text-white mb-4">
                Together We Make a Difference
              </h1>
              <p className="lead text-white mb-4">
                Give-AID connects non-governmental organizations and
                compassionate individuals to support charitable activities,
                education, and community development.
              </p>
              <div className="hero-buttons">
                <Link to="/donate" className="btn btn-primary btn-lg me-3">
                  <i className="fas fa-heart me-2"></i>Donate Now
                </Link>
                <Link to="/about" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-info-circle me-2"></i>Learn More
                </Link>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="hero-image">
                <img
                  src="/src/assets/imgs/Home_1.avif"
                  alt="Volunteers helping community"
                  className="img-fluid rounded-3 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            <div
              className="col-md-3 col-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-users text-primary"></i>
                </div>
                <h3 className="stat-number">{peopleHelped.toLocaleString()}</h3>
                <p className="stat-label">People Helped</p>
              </div>
            </div>
            <div
              className="col-md-3 col-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-hand-holding-heart text-primary"></i>
                </div>
                <h3 className="stat-number">{donors.toLocaleString()}</h3>
                <p className="stat-label">Donors</p>
              </div>
            </div>
            <div
              className="col-md-3 col-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-building text-primary"></i>
                </div>
                <h3 className="stat-number">{partners.toLocaleString()}</h3>
                <p className="stat-label">Partner Organizations</p>
              </div>
            </div>
            <div
              className="col-md-3 col-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-dollar-sign text-primary"></i>
                </div>
                <h3 className="stat-number">{usdDonated.toLocaleString()}</h3>
                <p className="stat-label">USD Donated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Causes Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-3">Featured Programs</h2>
              <p className="lead text-muted">
                Join us in meaningful charitable activities that bring hope and
                opportunities to those in need.
              </p>
            </div>
          </div>

          <div className="row">
            {featuredPrograms.length === 0 ? (
              <div className="col-12 text-center text-muted py-5">
                <p>No featured programs available.</p>
                <Link to="/programs" className="btn btn-primary">
                  View All Programs
                </Link>
              </div>
            ) : (
              featuredPrograms.map((program, index) => {
                const stats = programStats[program.id];
                const progressPercentage = stats?.progressPercentage || 0;
                const totalDonations = stats?.totalDonations || 0;
                const goalAmount = stats?.goalAmount;

                return (
                  <div
                    key={program.id}
                    className="col-lg-4 col-md-6 mb-4"
                    data-aos="fade-up"
                    data-aos-delay={(index + 1) * 100}
                  >
                    <div className="cause-card h-100">
                      <div className="cause-image">
                        <img
                          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                          alt={program.title || "Program"}
                          className="img-fluid"
                        />
                        <div className="cause-overlay">
                          <Link to="/donate" className="btn btn-primary">
                            Donate
                          </Link>
                        </div>
                      </div>
                      <div className="cause-content">
                        <h5 className="cause-title">
                          {program.title || "Program"}
                        </h5>
                        <p className="cause-description">
                          {program.description ||
                            "Supporting meaningful charitable activities."}
                        </p>
                        {goalAmount && goalAmount > 0 ? (
                          <div className="cause-progress">
                            <div className="progress">
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: `${Math.min(
                                    progressPercentage,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="cause-stats">
                              <span>
                                {Math.round(progressPercentage)}% Complete
                              </span>
                              <span>{formatCurrency(totalDonations)}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="cause-progress">
                            <div className="cause-stats">
                              <span>
                                Donations: {formatCurrency(totalDonations)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="text-center mt-4" data-aos="fade-up">
            <Link to="/programs" className="btn btn-outline-primary btn-lg">
              <i className="fas fa-plus me-2"></i>View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-3">How It Works</h2>
              <p className="lead text-muted">
                A simple and transparent process to help you contribute
                effectively.
              </p>
            </div>
          </div>

          <div className="row">
            <div
              className="col-lg-3 col-md-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="step-card text-center">
                <div className="step-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h5 className="step-title">1. Choose Program</h5>
                <p className="step-description">
                  Explore and select the program you want to support
                </p>
              </div>
            </div>

            <div
              className="col-lg-3 col-md-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="step-card text-center">
                <div className="step-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <h5 className="step-title">2. Donate</h5>
                <p className="step-description">
                  Contribute your desired amount securely
                </p>
              </div>
            </div>

            <div
              className="col-lg-3 col-md-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="step-card text-center">
                <div className="step-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h5 className="step-title">3. Track Progress</h5>
                <p className="step-description">
                  Receive regular reports on fund usage
                </p>
              </div>
            </div>

            <div
              className="col-lg-3 col-md-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="step-card text-center">
                <div className="step-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h5 className="step-title">4. Make Impact</h5>
                <p className="step-description">
                  Witness the positive change you've created
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-3">Our Stories</h2>
              <p className="lead text-muted">
                Testimonials from those who have been helped and our donors.
              </p>
            </div>
          </div>

          <div className="row">
            <div
              className="col-lg-4 mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="testimonial-card h-100">
                <div className="testimonial-content">
                  <div className="testimonial-quote">
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <p className="testimonial-text">
                    "Thanks to Give-AID's support, my child has the opportunity
                    to go to school and learn. I am very grateful to those who
                    have helped our family."
                  </p>
                </div>
                <div className="testimonial-author">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Sarah Johnson"
                    className="testimonial-avatar"
                  />
                  <div className="testimonial-info">
                    <h6 className="testimonial-name">Sarah Johnson</h6>
                    <p className="testimonial-role">Parent</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col-lg-4 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="testimonial-card h-100">
                <div className="testimonial-content">
                  <div className="testimonial-quote">
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <p className="testimonial-text">
                    "Give-AID has helped me connect with meaningful programs.
                    Donating has become easier and more transparent than ever."
                  </p>
                </div>
                <div className="testimonial-author">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Michael Chen"
                    className="testimonial-avatar"
                  />
                  <div className="testimonial-info">
                    <h6 className="testimonial-name">Michael Chen</h6>
                    <p className="testimonial-role">Donor</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col-lg-4 mb-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="testimonial-card h-100">
                <div className="testimonial-content">
                  <div className="testimonial-quote">
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <p className="testimonial-text">
                    "As a partner organization, we are very satisfied with
                    Give-AID's support and transparency in managing programs."
                  </p>
                </div>
                <div className="testimonial-author">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Emily Rodriguez"
                    className="testimonial-avatar"
                  />
                  <div className="testimonial-info">
                    <h6 className="testimonial-name">Emily Rodriguez</h6>
                    <p className="testimonial-role">NGO Director</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <h3 className="fw-bold mb-3">Subscribe to Our Newsletter</h3>
              <p className="mb-0">
                Get updates on new programs and our activities.
              </p>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <form className="newsletter-form">
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                  />
                  <button className="btn btn-light btn-lg" type="submit">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
