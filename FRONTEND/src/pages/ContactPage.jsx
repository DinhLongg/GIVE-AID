import {Link} from 'react-router-dom'
export default function ContactPage() {
    return (
        <>
            {/* <!-- Hero Section --> */}
    <section className="py-5 bg-primary text-white" style={{ marginTop: '80px'}}>
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
                    <h1 className="display-4 fw-bold mb-3">Contact Us</h1>
                    <p className="lead mb-0">
                        We'd love to hear from you. Get in touch with us for any questions or support.
                    </p>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Contact Information --> */}
    <section className="py-5">
        <div className="container">
            <div className="row">
                <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="contact-info-card text-center h-100">
                        <div className="contact-icon">
                            <i className="fas fa-map-marker-alt text-primary"></i>
                        </div>
                        <h5 className="contact-title">Visit Us</h5>
                        <p className="contact-description">
                            123 ABC Street, District 1<br />
                            Ho Chi Minh City, Vietnam<br />
                            Postal Code: 700000
                        </p>
                        <Link to ="#" className="btn btn-outline-primary">Get Directions</Link>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="contact-info-card text-center h-100">
                        <div className="contact-icon">
                            <i className="fas fa-phone text-primary"></i>
                        </div>
                        <h5 className="contact-title">Call Us</h5>
                        <p className="contact-description">
                            Main Office: +84 123 456 789<br />
                            Support Line: +84 987 654 321<br />
                            Emergency: +84 555 123 456
                        </p>
                        <Link to ="tel:+84123456789" className="btn btn-outline-primary">Call Now</Link>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="300">
                    <div className="contact-info-card text-center h-100">
                        <div className="contact-icon">
                            <i className="fas fa-envelope text-primary"></i>
                        </div>
                        <h5 className="contact-title">Email Us</h5>
                        <p className="contact-description">
                            General: info@giveaid.org<br />
                            Support: support@giveaid.org<br />
                            Partnerships: partners@giveaid.org
                        </p>
                        <Link to ="mailto:info@giveaid.org" className="btn btn-outline-primary">Send Email</Link>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Contact Form --> */}
    <section className="py-5 bg-light">
        <div className="container">
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    <div className="contact-form-container" data-aos="fade-up">
                        <div className="form-header text-center mb-4">
                            <h3 className="fw-bold mb-3">Send Us a Message</h3>
                            <p className="text-muted">Fill out the form below and we'll get back to you as soon as possible.</p>
                        </div>
                        
                        <form id="contactForm" className="contact-form">
                            {/* <!-- Personal Information --> */}
                            <div className="form-section mb-4">
                                <h5 className="section-title">Personal Information</h5>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label for="firstName" className="form-label">First Name *</label>
                                        <input type="text" name="firstName" id="firstName" className="form-control" required/>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label for="lastName" className="form-label">Last Name *</label>
                                        <input type="text" name="lastName" id="lastName" className="form-control" required/>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label for="email" className="form-label">Email Address *</label>
                                        <input type="email" name="email" id="email" className="form-control" required/>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label for="phone" className="form-label">Phone Number</label>
                                        <input type="tel" name="phone" id="phone" className="form-control"/>
                                    </div>
                                </div>
                            </div>
                            
                            {/* <!-- Inquiry Details --> */}
                            <div className="form-section mb-4">
                                <h5 className="section-title">Inquiry Details</h5>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label for="inquiryType" className="form-label">Inquiry Type *</label>
                                        <select name="inquiryType" id="inquiryType" className="form-select" required>
                                            <option value="">Select Inquiry Type</option>
                                            <option value="general">General Information</option>
                                            <option value="donation">Donation Inquiry</option>
                                            <option value="partnership">Partnership Opportunity</option>
                                            <option value="volunteer">Volunteer Opportunity</option>
                                            <option value="support">Technical Support</option>
                                            <option value="complaint">Complaint</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label for="priority" className="form-label">Priority Level</label>
                                        <select name="priority" id="priority" className="form-select">
                                            <option value="low">Low</option>
                                            <option value="medium" selected>Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label for="subject" className="form-label">Subject *</label>
                                        <input type="text" name="subject" id="subject" className="form-control" placeholder="Brief description of your inquiry" required />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label for="message" className="form-label">Message *</label>
                                        <textarea name="message" id="message" className="form-control" rows="6" placeholder="Please provide detailed information about your inquiry..." required></textarea>
                                    </div>
                                </div>
                            </div>
                            
                            {/* <!-- Additional Information --> */}
                            <div className="form-section mb-4">
                                <h5 className="section-title">Additional Information</h5>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label for="organization" className="form-label">Organization/Company</label>
                                        <input type="text" name="organization" id="organization" className="form-control" placeholder="If applicable"/>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label for="website" className="form-label">Website</label>
                                        <input type="url" name="website" id="website" className="form-control" placeholder="https://example.com"/>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label for="country" className="form-label">Country</label>
                                        <select name="country" id="country" className="form-select">
                                            <option value="">Select Country</option>
                                            <option value="VN">Vietnam</option>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label for="timezone" className="form-label">Preferred Contact Time</label>
                                        <select name="timezone" id="timezone" className="form-select">
                                            <option value="">Select Time</option>
                                            <option value="morning">Morning (9 AM - 12 PM)</option>
                                            <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                                            <option value="evening">Evening (5 PM - 8 PM)</option>
                                            <option value="anytime">Anytime</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Preferences */}
                            <div className="form-section mb-4">
                                <h5 className="section-title">Communication Preferences</h5>
                                <div className="form-check mb-3">
                                    <input className="form-check-input" type="checkbox" name="newsletter" id="newsletter"/>
                                    <label className="form-check-label" for="newsletter">
                                        Subscribe to our newsletter for updates
                                    </label>
                                </div>
                                <div className="form-check mb-3">
                                    <input className="form-check-input" type="checkbox" name="smsUpdates" id="smsUpdates"/>
                                    <label className="form-check-label" for="smsUpdates">
                                        Receive SMS updates about your inquiry
                                    </label>
                                </div>
                                <div className="form-check mb-3">
                                    <input className="form-check-input" type="checkbox" name="followUp" id="followUp" checked/>
                                    <label className="form-check-label" for="followUp">
                                        Allow follow-up communication
                                    </label>
                                </div>
                            </div>
                            
                            {/* <!-- Terms & Conditions --> */}
                            <div className="form-section mb-4">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="terms" id="terms" required/>
                                    <label className="form-check-label" for="terms">
                                        I agree to the <Link to ="#" className="text-primary">Terms of Service</Link> and <Link to ="#" className="text-primary">Privacy Policy</Link> *
                                    </label>
                                </div>
                            </div>
                            
                            {/* <!-- Submit Button --> */}
                            <div className="form-section text-center">
                                <button type="submit" className="btn btn-primary btn-lg px-5">
                                    <i className="fas fa-paper-plane me-2"></i>Send Message
                                </button>
                                <p className="text-muted mt-3 small">
                                    <i className="fas fa-clock me-1"></i>
                                    We typically respond within 24 hours
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Office Hours --> */}
    <section className="py-5">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-6" data-aos="fade-right">
                    <h2 className="display-5 fw-bold mb-4">Office Hours</h2>
                    <div className="office-hours">
                        <div className="hours-item mb-3">
                            <div className="d-flex justify-content-between">
                                <span className="fw-bold">Monday - Friday</span>
                                <span>8:00 AM - 6:00 PM</span>
                            </div>
                        </div>
                        <div className="hours-item mb-3">
                            <div className="d-flex justify-content-between">
                                <span className="fw-bold">Saturday</span>
                                <span>9:00 AM - 4:00 PM</span>
                            </div>
                        </div>
                        <div className="hours-item mb-3">
                            <div className="d-flex justify-content-between">
                                <span className="fw-bold">Sunday</span>
                                <span>Closed</span>
                            </div>
                        </div>
                        <div className="hours-item mb-3">
                            <div className="d-flex justify-content-between">
                                <span className="fw-bold">Emergency Support</span>
                                <span>24/7 Available</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-muted mt-4">
                        <i className="fas fa-info-circle me-2"></i>
                        All times are in Vietnam Standard Time (GMT+7)
                    </p>
                </div>
                <div className="col-lg-6" data-aos="fade-left">
                    <div className="office-image">
                        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                             alt="Office" className="img-fluid rounded-3 shadow-lg" />
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Map Section --> */}
    <section className="py-5 bg-light">
        <div className="container">
            <div className="row mb-5">
                <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
                    <h2 className="display-5 fw-bold mb-3">Find Us</h2>
                    <p className="lead text-muted">
                        Visit our office or explore the area around our location.
                    </p>
                </div>
            </div>
            
            <div className="row">
                <div className="col-12" data-aos="fade-up">
                    <div className="map-container">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.325123456789!2d106.70000000000001!3d10.776900000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4567890abc%3A0x1234567890abcdef!2sDistrict%201%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus" 
                            width="100%" 
                            height="400" 
                            style= {{border:'0'}} 
                            allowfullscreen="" 
                            loading="lazy" 
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    </section>
        </>
    )
}