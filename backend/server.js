import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Resolve directory paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Ensure public/uploads directories exist
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded static files
app.use('/uploads', express.static(uploadDir));

// Helper functions to read/write JSON db
const DB_PATH = path.join(__dirname, 'db.json');

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { timeline: [], letters: [], gallery: [], talents: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { timeline: [], letters: [], gallery: [], talents: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'photo-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// API: Letters
app.get('/api/letters', (req, res) => {
  const db = readDb();
  res.json(db.letters || []);
});

app.post('/api/letters', (req, res) => {
  const { title, content, date } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and Content are required.' });
  }

  const db = readDb();
  const newLetter = {
    id: 'l_' + Date.now(),
    title,
    content,
    date: date || new Date().toISOString().split('T')[0]
  };

  db.letters = db.letters || [];
  db.letters.push(newLetter);
  writeDb(db);

  res.status(201).json(newLetter);
});

app.delete('/api/letters/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.letters = (db.letters || []).filter(item => item.id !== id);
  writeDb(db);
  res.json({ message: 'Letter deleted successfully.' });
});

// API: Gallery
app.get('/api/gallery', (req, res) => {
  const db = readDb();
  res.json(db.gallery || []);
});

app.post('/api/gallery', upload.single('photo'), (req, res) => {
  const { title, category, caption, date } = req.body;
  let fileUrl = '';

  if (req.file) {
    // Save path relative to server root
    fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  } else if (req.body.url) {
    fileUrl = req.body.url;
  }

  if (!fileUrl) {
    return res.status(400).json({ error: 'Please upload a photo or provide a photo URL.' });
  }

  const db = readDb();
  const newPhoto = {
    id: 'g_' + Date.now(),
    url: fileUrl,
    title: title || 'Memory Photo',
    category: category || 'memories',
    caption: caption || '',
    date: date || new Date().toISOString().split('T')[0]
  };

  db.gallery = db.gallery || [];
  db.gallery.push(newPhoto);
  writeDb(db);

  res.status(201).json(newPhoto);
});

app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const photo = (db.gallery || []).find(item => item.id === id);

  if (photo && photo.url && photo.url.includes('/uploads/')) {
    const filename = photo.url.split('/uploads/')[1];
    const filepath = path.join(uploadDir, filename);
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
  }

  db.gallery = (db.gallery || []).filter(item => item.id !== id);
  writeDb(db);
  res.json({ message: 'Photo deleted successfully.' });
});

// API: Gallery Edit
app.put('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const { title, category, caption, date } = req.body;

  const db = readDb();
  const photoIndex = (db.gallery || []).findIndex(item => item.id === id);

  if (photoIndex === -1) {
    return res.status(404).json({ error: 'Photo not found.' });
  }

  db.gallery[photoIndex] = {
    ...db.gallery[photoIndex],
    title: title !== undefined ? title : db.gallery[photoIndex].title,
    category: category !== undefined ? category : db.gallery[photoIndex].category,
    caption: caption !== undefined ? caption : db.gallery[photoIndex].caption,
    date: date !== undefined ? date : db.gallery[photoIndex].date
  };

  writeDb(db);
  res.json(db.gallery[photoIndex]);
});

// API: Timeline
app.get('/api/timeline', (req, res) => {
  const db = readDb();
  res.json(db.timeline || []);
});

app.post('/api/timeline', upload.single('photo'), (req, res) => {
  const { year, title, description } = req.body;
  let imageUrl = req.body.image || '';

  if (req.file) {
    imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  }

  if (!year || !title || !description) {
    return res.status(400).json({ error: 'Year, title, and description are required.' });
  }

  const db = readDb();
  const newTimelineItem = {
    id: 't_' + Date.now(),
    year,
    title,
    description,
    image: imageUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80'
  };

  db.timeline = db.timeline || [];
  db.timeline.push(newTimelineItem);
  writeDb(db);

  res.status(201).json(newTimelineItem);
});

app.delete('/api/timeline/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const item = (db.timeline || []).find(i => i.id === id);

  if (item && item.image && item.image.includes('/uploads/')) {
    const filename = item.image.split('/uploads/')[1];
    const filepath = path.join(uploadDir, filename);
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
  }

  db.timeline = (db.timeline || []).filter(item => item.id !== id);
  writeDb(db);
  res.json({ message: 'Timeline item deleted successfully.' });
});

// API: Talents
app.get('/api/talents', (req, res) => {
  const db = readDb();
  res.json(db.talents || []);
});

app.post('/api/talents', (req, res) => {
  const { title, description, icon, rating } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const db = readDb();
  const newTalent = {
    id: 'ta_' + Date.now(),
    title,
    description,
    icon: icon || 'Star',
    rating: parseInt(rating) || 5
  };

  db.talents = db.talents || [];
  db.talents.push(newTalent);
  writeDb(db);

  res.status(201).json(newTalent);
});

app.delete('/api/talents/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.talents = (db.talents || []).filter(item => item.id !== id);
  writeDb(db);
  res.json({ message: 'Talent deleted successfully.' });
// Serve frontend static build in production
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
