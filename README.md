# Movie Streaming Platform

Fullstack movie streaming web application built with React, Node.js, Express and MongoDB. The project includes a user-facing movie website, video playback, favorites, comments, ratings, watch history and an admin dashboard for managing system data.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Scripts](#scripts)
- [Main API Endpoints](#main-api-endpoints)
- [Roadmap](#roadmap)
- [Author](#author)

## Features

### User

- Register, login, logout and role-based navigation
- Google OAuth login
- Email verification after registration
- Forgot password with reset link
- Browse movies by section, category and filters
- Advanced search by keyword, actor, director, year and genre
- Movie detail page with metadata, trailer, comments and ratings
- Video playback with ReactPlayer
- Continue watching and resume modal
- Favorite movies list
- Profile information, avatar upload and password change
- Dark/Light mode

### Admin

- Admin dashboard with overview statistics
- CRUD movies
- CRUD users
- CRUD categories
- CRUD actors
- CRUD directors
- CRUD manufacturers
- Image upload with Cloudinary
- Protected admin routes with JWT and role middleware

### Notes

- Notification UI is currently a frontend mock component. Realtime notifications are planned for future development.
- Video sources can use direct video URLs or labeled source strings such as `Full|https://example.com/index.m3u8`.
- Advanced streaming controls such as adaptive quality selection and dynamic subtitles are future improvements.

## Tech Stack

### Frontend

- React 18
- React Router DOM v6
- Axios
- React Icons
- Swiper
- Sonner
- ReactPlayer
- hls.js
- CSS custom files with CSS Variables

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- Cloudinary
- Nodemailer
- Swagger UI
- Winston logger

### Tooling

- npm
- Nodemon
- Node test runner

## Project Structure

```text
movie/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       └── config/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── test/
│   ├── utils/
│   └── server.js
│
└── README.md
```

## Installation

### Requirements

- Node.js 18 or newer
- npm
- MongoDB local or MongoDB Atlas

### Clone repository

```bash
git clone https://github.com/your-username/movie.git
cd movie
```

### Install server dependencies

```bash
cd server
npm install
```

### Install client dependencies

```bash
cd ../client
npm install
```

## Environment Variables

Create `server/.env`:

```env
PORT=3001
DB_URL=mongodb://localhost:27017/movie
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_oauth_client_id

GMAIL_EMAIL=your_gmail_address
GMAIL_PASSWORD=your_gmail_app_password

CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

Create `client/.env.local`:

```env
REACT_APP_API_BASE_URL=http://localhost:3001/
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

For Google OAuth in development, add `http://localhost:3000` to **Authorized JavaScript origins** in Google Cloud Console. If React starts on another port, add that exact origin.

## Usage

### Start backend

```bash
cd server
npm run dev
```

Backend runs at `http://localhost:3001`.

Swagger docs are available at:

```text
http://localhost:3001/api-docs
```

### Start frontend

```bash
cd client
npm start
```

Frontend runs at `http://localhost:3000`.

### Seed demo data

```bash
cd server
npm run seed-demo
```

### Reset admin account

```bash
cd server
npm run reset-admin
```

Default admin account:

```text
Username: admin
Password: admin123
```

## Scripts

### Server

```bash
npm run dev          # Start server with nodemon
npm start            # Start server with node
npm test             # Run server tests
npm run import       # Import data
npm run seed-demo    # Seed demo data
npm run clear        # Clear data
npm run test-user    # Create test user
npm run reset-admin  # Create/reset admin account
npm run fix-avatars  # Fix avatar URLs
```

### Client

```bash
npm start            # Start React development server
npm run build        # Build production bundle
npm test             # Run React tests
npm run eject        # Eject CRA config
```

## Main API Endpoints

### Auth and Users

- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/google-login`
- `POST /api/users/logout`
- `POST /api/users/verify-email`
- `POST /api/users/resend-verification`
- `GET /api/users/verification-status`
- `POST /api/users/forgotpassword`
- `POST /api/users/reset-password`
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/update/:id`
- `DELETE /api/users/delete/:id`

### Movies

- `GET /api/movies`
- `GET /api/movies/search`
- `GET /api/movies/top-favorites`
- `GET /api/movies/slug/:slug`
- `GET /api/movies/:id`
- `POST /api/movies/add`
- `PUT /api/movies/update/:id`
- `DELETE /api/movies/delete/:id`
- `PUT /api/movies/increment-views/:movieId`
- `POST /api/movies/:movieId/rate`
- `GET /api/movies/:movieId/rating/:userId`

### Favorites and Watch History

- `POST /api/users/add-favorite`
- `POST /api/users/remove-favorite`
- `GET /api/users/favorite/:userId/:movieId`
- `GET /api/users/favorites/:userId`
- `POST /api/movie-watched`
- `GET /api/movie-watched/user/:userId/continue-watching`
- `GET /api/movie-watched/user/:userId/movie/:movieId`
- `PUT /api/movie-watched/reset/:userId/:movieId`

### Comments

- `GET /api/comments/:movieId`
- `GET /api/comments/user/:userId`
- `POST /api/comments`
- `DELETE /api/comments/:id`

### Admin Resources

Categories, actors, directors and manufacturers follow this route style:

```text
GET    /api/{resource}
GET    /api/{resource}/:id
POST   /api/{resource}/add
PUT    /api/{resource}/update/:id
DELETE /api/{resource}/delete/:id
```

Resources:

- `categories`
- `actors`
- `directors`
- `manufacturers`

## Roadmap

- Realtime comments and notifications with Socket.io
- Adaptive streaming quality controls
- Dynamic subtitles
- Refresh Token with HttpOnly Cookie
- Recommendation system
- Analytics dashboard
- CI/CD with GitHub Actions
- SEO improvement with Next.js

## Author

Phạm Ngọc Anh 
