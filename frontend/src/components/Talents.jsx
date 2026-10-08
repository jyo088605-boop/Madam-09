import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Star, Instagram, ExternalLink, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import './Talents.css';

export default function Talents({ isAdmin }) {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTalentImg, setSelectedTalentImg] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Star');
  const [rating, setRating] = useState(5);

  const availableIcons = ['Palette', 'Music', 'PenTool', 'Camera', 'BookOpen', 'Award', 'Code', 'Heart', 'Sparkles', 'Star'];

  useEffect(() => {
    fetchTalents();
  }, []);

  const fetchTalents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/talents');
      const data = await response.json();
      setTalents(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching talents:', err);
      setLoading(false);
    }
  };

  const handleAddTalent = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      const response = await fetch('http://localhost:5000/api/talents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, icon, rating })
      });

      if (response.ok) {
        fetchTalents();
        setTitle('');
        setDescription('');
        setIcon('Star');
        setRating(5);
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Error adding talent:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this talent card?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/talents/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setTalents(talents.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Error deleting talent:', err);
    }
  };

  // Helper to render star ratings
  const renderStars = (num) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < num ? 'star-icon filled' : 'star-icon'} 
      />
    ));
  };

  return (
    <section id="talents" className="talents-section">
      <div className="container">
        <div className="section-header">
          <h2>Her Talent & Hobbies</h2>
          <div className="divider-gold"></div>
          <p>Highlighting the qualities, skills, and talents that make her an incredibly unique and outstanding person.</p>
        </div>

        {isAdmin && (
          <div className="admin-actions-wrap">
            <button className="btn btn-outline" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus size={18} />
              {showAddForm ? 'Cancel' : 'Add Talent Highlight'}
            </button>

            {showAddForm && (
              <form onSubmit={handleAddTalent} className="glass-card add-talent-form animate-fade-in">
                <h3>Add Talent Highlight</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Talent Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Photography, Public Speaking"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Rating (out of 5)</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Icon Style</label>
                    <select 
                      className="form-control" 
                      value={icon} 
                      onChange={(e) => setIcon(e.target.value)}
                    >
                      {availableIcons.map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group icon-preview-wrap">
                    <label>Icon Preview</label>
                    <div className="icon-preview-box">
                      {React.createElement(Icons[icon] || Icons.Star, { size: 24 })}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Talent Description</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe how amazing she is in this area..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Save Talent</button>
              </form>
            )}
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading talents board...</div>
        ) : (
          <div className="talents-grid">
            {talents.map((talent) => {
              const IconComp = Icons[talent.icon] || Icons.Star;
              return (
                <div key={talent.id} className="talent-card glass-card animate-fade-in">
                  {isAdmin && (
                    <button className="btn-delete talent-delete-btn" onClick={() => handleDelete(talent.id)} title="Delete Talent">
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="talent-icon-box">
                    <IconComp className="talent-icon" size={28} />
                  </div>
                  <h3>{talent.title}</h3>
                  <p>{talent.description}</p>

                  {talent.images && talent.images.length > 0 && (
                    <div className="talent-images-grid">
                      {talent.images.map((img, idx) => (
                        <div 
                          key={idx} 
                          className="talent-img-wrapper" 
                          onClick={() => setSelectedTalentImg(img)}
                          title="Click to view full photo"
                        >
                          <img src={img} alt={`${talent.title} stage performance ${idx + 1}`} loading="lazy" />
                          <div className="talent-img-overlay">
                            <span>View Photo</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="talent-rating">
                    {renderStars(talent.rating)}
                  </div>
                  {talent.link && (
                    <a 
                      href={talent.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="talent-link-btn"
                    >
                      <Instagram size={16} />
                      <span>{talent.linkText || 'Listen to Her Songs'}</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Talent Image Lightbox */}
        {selectedTalentImg && (
          <div className="lightbox-overlay animate-fade-in" onClick={() => setSelectedTalentImg(null)}>
            <button className="lightbox-close" onClick={() => setSelectedTalentImg(null)}>
              <X size={32} />
            </button>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={selectedTalentImg} alt="Stage Performance" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
