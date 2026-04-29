# 🎬 Movie Streaming Platform

Nền tảng xem phim trực tuyến với giao diện hiện đại, hỗ trợ Dark/Light Mode.

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Công Nghệ](#-công-nghệ)
- [Cài Đặt](#-cài-đặt)
- [Sử Dụng](#-sử-dụng)
- [Git Workflow](#-git-workflow)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Scripts](#-scripts)

---

## ✨ Tính Năng

### Đã Hoàn Thành ✅
- 🎨 **Dark/Light Mode** - Chuyển đổi theme mượt mà với CSS Variables
- 🔍 **Advanced Search** - Tìm kiếm nâng cao theo diễn viên, đạo diễn, năm, thể loại
- 🔔 **Notifications** - Hệ thống thông báo với badge và dropdown
- 👤 **User Authentication** - Đăng nhập, đăng ký, quản lý profile
- 🎥 **Movie Management** - CRUD phim, diễn viên, đạo diễn, thể loại
- 💬 **Comments** - Bình luận và đánh giá phim
- ⭐ **Ratings** - Hệ thống đánh giá sao
- 📊 **Admin Dashboard** - Quản trị viên với thống kê chi tiết
- 📱 **Responsive Design** - Tương thích mọi thiết bị

### Đang Phát Triển 🚧
- 📝 **User Reviews** - Viết review chi tiết
- 📋 **Playlists** - Tạo danh sách phát riêng
- 🔔 **Real-time Notifications** - Thông báo thời gian thực
- 🎯 **Recommendations** - Gợi ý phim thông minh

---

## 🛠️ Công Nghệ

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

## 📦 Cài Đặt

### Yêu Cầu
- Node.js >= 14.x
- MongoDB >= 4.x
- npm >= 6.x

### Bước 1: Clone Repository
```bash
git clone https://github.com/username/movie-app.git
cd movie-app
```

### Bước 2: Cài Đặt Dependencies

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

### Bước 3: Cấu Hình Environment

Tạo file `server/.env`:
```env
DB_URL=mongodb://localhost:27017/movie
PORT=3001
JWT_SECRET=your_jwt_secret_key_here
```

### Bước 4: Import Database

```bash
cd server
npm run import
```

### Bước 5: Tạo Admin Account

```bash
npm run reset-admin
```

Thông tin đăng nhập:
- **Username**: admin
- **Password**: admin123

---

## 🚀 Sử Dụng

### Development Mode

#### Terminal 1 - Server
```bash
cd server
npm run dev
```
Server chạy tại: http://localhost:3001

#### Terminal 2 - Client
```bash
cd client
npm start
```
Client chạy tại: http://localhost:3000

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

### Tạo Branch Mới
```bash
git checkout -b feature/ten-tinh-nang
```

### Commit Code
```bash
git add .
git commit -m "feat: Add ten-tinh-nang"
```

### Merge về Master
```bash
git checkout master
git merge feature/ten-tinh-nang
```

### Đọc Thêm
- 📚 [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) - Hướng dẫn Git đầy đủ
- ⚡ [QUICK_GIT_REFERENCE.md](./QUICK_GIT_REFERENCE.md) - Tra cứu nhanh
- 📊 [GIT_PRACTICE_SUMMARY.md](./GIT_PRACTICE_SUMMARY.md) - Tóm tắt thực hành

---

## 📁 Cấu Trúc Dự Án

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
npm run dev          # Start server với nodemon
npm start            # Start server production
npm run import       # Import database từ JSON
npm run clear        # Xóa toàn bộ database
npm run reset-admin  # Tạo/reset admin account
npm run fix-avatars  # Fix avatar URLs
npm run test-user    # Tạo test user
```

### Client Scripts

```bash
npm start            # Start development server
npm run build        # Build production
npm test             # Run tests
npm run eject        # Eject CRA (không khuyến khích)
```

---

## 🎨 Theme System

Dự án sử dụng **CSS Variables** cho Dark/Light Mode:

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

### Sử dụng trong Component
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
// Middleware kiểm tra JWT token
const authMiddleware = require('./middlewares/authMiddleware');

router.get('/profile', authMiddleware, getProfile);
```

---

## 📊 API Endpoints

### Movies
- `GET /api/movies` - Lấy danh sách phim
- `GET /api/movies/:id` - Lấy chi tiết phim
- `POST /api/movies` - Tạo phim mới (Admin)
- `PUT /api/movies/:id` - Cập nhật phim (Admin)
- `DELETE /api/movies/:id` - Xóa phim (Admin)

### Users
- `POST /api/users/login` - Đăng nhập
- `POST /api/users/register` - Đăng ký
- `GET /api/users/profile` - Lấy profile
- `PUT /api/users/profile` - Cập nhật profile

### Comments
- `GET /api/comments/movie/:movieId` - Lấy comments của phim
- `POST /api/comments` - Tạo comment mới
- `DELETE /api/comments/:id` - Xóa comment

---

## 🤝 Contributing

### Quy Trình Đóng Góp

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

### Commit Convention

Sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Tính năng mới
- `fix:` - Sửa lỗi
- `docs:` - Cập nhật tài liệu
- `style:` - CSS/styling
- `refactor:` - Tái cấu trúc code
- `test:` - Thêm test
- `chore:` - Công việc khác

---

## 📝 License

MIT License - Xem file [LICENSE](./LICENSE) để biết thêm chi tiết.

---

## 👥 Authors

- **Phạm Ngọc Anh** - [phamngocanhtb03@gmail.com](mailto:phamngocanhtb03@gmail.com)

---

## 🙏 Acknowledgments

- React Team
- Express Team
- MongoDB Team
- Tất cả contributors

---

## 📞 Support

Nếu có vấn đề, hãy:
1. Đọc [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
2. Kiểm tra [Issues](https://github.com/username/movie-app/issues)
3. Tạo issue mới
4. Liên hệ: phamngocanhtb03@gmail.com

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

- **Total Commits**: 6
- **Total Files**: 240+
- **Lines of Code**: 62,000+
- **Components**: 50+
- **API Endpoints**: 30+

---

**Made with ❤️ by Phạm Ngọc Anh**
