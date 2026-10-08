# 🎂 Birthday Memories Website (October 9)

A premium, fully interactive full-stack web application designed as a birthday tribute to your friend (October 9). This website showcases a 3-year timeline of friendship, an uploadable photo gallery, a highlights panel for her talents/hobbies, and a letters board where you can leave personal notes.

---

## ✨ Features

- **Dynamic Countdown Clock**: Counts down the days, hours, minutes, and seconds to October 9.
- **Interactive Wishes Card**: A gorgeous 3D flipping wish card with a customizable birthday greeting.
- **Theme Music Player**: Integrates background music with play/pause controls.
- **Our Journey (3-Year Timeline)**: An animated scrollable timeline documenting memories.
- **Filtered Photo Gallery**: Supports separate categories:
  - All Photos
  - Childhood
  - Memories
  - **Her Favourite Persons** (as requested)
- **Talents Showcase**: Modern dynamic cards displaying her skills (e.g. art, singing, writing) with star ratings.
- **Letters board**: A cozy safe styled after vintage envelopes that expand to show heartfelt letters.
- **Full-Stack Admin controls**:
  - Secure login page/modal using the birthdate passcode (`1009`).
  - Ability to write letters, upload photos directly from your computer, and add new timeline milestones or talents.
  - Delete features to manage current entries.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Lucide Icons, and Vanilla CSS (Glassmorphism & Gold/Rose accents).
- **Backend**: Node.js, Express, Multer (file uploads).
- **Database**: Portably persistent JSON-based database (`backend/db.json`).

---

## 🚀 How to Run Locally

### 1. Prerequisite
Ensure you have **Node.js** installed on your system.

### 2. Startup Dev Servers
In the project root directory, run:

```bash
# Install dependencies for both frontend and backend
npm run install-all

# Start both servers (Frontend: port 5173, Backend: port 5000)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Administrator Customization

1. Click on **Creator Access** in the top right corner.
2. Enter the passcode: `1009` (for October 9th).
3. Once logged in:
   - You will see buttons like **Upload New Photo**, **Write a New Letter**, **Add Journey Memory**, and **Add Talent Highlight**.
   - You will also see **Delete (Trash bin)** icons on all items, allowing you to remove the default placeholders and add your own customized contents.
   - Any uploaded photos are saved directly inside `backend/public/uploads` and your data is stored in `backend/db.json`.

---

## ⚙️ How to Change Custom Configs

- **Passcode**: Open [Navbar.jsx](file:///c:/Users/Mahesh/OneDrive/Dokumen/Desktop/photos%20website/frontend/src/components/Navbar.jsx) and edit line `27` where passcode is verified (`1009`).
- **Music Track**: Open [Hero.jsx](file:///c:/Users/Mahesh/OneDrive/Dokumen/Desktop/photos%20website/frontend/src/components/Hero.jsx) and change the `src` attribute of the `<audio>` tag to any MP3 file link you'd like.
