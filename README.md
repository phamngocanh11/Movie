# 🎬 Movie Streaming Platform

A modern online movie streaming platform with Dark/Light Mode support.

## 📋 Table of Contents

- [Features](#-features)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Usage](#-usage)
- [Git Workflow](#-git-workflow)
- [Project Structure](#-project-structure)
- [Scripts](#-scripts)

---

## ✨ Features

### Completed ✅
- 🎨 **Dark/Light Mode** - Smooth theme switching with CSS Variables
- 🔍 **Advanced Search** - Search by actor, director, year, and genre
- 🔔 **Notifications** - Notification system with badge and dropdown
- 👤 **User Authentication** - Login, register, and profile management
- 🎥 **Movie Management** - CRUD operations for movies, actors, directors, and categories
- 💬 **Comments** - Comment and review movies
- ⭐ **Ratings** - Star rating system
- 📊 **Admin Dashboard** - Admin panel with detailed statistics
- 📱 **Responsive Design** - Compatible with all devices

### In Development 🚧
- 📝 **User Reviews** - Write detailed reviews
- 📋 **Playlists** - Create custom playlists
- 🔔 **Real-time Notifications** - Real-time notification system
- 🎯 **Recommendations** - Smart movie recommendations

---

## 🛠️ Technologies

### Frontend
- **React 18** - UI Library
- **React Router v6** - Routing
- **CSS Variables** - Theming
- **React Icons** - Icons
- **Axios** - HTTP Client

### Backend
- **Node.js** - Runtime
- **Express** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password Hashing

### Tools
- **Git** - Version Control
- **npm** - Package Manager
- **Nodemon** - Development

---

## 📦 Installation

### Requirements
- Node.js >= 14.x
- MongoDB >= 4.x
- npm >= 6.x

### Step 1: Clone Repository
```bash
git clone https://github.com/username/movie-app.git
cd movie-app
```

### Step 2: Install Dependencies

#### Server
```bash
cd server
npm install
```

#### Client
```bash
cd client
npm install
```

### Step 3: Environment Configuration

Create `server/.env` file:
```env
DB_URL=mongodb://localhost:27017/movie
PORT=3001
JWT_SECRET=your_jwt_secret_key_here
```

### Step 4: Import Database

```bash
cd server
npm run import
```

### Step 5: Create Admin Account

```bash
npm run reset-admin
```

Login credentials:
- **Username**: admin
- **Password**: admin123

---

## 🚀 Usage

### Development Mode

#### Terminal 1 - Server
```bash
cd server
npm run dev
```
Server runs at: http://localhost:3001

#### Terminal 2 - Client
```bash
cd client
npm start
```
Client runs at: http://localhost:3000

### Production Mode

#### Build Client
```bash
cd client
npm run build
```

#### Start Server
```bash
cd server
npm start
```

---

## 🌳 Git Workflow

### Create New Branch
```bash
git checkout -b feature/feature-name
```

### Commit Code
```bash
git add .
git commit -m "feat: Add feature-name"
```

### Merge to Master
```bash
git checkout master
git merge feature/feature-name
```

### Read More
- 📚 [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) - Complete Git guide
- ⚡ [QUICK_GIT_REFERENCE.md](./QUICK_GIT_REFERENCE.md) - Quick reference
- 📊 [GIT_PRACTICE_SUMMARY.md](./GIT_PRACTICE_SUMMARY.md) - Practice summary

---

## 📁 Project Structure

```
movie-app/
├── client/                 # React Frontend
│   ├── public/
│   └── src/
│       ├── components/     # React Components
│       │   ├── Admin/
│       │   ├── AdvancedSearch/    ✨ NEW
│       │   ├── Notification/      ✨ NEW
│       │   ├── ThemeToggle/
│       │   └── ...
│       ├── contexts/       # React Contexts
│       │   ├── ThemeContext.jsx
│       │   └── FavoriteContext.jsx
│       ├── pages/          # Page Components
│       ├── services/       # API Services
│       ├── layouts/        # Layout Components
│       └── index.css       # Global Styles + CSS Variables
│
├── server/                 # Node.js Backend
│   ├── config/            # Configuration
│   ├── controllers/       # Route Controllers
│   ├── models/            # Mongoose Models
│   ├── routes/            # API Routes
│   ├── middlewares/       # Middlewares
│   ├── scripts/           # Utility Scripts
│   │   ├── importData.js
│   │   ├── clearData.js
│   │   ├── resetAdmin.js
│   │   └── fixAvatars.js
│   └── server.js          # Entry Point
│
├── lythuyet/              # Database JSON Files
│   ├── movie.actors.json
│   ├── movie.categories.json
│   ├── movie.directors.json
│   ├── movie.movies.json
│   └── ...
│
├── .gitignore
├── GIT_WORKFLOW.md        # Git Guide
├── QUICK_GIT_REFERENCE.md # Git Quick Reference
├── GIT_PRACTICE_SUMMARY.md # Git Practice Summary
└── README.md              # This file
```

---

## 📜 Scripts

### Server Scripts

```bash
npm run dev          # Start server with nodemon
npm start            # Start production server
npm run import       # Import database from JSON
npm run clear        # Clear entire database
npm run reset-admin  # Create/reset admin account
npm run fix-avatars  # Fix avatar URLs
npm run test-user    # Create test user
```

### Client Scripts

```bash
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run eject        # Eject from CRA (not recommended)
```

---

## 🎨 Theme System

The project uses **CSS Variables** for Dark/Light Mode:

### Light Mode
```css
--bg-primary: #f8fafc;
--text-primary: #0f172a;
--accent-color: #e94560;
```

### Dark Mode
```css
--bg-primary: #000000;
--text-primary: #ffffff;
--accent-color: #e94560;
```

### Usage in Components
```jsx
import { useTheme } from '../../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};
```

---

## 🔐 Authentication

### Login
```javascript
POST /api/users/login
{
  "username": "admin",
  "password": "admin123"
}
```

### Register
```javascript
POST /api/users/register
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Routes
```javascript
// Middleware to check JWT token
const authMiddleware = require('./middlewares/authMiddleware');

router.get('/profile', authMiddleware, getProfile);
```

---

## 📊 API Endpoints

### Movies
- `GET /api/movies` - Get movie list
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Create new movie (Admin)
- `PUT /api/movies/:id` - Update movie (Admin)
- `DELETE /api/movies/:id` - Delete movie (Admin)

### Users
- `POST /api/users/login` - Login
- `POST /api/users/register` - Register
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile

### Comments
- `GET /api/comments/movie/:movieId` - Get movie comments
- `POST /api/comments` - Create new comment
- `DELETE /api/comments/:id` - Delete comment

---

## 🤝 Contributing

### Contribution Process

1. Fork the repository
2. Create a new branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Create a Pull Request

### Commit Convention

Using [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation update
- `style:` - CSS/styling
- `refactor:` - Code refactoring
- `test:` - Add tests
- `chore:` - Other tasks

---

## 📝 License

MIT License - See [LICENSE](./LICENSE) file for details.

---

## 👥 Authors

- **Pham Ngoc Anh** - [phamngocanhtb03@gmail.com](mailto:phamngocanhtb03@gmail.com)

---

## 🙏 Acknowledgments

- React Team
- Express Team
- MongoDB Team
- All contributors

---

## 📞 Support

If you have any issues:
1. Read [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
2. Check [Issues](https://github.com/username/movie-app/issues)
3. Create a new issue
4. Contact: phamngocanhtb03@gmail.com

---

## 🎯 Roadmap

### Phase 1 - Core Features ✅
- [x] Authentication
- [x] Movie CRUD
- [x] Comments & Ratings
- [x] Dark/Light Mode
- [x] Admin Dashboard

### Phase 2 - Advanced Features 🚧
- [x] Advanced Search
- [x] Notifications
- [ ] User Reviews
- [ ] Playlists
- [ ] Watch History

### Phase 3 - Future Features 📅
- [ ] Real-time Chat
- [ ] AI Recommendations
- [ ] Mobile App
- [ ] Video Streaming
- [ ] Subtitles Support

---

## 📈 Stats

- **Total Commits**: 8
- **Total Files**: 240+
- **Lines of Code**: 62,000+
- **Components**: 50+
- **API Endpoints**: 30+

---

**Made with ❤️ by Pham Ngoc Anh**
