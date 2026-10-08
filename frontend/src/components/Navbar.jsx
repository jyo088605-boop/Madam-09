import React, { useState, useEffect } from 'react';
import { Heart, Lock, Unlock, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ isAdmin, setIsAdmin, activeSection, setActiveSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === '1009') {
      setIsAdmin(true);
      localStorage.setItem('birthday_admin', 'true');
      setShowLoginModal(false);
      setPasscode('');
      setError('');
    } else {
      setError('Wrong passcode. Hint: Her birth date (MMDD)');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('birthday_admin');
  };

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'talents', label: 'Her Talent' },
    { id: 'letters', label: 'Letters Board' }
  ];

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <div className="navbar-logo" onClick={() => handleNavClick('home')}>
            <Heart className="heart-icon" />
            <span>Oct 9 Special</span>
          </div>

          {/* Desktop Navigation */}
          <ul className="nav-menu">
            {sections.map((section) => (
              <li key={section.id} className="nav-item">
                <button
                  onClick={() => handleNavClick(section.id)}
                  className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            {isAdmin ? (
              <button className="btn-admin active" onClick={handleLogout} title="Logout Admin">
                <Unlock size={18} />
                <span>Admin On</span>
              </button>
            ) : (
              <button className="btn-admin" onClick={() => setShowLoginModal(true)} title="Login as Creator">
                <Lock size={18} />
                <span>Creator Access</span>
              </button>
            )}

            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="mobile-nav">
            <ul>
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => handleNavClick(section.id)}
                    className={`mobile-nav-link ${activeSection === section.id ? 'active' : ''}`}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content glass-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Creator Authentication</h3>
              <button className="close-btn" onClick={() => setShowLoginModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleLogin}>
              <p className="modal-description">
                Enter the passcode to write notes, add memories, and upload photos.
              </p>
              <div className="form-group">
                <label htmlFor="passcode">Passcode</label>
                <input
                  type="password"
                  id="passcode"
                  className="form-control"
                  placeholder="Enter passcode (MMDD)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                />
                {error && <span className="error-text">{error}</span>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowLoginModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
