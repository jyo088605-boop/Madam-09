import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import './IntroLoader.css';

export default function IntroLoader({ onFinished }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start fading out after 2.8 seconds
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2800);

    // Call onFinished callback after the transition ends (3.5 seconds total)
    const finishTimer = setTimeout(() => {
      onFinished();
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div className={`intro-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      {/* Floating Pink Hearts Background */}
      <div className="intro-hearts-bg">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="intro-floating-heart" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1.5}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
              fontSize: `${16 + Math.random() * 24}px`
            }}
          >
            ♥
          </div>
        ))}
      </div>

      <div className="intro-container">
        <div className="intro-heart-box">
          <Heart className="intro-heart" size={80} />
          <div className="intro-heart-pulse"></div>
        </div>
        <h1 className="intro-text">
          Happy Birthday Madam <span>✨</span>
        </h1>
        <p className="intro-subtext">Preparing memory lane...</p>
      </div>
    </div>
  );
}
