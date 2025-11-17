import {Link} from 'react-router-dom'
export default function AboutPage() {
    return (
        <>
             {/* <!-- Hero Section --> */}
    <section className="py-5 bg-primary text-white" style={{marginTop: '80px'}}>
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
                    <h1 className="display-4 fw-bold mb-3">About Give-AID</h1>
                    <p className="lead mb-0">
                        We believe that everyone has the right to live a good and meaningful life.
                    </p>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- What We Do Section --> */}
    <section id="what-we-do" className="py-5">
        <div className="container">
            <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
                    <h2 className="display-5 fw-bold mb-3">What We Do</h2>
                    <p className="lead text-muted">
                        Give-AID operates as a bridge between compassionate individuals and non-governmental organizations.
                    </p>
                </div>
            </div>
            
            <div className="row">
                <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="service-card h-100">
                        <div className="service-icon">
                            <i className="fas fa-handshake"></i>
                        </div>
                        <h5 className="service-title">Connect</h5>
                        <p className="service-description">
                            Connecting donors with trusted NGOs to ensure funds are used effectively.
                        </p>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="service-card h-100">
                        <div className="service-icon">
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <h5 className="service-title">Transparency</h5>
                        <p className="service-description">
                            Ensuring transparency in fund usage with detailed reports and progress tracking.
                        </p>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="300">
                    <div className="service-card h-100">
                        <div className="service-icon">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <h5 className="service-title">Efficiency</h5>
                        <p className="service-description">
                            Optimizing donation processes to ensure every dollar is used for its intended purpose.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Mission Section --> */}
    <section id="mission" className="py-5 bg-light">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-6" data-aos="fade-right">
                    <h2 className="display-5 fw-bold mb-4">Our Mission</h2>
                    <p className="lead mb-4">
                        Give-AID was established with the mission to create a transparent and efficient platform to connect compassionate individuals with trusted non-governmental organizations.
                    </p>
                    <div className="mission-points">
                        <div className="mission-point mb-3">
                            <i className="fas fa-check-circle text-primary me-3"></i>
                            <span>Ensure transparency in all activities</span>
                        </div>
                        <div className="mission-point mb-3">
                            <i className="fas fa-check-circle text-primary me-3"></i>
                            <span>Optimize donation processes</span>
                        </div>
                        <div className="mission-point mb-3">
                            <i className="fas fa-check-circle text-primary me-3"></i>
                            <span>Create positive impact in the community</span>
                        </div>
                        <div className="mission-point mb-3">
                            <i className="fas fa-check-circle text-primary me-3"></i>
                            <span>Build trust between all parties</span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6" data-aos="fade-left">
                    <div className="mission-image">
                        <img src="/images/about-mission-hero.jpg" 
                             alt="Mission" className="img-fluid rounded-3 shadow-lg" />
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Team Section --> */}
    <section id="team" className="py-5">
        <div className="container">
            <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
                    <h2 className="display-5 fw-bold mb-3">Our Team</h2>
                    <p className="lead text-muted">
                        Passionate and experienced people in the field of charity and community development.
                    </p>
                </div>
            </div>
            
            <div className="row">
                <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="team-card">
                        <div className="team-image">
                            <img src="/images/team-member-1-john-smith.jpg" 
                                 alt="John Smith" className="img-fluid" />
                        </div>
                        <div className="team-info">
                            <h5 className="team-name">John Smith</h5>
                            <p className="team-position">Chief Executive Officer</p>
                            <p className="team-description">
                                Over 15 years of experience in community development and charity project management.
                            </p>
                            <div className="team-social">
                                <Link to="#" className="text-primary"><i className="fab fa-linkedin-in"></i></Link>
                                <Link to="#" className="text-primary"><i className="fab fa-twitter"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="team-card">
                        <div className="team-image">
                            <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                                 alt="Sarah Johnson" className="img-fluid" />
                        </div>
                        <div className="team-info">
                            <h5 className="team-name">Sarah Johnson</h5>
                            <p className="team-position">Program Director</p>
                            <p className="team-description">
                                Expert in education and child development with over 12 years of experience.
                            </p>
                            <div className="team-social">
                                <Link to="#" className="text-primary"><i className="fab fa-linkedin-in"></i></Link>
                                <Link to="#" className="text-primary"><i className="fab fa-facebook-f"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="300">
                    <div className="team-card">
                        <div className="team-image">
                            <img src="/images/team-member-3-michael-chen.jpg" 
                                 alt="Michael Chen" className="img-fluid" />
                        </div>
                        <div className="team-info">
                            <h5 className="team-name">Michael Chen</h5>
                            <p className="team-position">Chief Financial Officer</p>
                            <p className="team-description">
                                Financial expert with experience in charity fund management and auditing.
                            </p>
                            <div className="team-social">
                                <Link to="#" className="text-primary"><i className="fab fa-linkedin-in"></i></Link>
                                <Link to="#" className="text-primary"><i className="fab fa-twitter"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="400">
                    <div className="team-card">
                        <div className="team-image">
                            <img src="/images/team-member-4-emily-rodriguez.jpg" 
                                 alt="Emily Rodriguez" className="img-fluid" />
                        </div>
                        <div className="team-info">
                            <h5 className="team-name">Emily Rodriguez</h5>
                            <p className="team-position">Communications Director</p>
                            <p className="team-description">
                                Communications and marketing expert with experience in NGO brand building.
                            </p>
                            <div className="team-social">
                                <Link to="#" className="text-primary"><i className="fab fa-linkedin-in"></i></Link>
                                <Link to="#" className="text-primary"><i className="fab fa-instagram"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Career Section --> */}
    <section id="career" className="py-5 bg-light">
        <div className="container">
            <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
                    <h2 className="display-5 fw-bold mb-3">Career Opportunities</h2>
                    <p className="lead text-muted">
                        Join us to make a difference in the community.
                    </p>
                </div>
            </div>
            
            <div className="row">
                <div className="col-lg-6 mb-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="career-card h-100">
                        <div className="career-header">
                            <h5 className="career-title">Program Development Specialist</h5>
                            <span className="career-type">Full-time</span>
                        </div>
                        <div className="career-content">
                            <p className="career-description">
                                Responsible for developing and managing charity programs, working directly with partner NGOs.
                            </p>
                            <div className="career-requirements">
                                <h6>Requirements:</h6>
                                <ul>
                                    <li>University degree in related field</li>
                                    <li>2-3 years experience in NGO field</li>
                                    <li>Good communication and teamwork skills</li>
                                    <li>Good English communication skills</li>
                                </ul>
                            </div>
                            <Link to="#" className="btn btn-primary">Apply Now</Link>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-6 mb-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="career-card h-100">
                        <div className="career-header">
                            <h5 className="career-title">Communications Specialist</h5>
                            <span className="career-type">Full-time</span>
                        </div>
                        <div className="career-content">
                            <p className="career-description">
                                Responsible for communications, marketing and building Give-AID brand image.
                            </p>
                            <div className="career-requirements">
                                <h6>Requirements:</h6>
                                <ul>
                                    <li>University degree in Marketing/Communications</li>
                                    <li>1-2 years experience in communications field</li>
                                    <li>Proficient in design tools and social media</li>
                                    <li>Creative and good marketing thinking</li>
                                </ul>
                            </div>
                            <Link to="#" className="btn btn-primary">Apply Now</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Achievements Section --> */}
    <section id="achievements" className="py-5">
        <div className="container">
            <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
                    <h2 className="display-5 fw-bold mb-3">Our Achievements</h2>
                    <p className="lead text-muted">
                        Impressive numbers and achievements in our journey of serving the community.
                    </p>
                </div>
            </div>
            
            <div className="row">
                <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="achievement-card text-center">
                        <div className="achievement-icon">
                            <i className="fas fa-trophy"></i>
                        </div>
                        <h3 className="achievement-number">15+</h3>
                        <p className="achievement-label">Awards</p>
                        <p className="achievement-description">
                            Received many awards for charity activities and community development
                        </p>
                    </div>
                </div>
                
                <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="achievement-card text-center">
                        <div className="achievement-icon">
                            <i className="fas fa-certificate"></i>
                        </div>
                        <h3 className="achievement-number">ISO 9001</h3>
                        <p className="achievement-label">Certification</p>
                        <p className="achievement-description">
                            Achieved ISO 9001 certification for quality management system
                        </p>
                    </div>
                </div>
                
                <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="300">
                    <div className="achievement-card text-center">
                        <div className="achievement-icon">
                            <i className="fas fa-star"></i>
                        </div>
                        <h3 className="achievement-number">4.9/5</h3>
                        <p className="achievement-label">Rating</p>
                        <p className="achievement-description">
                            Average rating from donors and partners
                        </p>
                    </div>
                </div>
                
                <div className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="400">
                    <div className="achievement-card text-center">
                        <div className="achievement-icon">
                            <i className="fas fa-medal"></i>
                        </div>
                        <h3 className="achievement-number">100%</h3>
                        <p className="achievement-label">Transparency</p>
                        <p className="achievement-description">
                            Transparency rate in fund usage and financial reporting
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Supporters Section --> */}
    <section id="supporters" className="py-5 bg-light">
        <div className="container">
            <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
                    <h2 className="display-5 fw-bold mb-3">Our Supporters</h2>
                    <p className="lead text-muted">
                        Thank you to our supporters who have accompanied us on our journey of serving the community.
                    </p>
                </div>
            </div>
            
            <div className="row">
              <div className="col-lg-2 col-md-4 col-6 mb-4" data-aos="fade-up" data-aos-delay="100">
                  <div className="supporter-card">
                      <img src="https://ui-avatars.com/api/?name=Partner+1&background=2563eb&color=fff&size=150" alt="Supporter 1" className="img-fluid" />
                  </div>
              </div>
              
              <div className="col-lg-2 col-md-4 col-6 mb-4" data-aos="fade-up" data-aos-delay="200">
                  <div className="supporter-card">
                      <img src="https://ui-avatars.com/api/?name=Partner+2&background=10b981&color=fff&size=150" alt="Supporter 2" className="img-fluid" />
                  </div>
              </div>
              
              <div className="col-lg-2 col-md-4 col-6 mb-4" data-aos="fade-up" data-aos-delay="300">
                  <div className="supporter-card">
                      <img src="https://ui-avatars.com/api/?name=Partner+3&background=f59e0b&color=fff&size=150" alt="Supporter 3" className="img-fluid" />
                  </div>
              </div>
              
              <div className="col-lg-2 col-md-4 col-6 mb-4" data-aos="fade-up" data-aos-delay="400">
                  <div className="supporter-card">
                      <img src="https://ui-avatars.com/api/?name=Partner+4&background=ef4444&color=fff&size=150" alt="Supporter 4" className="img-fluid" />
                  </div>
              </div>
              
              <div className="col-lg-2 col-md-4 col-6 mb-4" data-aos="fade-up" data-aos-delay="500">
                  <div className="supporter-card">
                      <img src="https://ui-avatars.com/api/?name=Partner+5&background=8b5cf6&color=fff&size=150" alt="Supporter 5" className="img-fluid" />
                  </div>
              </div>
              
              <div className="col-lg-2 col-md-4 col-6 mb-4" data-aos="fade-up" data-aos-delay="600">
                  <div className="supporter-card">
                      <img src="https://ui-avatars.com/api/?name=Partner+6&background=06b6d4&color=fff&size=150" alt="Supporter 6" className="img-fluid" />
                  </div>
              </div>
            </div>
        </div>
    </section>
        </>
    )
}