import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
        <div className="container">
            <Link className="navbar-brand fw-bold text-primary" to="/">
                <i className="fas fa-heart me-2"></i>Give-AID
            </Link>
            
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            Donate
                        </a>
                        <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to="/donate">Donate Now</Link></li>
                            <li><Link className="dropdown-item" to="/donate#categories">Donation Categories</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            About Us
                        </a>
                        <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to="/about">Overview</Link></li>
                            <li><Link className="dropdown-item" to="/about#what-we-do">What We Do</Link></li>
                            <li><Link className="dropdown-item" to="/about#mission">Our Mission</Link></li>
                            <li><Link className="dropdown-item" to="/about#team">Our Team</Link></li>
                            <li><Link className="dropdown-item" to="/about#career">Career</Link></li>
                            <li><Link className="dropdown-item" to="/about#achievements">Achievements</Link></li>
                            <li><Link className="dropdown-item" to="/about#supporters">Supporters</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/partners">Our Partners</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/gallery">Gallery</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/contact">Contact Us</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/help">Help Centre</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="btn btn-primary ms-2" to="/register">Register</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="btn btn-outline-primary ms-2" to="/login">Login</Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    )
}