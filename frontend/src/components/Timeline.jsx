import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Plus, Image, Sparkles } from 'lucide-react';
import './Timeline.css';

export default function Timeline({ isAdmin }) {
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/timeline');
      const data = await response.json();
      setTimelineItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setLoading(false);
    }
  };

  const handleAddTimeline = async (e) => {
    e.preventDefault();
    if (!year || !title || !description) return;

    const formData = new FormData();
    formData.append('year', year);
    formData.append('title', title);
    formData.append('description', description);
    if (photo) {
      formData.append('photo', photo);
    } else if (imageUrl) {
      formData.append('image', imageUrl);
    }

    try {
      const response = await fetch('http://localhost:5000/api/timeline', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        fetchTimeline();
        setYear('');
        setTitle('');
        setDescription('');
        setPhoto(null);
        setImageUrl('');
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding timeline item:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this memory?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/timeline/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setTimelineItems(timelineItems.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting timeline item:', error);
    }
  };

  return (
    <section id="timeline" className="timeline-section">
      <div className="container">
        <div className="section-header">
          <h2>Our Journey Together</h2>
          <div className="divider-gold"></div>
          <p>Tracing our friendship over the last 3 years, from early childhood memories to the present day.</p>
        </div>

        {isAdmin && (
          <div className="admin-actions-wrap">
            <button className="btn btn-outline" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus size={18} />
              {showAddForm ? 'Cancel New Memory' : 'Add Journey Memory'}
            </button>

            {showAddForm && (
              <form onSubmit={handleAddTimeline} className="glass-card add-timeline-form animate-fade-in">
                <h3>Add a Journey Milestone</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Year / Milestone Title (e.g., Year 1 (2024))</label>
                    <input
                      type="text"
                      className="form-control"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="e.g., Year 1 (2024) or Childhood"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Milestone Headline</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., The Day We Met"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Story / Description</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this beautiful phase of friendship..."
                    required
                  ></textarea>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Upload Memory Photo</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                  </div>
                  <div className="form-group">
                    <label>Or Paste Photo URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      disabled={photo !== null}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">Save Memory</button>
              </form>
            )}
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading our story...</div>
        ) : (
          <div className="timeline-container">
            <div className="timeline-line"></div>
            {timelineItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              >
                <div className="timeline-dot">
                  <Calendar size={16} />
                </div>
                <div className="timeline-content glass-card">
                  {isAdmin && (
                    <button className="btn-delete" onClick={() => handleDelete(item.id)} title="Delete Milestone">
                      <Trash2 size={16} />
                    </button>
                  )}
                  <span className="timeline-date">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.image && (
                    <div className="timeline-img-wrapper">
                      <img src={item.image} alt={item.title} loading="lazy" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
