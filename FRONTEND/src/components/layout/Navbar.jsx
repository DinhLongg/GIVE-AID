import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();

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
                        {isAuthenticated ? (
                            <li className="nav-item dropdown">
                                <a 
                                    className="nav-link dropdown-toggle user-menu-toggle d-flex align-items-center px-3 py-2 rounded-pill" 
                                    href="#" 
                                    role="button" 
                                    data-bs-toggle="dropdown"
                                >
                                    <div className="user-avatar me-2">
                                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="user-name">
                                        Hi, {user?.fullName?.split(' ')[0] || 'User'}
                                    </span>
                                    <i className="fas fa-chevron-down ms-2"></i>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end shadow-sm user-dropdown-menu">
                                    <li>
                                        <div className="user-info-header">
                                            <div className="user-info-label">Signed in as</div>
                                            <div className="user-info-name">
                                                {user?.fullName || 'User'}
                                            </div>
                                            <div className="user-info-email">{user?.email || ''}</div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link 
                                            className="dropdown-item user-menu-item" 
                                            to="/profile"
                                        >
                                            <i className="fas fa-user me-2"></i>
                                            <span>Profile</span>
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider user-menu-divider" /></li>
                                    <li>
                                        <button 
                                            className="dropdown-item user-menu-item logout w-100 text-start border-0 bg-transparent" 
                                            onClick={logout}
                                        >
                                            <i className="fas fa-sign-out-alt me-2"></i>
                                            <span>Logout</span>
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="btn btn-primary ms-2" to="/register">Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-outline-primary ms-2" to="/login">Login</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}