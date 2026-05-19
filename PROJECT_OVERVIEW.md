# Project Overview - Movie Streaming Platform

## 1. Project Summary

Movie Streaming Platform là một fullstack web app mô phỏng nền tảng xem phim trực tuyến. Project tập trung vào trải nghiệm xem phim, khám phá nội dung, quản lý tài khoản người dùng và dashboard quản trị cho admin.

Mục tiêu chính:

- Xây dựng một movie platform có flow gần với sản phẩm thật.
- Có cả user-facing app và admin-facing app.
- Thể hiện khả năng frontend UI/UX, component structure, API integration và backend CRUD.
- Mô phỏng các feature cốt lõi của nền tảng phim: search, favorite, rating, comments, watch history, continue watching và video player.

Target user:

- Người dùng muốn tìm, xem và lưu phim yêu thích.
- Admin cần quản lý phim, user, category, actor, director, manufacturer và xem tổng quan hệ thống.

Project type:

- Fullstack movie platform.
- Portfolio project.
- Production simulation, chưa phải production thật.

One-line description:

```text
Movie streaming platform with authentication, favorites, comments, ratings, watch history, admin dashboard and ReactPlayer-based video playback.
```

## 2. Core Features

### User Side

#### Home

- Hero slider cho phim nổi bật/trending.
- Các section phim: Đang thịnh hành, Mới ra mắt, Đánh giá cao, Phim được yêu thích nhất.
- Continue Watching nếu user đã đăng nhập và có lịch sử xem.
- Responsive movie cards.
- Dark/Light mode.

#### Movie Detail

- Hiển thị thông tin phim theo slug.
- Poster/backdrop cinematic.
- CTA xem phim.
- Metadata: năm, thời lượng, chất lượng, rating.
- Favorite toggle.
- Rating.
- Comment section.
- Related movies theo category.
- Loading skeleton và movie not found state.

#### Player

- Video playback bằng `ReactPlayer`.
- Chuẩn hóa source URL dạng `Full|https://...m3u8`.
- Native/player controls.
- Playback speed.
- Watch history saving.
- Resume modal nếu user đã xem trước đó.
- Restart/reset watch history.
- Loading overlay khi tải nguồn phim.
- Error overlay với retry action.

#### Search

- Search modal.
- Auto focus input.
- ESC close.
- Recent searches.
- Loading state.
- No result state.
- SPA navigation tới movie detail.
- Result card có poster, title, year/quality.

#### Authentication

- Register.
- Login.
- Forgot password.
- Verify email page.
- JWT token persistence via localStorage.
- Role-based routing after login.

#### Profile

- Profile information.
- Password change.
- Favorite movies.
- Watch history / continue watching.
- Profile tabs.

#### Theme

- Dark/Light mode bằng CSS variables.
- Dark mode hiện là mode mạnh nhất về cảm giác cinematic.

### Admin Side

#### Admin Dashboard

- Stats cards: total views, movies, users, categories.
- Bar chart 7 ngày.
- Top movies by views.
- Quick actions.
- Recent activity.

Lưu ý: chart hiện đang được generate từ dữ liệu tổng views, chưa phải analytics thật theo event/time-series.

#### Movie Management

- List movies.
- Add movie.
- Edit movie.
- Movie detail.
- Delete movie.
- Fields gồm name, slug, content, status, year, time, quality, categories, actors, director, manufacturer, poster, thumb, trailer, source URL.

#### User Management

- List users.
- Add user.
- Edit user.
- User detail.
- Delete user.
- Role support: `user`, `admin`.

#### Category / Actor / Director / Manufacturer Management

- CRUD category.
- CRUD actor.
- CRUD director.
- CRUD manufacturer.
- Detail/edit pages cho từng resource.

## 3. Tech Stack

### Frontend

- React 18.
- React Router DOM.
- Context API:
  - `ThemeContext`
  - `FavoriteContext`
- Axios.
- Custom CSS with CSS variables.
- React Icons.
- Swiper for hero/movie slider.
- Sonner for toast notifications.
- ReactPlayer for video playback.

Important note:

```text
Project hiện không dùng Tailwind CSS hoặc Redux Toolkit.
Nếu đưa vào CV/README, nên ghi đúng stack để tránh bị reviewer đánh giá sai về honesty/technical depth.
```

### Backend

- Node.js.
- Express 5.
- MongoDB.
- Mongoose.
- JWT authentication.
- Bcrypt password hashing.
- Multer + Cloudinary config exists for avatar/poster/backdrop/thumb image upload flows.
- Nodemailer for email service / verification.
- Winston logger.
- Swagger config.

### Database

- MongoDB with Mongoose schemas.

### Media

- Video playback with `ReactPlayer`; source URLs can point to HLS `.m3u8` streams when supported.
- Movie source supports labeled source format such as:

```text
Full|https://example.com/index.m3u8
```

### Tooling

- Create React App / react-scripts.
- Node test runner for server tests.
- npm scripts.
- Demo seed script: `npm run seed-demo`.

## 4. Architecture

### High-Level Structure

```text
movie/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Admin/
│       │   ├── AdvancedSearch/
│       │   ├── HeroSlider/
│       │   ├── MovieCard/
│       │   ├── MovieGrid/
│       │   ├── MovieSection/
│       │   ├── Profile/
│       │   └── UI/
│       ├── contexts/
│       ├── layouts/
│       ├── pages/
│       │   ├── Admin/
│       │   ├── Auth/
│       │   ├── Home/
│       │   ├── MovieDetail/
│       │   ├── MoviePage/
│       │   ├── MoviePlayer/
│       │   └── Profile/
│       ├── services/
│       ├── utils/
│       └── config/
│
└── server/
    ├── config/
    ├── controllers/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── scripts/
    ├── services/
    └── utils/
```

### Frontend Architecture

#### Layout Separation

- `UserLayout` for public/user pages.
- `AdminLayout` for admin pages.
- `AuthLayout` for login/register/forgot password.

This gives the app clear separation between user app, admin app and auth flow.

#### Reusable UI Components

Reusable components include:

- `Button`
- `Input`
- `ConfirmModal`
- `ResumeModal`
- `FavoriteButton`
- `SearchBar`
- `SearchModal`
- `MovieCard`
- `MovieSection`
- `MovieGrid`
- `SkeletonCard`
- Admin table/header/filter/form components.

This is a strong point for junior-level frontend architecture because the app is not only page-level JSX.

#### Contexts

- `ThemeContext`: manages dark/light mode.
- `FavoriteContext`: centralizes favorite state and toggle behavior.

#### Services Layer

API calls are grouped in `client/src/services`:

- `movieService`
- `userService`
- `commentService`
- `categoryService`
- `actorService`
- `directorService`
- `manufacturerService`
- `statsService`

This keeps API calls mostly outside UI components and improves maintainability.

#### Routing

Routing is managed in `App.js` with:

- Public routes.
- Auth routes.
- Admin routes inside `ProtectedRoute`.
- Movie detail route.
- Player route.
- Profile route.

### Backend Architecture

Backend follows common Express MVC-style separation:

- `routes`: endpoint mapping.
- `controllers`: request handling and business logic.
- `models`: Mongoose schema definitions.
- `middlewares`: auth and role protection.
- `services`: email service.
- `utils`: validation, token utils, API response helpers.
- `config`: database, logger, cloudinary, swagger.

### Access Control

Middlewares include:

- `verifyToken`
- `requireAdmin`
- `requireSelfOrAdminByParam`
- `requireSelfOrAdminByBody`
- email verification middleware.

This shows awareness of role-based and ownership-based authorization.

## 5. Database Design

### User

Key fields:

- `name`
- `username`
- `email`
- `password`
- `role`: `user` or `admin`
- `avatar`
- `favourite`: array of Movie IDs
- `movieWatched`: array of Movie IDs
- `isEmailVerified`
- `emailVerificationToken`
- `emailVerificationTokenExpiry`

Purpose:

- Stores account identity.
- Supports auth/role-based UI.
- Stores favorite and watched movie references.
- Supports email verification flow.

### Movie

Key fields:

- `name`
- `slug`
- `content`
- `status`: released/upcoming/cancelled
- `poster_url`
- `thumb_url`
- `trailer_url`
- `source_url`
- `time`
- `quality`
- `year`
- `views`
- `rating`
- `ratingCount`
- `actors`
- `director`
- `categories`
- `manufacturer`

Purpose:

- Core content model.
- Supports listing, search, detail, player, admin CRUD, rating, views and filtering by related entities.

### MovieWatched

Key fields:

- `user`
- `movie`
- `totalDuration`
- `watchedDuration`
- timestamps

Purpose:

- Enables resume watching.
- Supports Continue Watching section.
- Stores per-user progress.

### Comment

Key fields:

- `content`
- `rate`
- `movie`
- `user`
- timestamps

Purpose:

- Allows users to discuss/review movies.
- Powers movie detail comment section.

### UserRating

Key fields:

- `user`
- `movie`
- `rating`
- unique index on `{ user, movie }`

Purpose:

- Ensures one rating per user per movie.
- Supports updating aggregate movie rating/ratingCount.

### Category / Actor / Director / Manufacturer

Purpose:

- Normalize movie metadata.
- Supports filtering, related movies and admin management.

## 6. API Design

### Main Route Groups

```text
/api/users
/api/movies
/api/comments
/api/categories
/api/actors
/api/directors
/api/manufacturers
/api/movie-watched
```

### Movies

Representative endpoints:

- `GET /api/movies`
- `GET /api/movies/:id`
- `GET /api/movies/slug/:slug`
- `GET /api/movies/search?keyword=...`
- `GET /api/movies/category/:category`
- `GET /api/movies/by-manufacturer/:manufacturerId`
- `GET /api/movies/by-actor/:actorId`
- `GET /api/movies/by-director/:directorId`
- `GET /api/movies/top-favorites`
- `PUT /api/movies/increment-views/:movieId`
- `POST /api/movies/add`
- `PUT /api/movies/update/:id`
- `DELETE /api/movies/delete/:id`
- `POST /api/movies/:movieId/rate`
- `GET /api/movies/:movieId/rating/:userId`

### Users/Auth

Representative capabilities:

- Register.
- Login.
- User CRUD for admin.
- Update profile.
- Change password.
- Forgot password.
- Favorite/unfavorite movie.
- Get user favorites.
- Email verification support.

### Comments

Representative capabilities:

- Create comment.
- Get comments by movie.
- Delete/manage comments.

### Watch History

Endpoints:

- `POST /api/movie-watched`
- `GET /api/movie-watched/user/:userId/movie/:movieId`
- `GET /api/movie-watched/user/:userId/continue-watching`
- `PUT /api/movie-watched/reset/:userId/:movieId`
- `PUT /api/movie-watched/:id`
- `GET /api/movie-watched/:id`

Design purpose:

- Separate watch progress from user/movie documents.
- Enables per-user progress tracking and resume modal.

## 7. UX Decisions

### Dark Mode First

Movie platforms benefit from dark UI because:

- It supports cinematic mood.
- Posters/backdrops stand out better.
- Video watching context fits dark surfaces.
- Red accent works better on dark background.

Dark mode is currently stronger than light mode and should be the primary portfolio demo mode.

### Hero Slider

Hero provides immediate visual identity and highlights top/trending movies. It creates a stronger first impression than a plain grid.

### Search Modal

Search is modal-based so users can search without leaving current context. It supports recent searches and quick navigation to movie detail.

### Resume Modal

Resume modal is a product-level decision:

- If user watched more than a threshold, ask whether to continue.
- Supports real streaming behavior.
- Makes watch history visible and useful.

### Favorite System

Favorites create a personal library behavior and justify profile/favorite pages.

### Admin/User Separation

AdminLayout and UserLayout make the app feel like two connected surfaces:

- Consumer movie browsing.
- Operational content management.

This is stronger than mixing admin controls into the public UI.

### Loading/Error States

Loading skeletons and error states exist in several areas to avoid blank screens:

- Home hero.
- Movie detail.
- Search.
- Player.
- Admin dashboard.

This shows awareness of async UI states.

## 8. Challenges & Solutions

### Video Playback

Challenge:

- Source URLs can be `.m3u8`.
- Some source strings include labels like `Full|https://...`.
- Browser autoplay policy blocks video autoplay with sound.
- ReactPlayer needs normalized source URLs and clear error states.

Solution:

- Normalize source URLs before playback.
- Use `ReactPlayer` with native/player controls and imperative methods:
  - `getCurrentTime`
  - `getDuration`
  - `seekTo`
- Add player loading/error overlay and retry action.

### Watch History

Challenge:

- Avoid overwriting saved progress with `0`.
- Persist watch progress while user leaves/pauses.
- Resume only if watched duration is significant.

Solution:

- Server updates progress only when currentTime is greater than existing progress.
- Client saves progress on pause/unmount/progress intervals.
- Resume modal shown when watched duration is above threshold.

### Search Flow

Challenge:

- Search should feel quick and not break SPA navigation.

Solution:

- Search modal with focused input.
- ESC close.
- SPA navigation to movie detail.
- Recent searches.

Future improvement:

- Add debounce and keyboard navigation for results.

### Data Demo Weakness

Challenge:

- UI looked empty with too few movies.

Solution:

- Added `server/scripts/seedDemoData.js`.
- Added `npm run seed-demo`.
- Upserts 18 demo movies without deleting existing data.
- Increased default movie API limit to 50.
- Home sections now show up to 10 movies.

### UI Consistency

Challenge:

- Colors/radius/spacing varied too much.

Solution:

- Added primary color and radius tokens.
- Polished hero overlay, CTA, movie card density, footer spacing and search modal behavior.

## 9. Current Limitations

The project is strong for portfolio/junior level, but not production-complete.

Known limitations:

- Light mode is weaker than dark mode.
- Some admin dashboard data is simulated from existing totals, not true analytics.
- Recommendation system is not implemented.
- Subtitle/audio server selection is not implemented.
- Multiple video sources/server fallback are not fully modeled.
- Some ESLint warnings remain.
- Some hook dependencies need cleanup.
- Search does not yet have debounce/keyboard navigation.
- Accessibility can be improved with full focus trap and richer ARIA patterns.
- Tests are limited.
- Deployment configuration is not fully documented.

## 10. Future Improvements

### Product Features

- Multiple video servers per movie.
- Subtitle support.
- Episode support for series.
- Auto next episode.
- Recommendation system.
- Advanced search with filters.
- Infinite scroll.
- Watchlist/playlists.
- User reviews separate from quick comments.
- Notification center.

### UX/UI

- Stronger mobile player controls.
- Better mobile admin tables.
- More polished light mode.
- More professional empty states.
- Improved motion system.
- Focus trap for modals.
- Keyboard navigation for search results.
- Screenshot and demo video package for portfolio.

### Backend

- Real analytics/event tracking.
- Pagination and filtering improvements.
- Better validation layer.
- Rate limiting.
- Refresh token flow.
- More complete Swagger documentation.
- Centralized error handling.
- Upload pipeline for poster/backdrop/video metadata.

### Frontend Architecture

- Clean remaining ESLint warnings.
- Extract custom hooks for:
  - movie fetching
  - search
  - watch history
  - player state
- Consider state management only if app grows beyond Context needs.
- Add tests for services, auth flows and critical components.

## 11. Screenshots / Demo Flow

Recommended screenshots for portfolio:

### Desktop

- Home dark mode.
- Movie Detail dark mode.
- Player with loading/ready state.
- Search modal with results.
- Login page.
- Admin Dashboard.
- Admin Movies list.

### Mobile

- Home.
- Movie Detail.
- Player.
- Search modal.
- Sidebar/header.
- Profile or Favorites.

### Recommended 1-3 Minute Demo Video

Flow:

1. Open Home in dark mode.
2. Browse hero and movie sections.
3. Use Search.
4. Open Movie Detail.
5. Add to favorites.
6. Start player.
7. Show resume/continue watching.
8. Open Admin Dashboard.
9. Show Add/Edit Movie flow briefly.

Demo tips:

- Use seeded demo data.
- Stay in dark mode.
- Hide console.
- Avoid showing raw error logs.
- Make sure no layout looks empty.

## 12. Portfolio Positioning

Best way to describe this project:

```text
Fullstack movie streaming platform built with React, Express and MongoDB.
Includes user authentication, admin management, movie discovery, favorites,
ratings, comments, watch history, continue watching and ReactPlayer-based video playback.
```

What this project demonstrates:

- React component architecture.
- Routing and layout separation.
- API service layer.
- Auth and role-based access.
- MongoDB schema relationships.
- Admin CRUD workflow.
- Async UI states.
- Product-level UX decisions.
- Media playback problem solving.

What not to overclaim:

- Do not claim real production streaming infrastructure.
- Do not claim Tailwind/Redux unless added.
- Do not claim advanced recommendation/analytics unless implemented.
- Do not claim full accessibility compliance yet.

## 13. Reviewer Evaluation Notes

Likely strengths a reviewer will notice:

- More complete than a simple CRUD app.
- Good junior-level component separation.
- Clear user/admin split.
- Dark mode movie UI has direction.
- Detail page and player flow show product thinking.
- Watch history/resume modal is a strong feature.
- Backend has meaningful models and route separation.

Likely concerns a reviewer may raise:

- Remaining ESLint warnings.
- Light mode weaker than dark mode.
- Some dashboard metrics are simulated.
- Accessibility incomplete.
- Search/player can be polished further.
- Tests and deployment docs are thin.

Overall assessment:

```text
Strong junior portfolio project with real product thinking.
Needs polish and cleanup to feel production-level.
```
