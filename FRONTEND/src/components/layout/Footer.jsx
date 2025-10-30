export default function Footer() {
    return (
        <footer className="bg-dark text-white py-5">
        <div className="container">
            <div className="row">
                <div className="col-lg-4 mb-4">
                    <h5 className="fw-bold mb-3">
                        <i className="fas fa-heart me-2"></i>Give-AID
                    </h5>
                    <p className="text-muted">
                        Connecting compassionate hearts to create positive change in the community.
                    </p>
                    <div className="social-links">
                        <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="text-white me-3"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="text-white me-3"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                
                <div className="col-lg-2 col-md-6 mb-4">
                    <h6 className="fw-bold mb-3">Links</h6>
                    <ul className="list-unstyled">
                        <li><a href="about.html" className="text-muted">About Us</a></li>
                        <li><a href="donate.html" className="text-muted">Donate</a></li>
                        <li><a href="partners.html" className="text-muted">Our Partners</a></li>
                        <li><a href="gallery.html" className="text-muted">Gallery</a></li>
                    </ul>
                </div>
                
                <div className="col-lg-2 col-md-6 mb-4">
                    <h6 className="fw-bold mb-3">Programs</h6>
                    <ul className="list-unstyled">
                        <li><a href="donate.html#education" className="text-muted">Education</a></li>
                        <li><a href="donate.html#healthcare" className="text-muted">Healthcare</a></li>
                        <li><a href="donate.html#women" className="text-muted">Women</a></li>
                        <li><a href="donate.html#children" className="text-muted">Children</a></li>
                    </ul>
                </div>
                
                <div className="col-lg-4 mb-4">
                    <h6 className="fw-bold mb-3">Contact</h6>
                    <div className="contact-info">
                        <p className="text-muted mb-2">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            123 ABC Street, District 1, Ho Chi Minh City
                        </p>
                        <p className="text-muted mb-2">
                            <i className="fas fa-phone me-2"></i>
                            +84 123 456 789
                        </p>
                        <p className="text-muted mb-0">
                            <i className="fas fa-envelope me-2"></i>
                            info@giveaid.org
                        </p>
                    </div>
                </div>
            </div>
            
            <hr className="my-4" />
            
            <div className="row align-items-center">
                <div className="col-md-6">
                    <p className="text-muted mb-0">
                        &copy; 2024 Give-AID. All rights reserved.
                    </p>
                </div>
                <div className="col-md-6 text-md-end">
                    <a href="#" className="text-muted me-3">Privacy Policy</a>
                    <a href="#" className="text-muted">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
    )
}