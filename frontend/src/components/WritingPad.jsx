import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, Plus, Trash2, X, Calendar, Edit3 } from 'lucide-react';
import './WritingPad.css';

export default function WritingPad({ isAdmin }) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeLetter, setActiveLetter] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/letters');
      const data = await response.json();
      setLetters(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching letters:', err);
      setLoading(false);
    }
  };

  const handleSaveLetter = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const response = await fetch('http://localhost:5000/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, date })
      });

      if (response.ok) {
        fetchLetters();
        setTitle('');
        setContent('');
        setDate('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Error saving letter:', err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent opening letter
    if (!window.confirm('Are you sure you want to delete this letter?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/letters/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setLetters(letters.filter(l => l.id !== id));
        if (activeLetter && activeLetter.id === id) {
          setActiveLetter(null);
        }
      }
    } catch (err) {
      console.error('Error deleting letter:', err);
    }
  };

  return (
    <section id="letters" className="letters-section">
      <div className="container">
        <div className="section-header">
          <h2>Letters Board</h2>
          <div className="divider-gold"></div>
          <p>A safe, cozy corner for letters, stories, and thoughts written directly for her. Click to open and read.</p>
        </div>

        {/* Admin Section: Writing Pad */}
        {isAdmin && (
          <div className="admin-actions-wrap">
            <button className="btn btn-outline" onClick={() => setShowAddForm(!showAddForm)}>
              <Edit3 size={18} />
              {showAddForm ? 'Close Letter Pad' : 'Write a New Letter'}
            </button>

            {showAddForm && (
              <form onSubmit={handleSaveLetter} className="glass-card letter-writer-form animate-fade-in">
                <h3>Write a Letter</h3>
                <p className="form-tip">Express your heart. It will be saved permanently to the board.</p>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Letter Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Happy Birthday, Bestie!"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Message Content</label>
                  <textarea
                    className="form-control letter-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Dear Bestie, today I want to tell you how awesome you are..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Seal & Save Letter</button>
              </form>
            )}
          </div>
        )}

        {/* Letters Grid */}
        {loading ? (
          <div className="loading-spinner">Opening safe...</div>
        ) : letters.length === 0 ? (
          <div className="no-letters">
            <p>The letters board is currently empty.</p>
            {isAdmin && <p className="sub-tip">Click "Write a New Letter" above to create the first letter!</p>}
          </div>
        ) : (
          <div className="letters-grid">
            {letters.map((letter) => (
              <div 
                key={letter.id} 
                className="envelope-card glass-card animate-fade-in"
                onClick={() => setActiveLetter(letter)}
              >
                <div className="envelope-stamp">
                  <Mail className="mail-icon" size={24} />
                </div>
                <h3>{letter.title}</h3>
                <span className="envelope-date">
                  <Calendar size={12} />
                  {letter.date ? new Date(letter.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Special Day'}
                </span>
                <p className="envelope-preview">
                  {letter.content.substring(0, 80)}...
                </p>
                <div className="envelope-footer">
                  <span>Open Letter</span>
                </div>
                {isAdmin && (
                  <button 
                    className="btn-delete letter-delete-btn" 
                    onClick={(e) => handleDelete(letter.id, e)}
                    title="Delete Letter"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Letter Reading Pad Modal */}
      {activeLetter && (
        <div className="letter-overlay" onClick={() => setActiveLetter(null)}>
          <div className="letter-paper animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="letter-close" onClick={() => setActiveLetter(null)}>
              <X size={24} />
            </button>
            <div className="letter-paper-header">
              <MailOpen className="mail-open-icon" size={32} />
              <h2>{activeLetter.title}</h2>
              <span className="letter-paper-date">
                <Calendar size={14} />
                {activeLetter.date ? new Date(activeLetter.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Special Day'}
              </span>
            </div>
            <div className="letter-paper-body">
              {activeLetter.content.split('\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
            <div className="letter-paper-footer">
              <p>With Warm Regards,</p>
              <p className="signature">Your Pichidi</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
