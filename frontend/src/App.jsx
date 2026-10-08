import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';
import Talents from './components/Talents';
import WritingPad from './components/WritingPad';
import IntroLoader from './components/IntroLoader';
import './App.css';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem('birthday_admin') === 'true'
  );
  const [activeSection, setActiveSection] = useState('home');
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="app-container">
      {/* Premium Background Ambient Glow Orbs */}
      <div className="bg-glow-orb orb-1"></div>
      <div className="bg-glow-orb orb-2"></div>
      <div className="bg-glow-orb orb-3"></div>

      {showIntro && <IntroLoader onFinished={() => setShowIntro(false)} />}

      {/* Header Navigation */}
      <Navbar 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {activeSection === 'home' && (
        <>
          {/* Hero Welcome & Countdown Section */}
          <Hero />
          {/* Friendship Timeline (Childhood to Now, 3 Years) */}
          <Timeline isAdmin={isAdmin} />
        </>
      )}

      {activeSection === 'gallery' && (
        /* Picture Gallery (All, Memories, Favorite Persons) */
        <Gallery isAdmin={isAdmin} />
      )}

      {activeSection === 'talents' && (
        /* Her Talents & Hobbies */
        <Talents isAdmin={isAdmin} />
      )}

      {activeSection === 'letters' && (
        /* Letters / Notes Board */
        <WritingPad isAdmin={isAdmin} />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} October 9 Birthday Tribute. Made with 💖 for a wonderful friend.</p>
          <p className="footer-subtext">Click "Creator Access" in the top right to customize this site with your own memories.</p>
        </div>
      </footer>
    </div>
  );
}
