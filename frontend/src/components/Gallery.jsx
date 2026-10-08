import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Upload, Eye, Edit3, Check } from 'lucide-react';
import './Gallery.css';

export default function Gallery({ isAdmin }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('memories');
  const [caption, setCaption] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [date, setDate] = useState('');

  // Inline editing & direct upload states
  const [editingId, setEditingId] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [isDirectUploading, setIsDirectUploading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gallery');
      const data = await response.json();
      setPhotos(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setLoading(false);
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!photoFile && !imageUrl) {
      alert('Please upload a photo or provide a photo URL.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('caption', caption);
    formData.append('date', date);

    if (photoFile) {
      formData.append('photo', photoFile);
    } else if (imageUrl) {
      formData.append('url', imageUrl);
    }

    try {
      const response = await fetch('http://localhost:5000/api/gallery', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        fetchPhotos();
        setTitle('');
        setCategory('memories');
        setCaption('');
        setPhotoFile(null);
        setImageUrl('');
        setDate('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Error adding photo:', err);
    }
  };

  const handleDirectUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsDirectUploading(true);
    for (const file of files) {
      const formData = new FormData();
      // Use filename without extension as default title
      const fileTitle = file.name.substring(0, file.name.lastIndexOf('.')) || 'Direct Photo';
      formData.append('title', fileTitle);
      
      // Default to favorites if filter is favorites, otherwise memories
      const targetCategory = filter === 'favorites' ? 'favorites' : 'memories';
      formData.append('category', targetCategory);
      formData.append('caption', ''); // Uploaded directly without description
      formData.append('photo', file);

      try {
        await fetch('http://localhost:5000/api/gallery', {
          method: 'POST',
          body: formData
        });
      } catch (err) {
        console.error('Error in direct upload:', err);
      }
    }
    setIsDirectUploading(false);
    fetchPhotos();
  };

  const handleUpdateCaption = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: editCaption })
      });

      if (response.ok) {
        const updatedPhoto = await response.json();
        setPhotos(photos.map(p => p.id === id ? updatedPhoto : p));
        setEditingId(null);
        setEditCaption('');
      }
    } catch (err) {
      console.error('Error updating caption:', err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent opening lightbox
    if (!window.confirm('Are you sure you want to delete this photo from the gallery?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setPhotos(photos.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
    }
  };

  const filteredPhotos = filter === 'all' 
    ? photos 
    : photos.filter(p => p.category === filter);

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div className="section-header">
          <h2>Gallery Board</h2>
          <div className="divider-gold"></div>
          <p>A beautiful collage of her life and our memories, filtered by special phases.</p>
        </div>

        {/* Gallery Filter Categories */}
        <div className="gallery-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Pics
          </button>
          <button 
            className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
            onClick={() => setFilter('favorites')}
          >
            Her Favourite Persons
          </button>
        </div>

        {/* Admin actions */}
        {isAdmin && (
          <div className="admin-actions-wrap" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button className="btn btn-outline" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus size={18} />
              {showAddForm ? 'Cancel Upload' : 'Upload with Details'}
            </button>

            <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={18} />
              {isDirectUploading ? 'Uploading...' : 'Quick Direct Upload'}
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleDirectUpload}
                disabled={isDirectUploading}
              />
            </label>

            {showAddForm && (
              <form onSubmit={handleAddPhoto} className="glass-card add-photo-form animate-fade-in">
                <h3>Upload a Photo to Gallery</h3>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Photo Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Cozy Evening or Cute Childhood Smile"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      className="form-control" 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="photos">All Pics</option>
                      <option value="favorites">Her Favourite Persons</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Caption / Memory Note</label>
                  <textarea
                    className="form-control"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a sweet caption or memory details..."
                  ></textarea>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Select Photo File</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setPhotoFile(e.target.files[0])}
                    />
                  </div>
                  <div className="form-group">
                    <label>Or Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      disabled={photoFile !== null}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Date Captured (Optional)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  <Upload size={18} />
                  Add Photo
                </button>
              </form>
            )}
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="loading-spinner">Loading gallery board...</div>
        ) : filteredPhotos.length === 0 ? (
          <div className="no-photos">No photos found in this category.</div>
        ) : (
          <div className="gallery-grid">
            {filteredPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="gallery-card glass-card animate-fade-in"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="gallery-img-wrapper">
                  <img src={photo.url} alt={photo.title} loading="lazy" />
                  <div className="gallery-img-hover">
                    <Eye size={24} className="hover-eye-icon" />
                    <span>View Memory</span>
                  </div>
                </div>
                <div className="gallery-info" onClick={(e) => editingId === photo.id && e.stopPropagation()}>
                  <h4>{photo.title}</h4>
                  
                  {editingId === photo.id ? (
                    <div className="edit-caption-container" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="form-control edit-caption-textarea"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        placeholder="Write a description about her..."
                        autoFocus
                        style={{ minHeight: '80px', marginBottom: '0.5rem', fontSize: '0.9rem' }}
                      />
                      <div className="edit-caption-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-primary btn-save-caption"
                          onClick={() => handleUpdateCaption(photo.id)}
                          style={{ padding: '0.4rem 0.8rem', borderRadius: '5px', fontSize: '0.8rem' }}
                        >
                          <Check size={12} /> Save
                        </button>
                        <button 
                          className="btn btn-outline btn-cancel-caption"
                          onClick={() => setEditingId(null)}
                          style={{ padding: '0.4rem 0.8rem', borderRadius: '5px', fontSize: '0.8rem' }}
                        >
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>{photo.caption || <span className="no-description" style={{ fontStyle: 'italic', opacity: 0.5 }}>No description yet. Click below to add one!</span>}</p>
                      {isAdmin && (
                        <button
                          className="btn-edit-caption"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent lightbox
                            setEditingId(photo.id);
                            setEditCaption(photo.caption || '');
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--gold)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0',
                            marginBottom: '0.5rem',
                            transition: 'var(--transition)'
                          }}
                        >
                          <Edit3 size={12} /> Write/Edit Description
                        </button>
                      )}
                    </>
                  )}

                  <span className="gallery-date">
                    {photo.date ? new Date(photo.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : ''}
                  </span>
                </div>
                {isAdmin && (
                  <button 
                    className="btn-delete gallery-delete-btn" 
                    onClick={(e) => handleDelete(photo.id, e)}
                    title="Delete Photo"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="lightbox-overlay" onClick={() => setSelectedPhoto(null)}>
          <button className="lightbox-close" onClick={() => setSelectedPhoto(null)}>
            <X size={32} />
          </button>
          <div className="lightbox-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.url} alt={selectedPhoto.title} />
            <div className="lightbox-details glass-card">
              <h3>{selectedPhoto.title}</h3>
              <p>{selectedPhoto.caption}</p>
              {selectedPhoto.date && (
                <span className="lightbox-date">
                  Captured on: {new Date(selectedPhoto.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
