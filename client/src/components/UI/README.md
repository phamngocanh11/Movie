# UI Components Guide

## 🎨 Các Component mới

### 1. SkeletonCard
**Mục đích:** Hiển thị loading state khi đang tải danh sách phim

**Cách dùng:**
```jsx
import SkeletonCard from "../UI/SkeletonCard/SkeletonCard";

// Trong component
{loading ? (
  <>
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </>
) : (
  movies.map(movie => <MovieCard key={movie._id} movie={movie} />)
)}
```

---

### 2. EmptyState
**Mục đích:** Hiển thị khi không có dữ liệu (phim yêu thích trống, lịch sử xem trống...)

**Cách dùng:**
```jsx
import EmptyState from "../UI/EmptyState/EmptyState";
import { FaHeartBroken } from "react-icons/fa";

// Trong component
{movies.length === 0 && (
  <EmptyState
    icon={FaHeartBroken}
    title="Chưa có phim yêu thích"
    message="Bạn chưa thêm bộ phim nào vào danh sách yêu thích. Hãy khám phá và lưu lại những bộ phim bạn thích nhé!"
    actionText="Khám phá ngay"
    actionLink="/"
  />
)}
```

**Props:**
- `icon`: React Icon component (FaHeartBroken, FaFilm, FaHistory...)
- `title`: Tiêu đề (string)
- `message`: Mô tả chi tiết (string)
- `actionText`: Text của button (optional)
- `actionLink`: Link đến trang khác (optional)

---

### 3. Toast Notifications (Sonner)
**Đã được cấu hình sẵn!** Chỉ cần import và dùng:

```jsx
import { toast } from "sonner";

// Success
toast.success("Thêm vào yêu thích thành công!");

// Error
toast.error("Đã có lỗi xảy ra!");

// Warning
toast.warning("Vui lòng đăng nhập!");

// Info
toast.info("Đang xử lý...");

// Custom
toast("Thông báo tùy chỉnh", {
  description: "Mô tả chi tiết",
  duration: 3000,
});
```

---

## 🎯 Cải tiến đã áp dụng

### ✅ Hero Banner
- Tràn viền (full-width)
- Gradient mượt mà từ đen lên trong suốt
- Giới hạn mô tả 3 dòng với ellipsis

### ✅ Movie Card
- Glassmorphism effect
- Hover nảy lên 8px với bóng đỏ
- Màu chữ phụ slate-400

### ✅ Profile Page
- Padding tăng lên 2rem
- Button viền đỏ, bo tròn hoàn toàn
- Width: fit-content

### ✅ Movie Filters
- Select có nền xám đậm, viền đẹp
- Focus: viền đỏ sáng lên
- Reset button tinh tế

### ✅ Header
- Sticky position
- Blur backdrop
- Scrolled state

### ✅ Sidebar
- Active state: nền đỏ nhạt + viền trái đỏ
- Border-radius chỉ bên phải

### ✅ Scrollbar
- Custom width: 8px
- Màu trong suốt, hover sáng lên
- Smooth scrolling

---

## 📝 Best Practices

1. **Loading States:** Luôn dùng SkeletonCard thay vì spinner
2. **Empty States:** Luôn dùng EmptyState với icon và CTA
3. **Notifications:** Dùng toast thay vì alert()
4. **Smooth UX:** Tất cả transition đều 0.3s ease
5. **Accessibility:** Thêm aria-label cho các button icon

---

## 🚀 Next Steps

Để áp dụng các component này vào project:

1. **Thay thế loading spinner bằng SkeletonCard** trong:
   - Home.jsx
   - MoviesPage.jsx
   - CategoryPage.jsx

2. **Thay thế empty message bằng EmptyState** trong:
   - FavoriteMovies.jsx
   - WatchHistory.jsx
   - Profile pages

3. **Kiểm tra toast** đã hoạt động tốt chưa

4. **Test responsive** trên mobile, tablet, desktop
