import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Gift, Heart, Calendar } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCardOpened, setIsCardOpened] = useState(false);
  
  const audioRef = useRef(null);

  function calculateTimeLeft() {
    const currentYear = new Date().getFullYear();
    let targetDate = new Date(`October 9, ${currentYear} 00:00:00`);
    
    // If October 9 has already passed this year, count down to next year
    if (new Date() > targetDate) {
      targetDate = new Date(`October 9, ${currentYear + 1} 00:00:00`);
    }

    const difference = targetDate - new Date();
    
    let time = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isBirthday: false
    };

    if (difference > 0) {
      time = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isBirthday: false
      };
    } else {
      time.isBirthday = true;
    }

    return time;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="http://localhost:5000/uploads/bg-music.mpeg"
        loop
      />

      {/* Floating Sparkles */}
      <div className="sparkles-container">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="floating-sparkle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          >
            ♥
          </div>
        ))}
      </div>

      <div className="container hero-container animate-fade-in">
        <div className="hero-content">
          <span className="hero-tag">A Special Celebration</span>
          <h1 className="hero-title">
            Wish You A Very <span>Happy Birthday Madam</span>
          </h1>
          <p className="hero-subtitle">
            Welcome to a digital box of beautiful memories, shared smiles, and appreciation for someone who makes the world brighter every day.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setIsCardOpened(!isCardOpened)}>
              <Gift size={20} />
              {isCardOpened ? 'Close Wish Card' : 'Open Birthday Card'}
            </button>
            <button className="btn btn-outline" onClick={toggleMusic}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Mute Music' : 'Play Theme Music'}
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Heart size={20} />
              Our Journey
            </button>
          </div>

          {/* Countdown Clock */}
          <div className="countdown-wrap">
            <h3 className="countdown-title">
              <Calendar size={18} />
              {timeLeft.isBirthday ? "Happy Birthday! Today is the Day! 🎉" : "Countdown to October 9"}
            </h3>
            {!timeLeft.isBirthday && (
              <div className="countdown-grid">
                <div className="countdown-item">
                  <span className="countdown-num">{timeLeft.days}</span>
                  <span className="countdown-label">Days</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-num">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="countdown-label">Hours</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="countdown-label">Mins</span>
                </div>
                <div className="countdown-item">
                  <span className="countdown-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="countdown-label">Secs</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Card */}
        <div className="hero-visual">
          <div className={`birthday-card ${isCardOpened ? 'open' : ''}`}>
            <div className="card-front glass-card">
              <div className="card-decor">
                <Heart size={40} className="decor-heart" />
              </div>
              <h2>To A Very Special Person</h2>
              <p>Click the button or touch here to open a special note...</p>
              <div className="card-ribbon">October 9</div>
            </div>
            <div className="card-inside glass-card">
              <span className="card-inside-tag">October 9th</span>
              <h2>Happy Birthday Madam!</h2>
              <div className="divider-gold"></div>
              <p className="card-message">
                Wishing you a year filled with laughter, beautiful moments, and endless success. May your path always be lined with joy and surrounded by those who love you!
              </p>
              <p className="card-signature">With lots of love & joy</p>
              <div className="card-inside-decor">✨ 💖 ✨</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
