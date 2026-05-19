# Đánh Giá Tổng Quan UI/UX Movie Platform

## Tổng Quan

Project hiện đã vượt mức CRUD sinh viên cơ bản và không còn giống một app chỉ copy template. App đã có product thinking tương đối rõ: có Home, Movie Detail, Player, Search, Auth, Profile, Admin Dashboard, Favorite, Watch History, Rating, Comment và Dark/Light mode.

Nếu đánh giá theo hướng portfolio/recruiter cho vị trí intern/junior frontend, project đang ở mức khá ổn. Tuy nhiên để nhìn giống production hơn, cần tập trung polish UI consistency, dữ liệu demo, player/search UX và dọn technical warnings.

Điểm hiện tại ước lượng:

- UI/UX: 6.8/10
- Frontend architecture cơ bản: 7/10
- Portfolio readiness: 6.5-7/10
- Production feel: 6/10

## Điểm Mạnh Thật Sự

### 1. Dark Mode Mạnh Hơn Light Mode Khá Nhiều

Dark mode hiện là mode mạnh nhất của app và nên là mode ưu tiên khi demo portfolio.

Dark mode có:

- Contrast ổn.
- Cinematic feel rõ hơn.
- Đỏ + đen hợp movie platform.
- Hero có mood.
- Surface/card nhìn hợp ngữ cảnh phim hơn.

Trong khi đó light mode hiện còn:

- Hơi washed out.
- Thiếu depth.
- Thiếu hierarchy.
- Làm mất cảm giác cinematic.
- Dễ giống dashboard/admin hơn là movie platform.

Kết luận: nếu quay video demo hoặc chụp screenshot portfolio, nên ưu tiên dark mode.

### 2. Sidebar Khá Ổn Cho Junior

Sidebar hiện không quá fancy nhưng sạch và đủ chuyên nghiệp cho mức junior.

Điểm ổn:

- Spacing ổn.
- Active state rõ.
- Icon size hợp lý.
- Typography không bị amateur.
- Layout dễ scan.

Nếu polish thêm hover/focus state và responsive behavior thì sidebar có thể giữ nguyên hướng thiết kế hiện tại.

### 3. Detail Page Là Một Trong Những Màn Mạnh Nhất

Movie Detail tốt hơn nhiều phần khác của app.

Điểm mạnh:

- Hierarchy rõ.
- CTA "Xem phim" nổi bật.
- Metadata chip ổn.
- Poster + info layout hợp lý.
- Blur/background đi đúng hướng cinematic.
- User nhìn vào hiểu ngay phim gì và hành động chính là gì.

Đây là màn nên đưa vào demo portfolio vì nó thể hiện product thinking tốt nhất.

### 4. UI Có Consistency Hơn Nhiều Junior Project

App đã có nền tảng system tương đối:

- Button style tương đối consistent.
- Card style đồng nhất.
- Dark surfaces khá đều.
- Section title có pattern.
- Reusable components đã bắt đầu hình thành.

Điều này giúp app nhìn có hệ thống hơn nhiều project junior chỉ ghép CSS rời rạc.

## Những Điểm Đang Kéo Tụt Production Feel

### 1. Khoảng Trắng Đang Quá Nhiều

Đây là vấn đề lớn nhất khi nhìn screenshot thật.

Các màn dễ bị cảm giác trống:

- Trending page.
- Newest page.
- Home sections.
- Movie grid/list khi data ít.

Nguyên nhân chính:

- Data demo quá ít.
- Grid chưa tận dụng tốt chiều ngang.
- Section spacing hơi lớn.
- Card density thấp.

Cảm giác hiện tại:

```text
Layout có rồi nhưng chưa có content.
```

Vấn đề này kéo production feel từ khoảng 7 xuống 6.5 rất nhanh, vì movie platform cần cảm giác thư viện nội dung phong phú.

Nên làm:

- Tăng data demo lên 15-20 phim.
- Tăng số card mỗi row ở desktop.
- Giảm gap giữa card/section nếu data vẫn ít.
- Bổ sung nhiều section có mục đích rõ: Trending, New Releases, Top Rated, Horror, Action, Continue Watching.

### 2. Light Mode Hiện Khá Yếu

Light mode hiện chưa đủ tốt để làm mode demo chính.

Vấn đề:

- Background xám nhạt quá nhiều.
- Card không nổi.
- Text contrast chưa mạnh.
- Thiếu layer depth.
- Cinematic feel gần như mất.
- Nhìn giống SaaS/admin dashboard hơn là movie platform.

Nên chọn một trong hai hướng:

1. Polish mạnh light mode:
   - Tăng contrast surface.
   - Dùng card shadow rõ hơn.
   - Tối ưu poster/backdrop để không bị nhạt.
   - Làm accent red nhất quán hơn.

2. Tạm không dùng light mode trong portfolio demo:
   - Demo dark mode là chính.
   - Vẫn giữ light mode như feature phụ.

### 3. Hero Section Cần Polish Thêm

Dark mode hero hiện ổn nhưng vẫn chưa đủ premium.

Vấn đề:

- Text hơi chìm ở một số backdrop.
- Overlay chưa tối ưu.
- CTA chưa đủ nổi bật.
- Content block hơi trôi.
- Typography chưa tạo "wow moment".

Nên tăng gradient overlay, ví dụ:

```css
background: linear-gradient(
  90deg,
  rgba(0, 0, 0, 0.85) 0%,
  rgba(0, 0, 0, 0.45) 45%,
  rgba(0, 0, 0, 0.2) 100%
);
```

Nên làm thêm:

- Giảm width content để text không spread quá rộng.
- CTA chính nổi bật hơn bằng size, contrast, shadow hoặc pressed state.
- Meta/chip gọn hơn.
- Title có hierarchy mạnh hơn.
- Đảm bảo mobile hero không quá cao và CTA vẫn nằm trong first viewport.

### 4. Typography Chưa Đủ Premium

Typography hiện sạch nhưng chưa có cảm giác cinematic/premium.

Hiện tại:

- Section title hơi generic.
- Hero title chưa thật "wow".
- Meta text hơi nhạt.
- Card title ổn nhưng chưa nổi bật.

Nên cải thiện:

- Tạo typography scale rõ.
- Hero title mạnh hơn, line-height chặt hơn.
- Section title có weight/size nhất quán.
- Meta text dùng contrast đủ đọc nhưng không tranh spotlight.
- Caption/card meta cần gọn, không quá nhạt.

Typography là một trong những thứ reviewer cảm nhận rất nhanh dù không nói ra.

### 5. Card Grid Còn Yếu

Movie cards hiện có style ổn nhưng grid/density chưa đủ mạnh.

Vấn đề:

- Card hơi nhỏ ở một số viewport.
- Spacing hơi rộng.
- Density thấp.
- Khi data ít, toàn màn hình bị rỗng.
- Hover chưa tạo cảm giác streaming platform thật sự.

Nên làm:

- Tăng số card mỗi row ở desktop.
- Giảm khoảng trống giữa cards/sections.
- Hover rõ hơn nhưng vẫn mượt.
- Poster image chất lượng hơn.
- Có fallback skeleton/placeholder đẹp.
- Metadata trong card nên chọn lọc: year, quality, rating/views.

Hiện card grid vẫn hơi giống demo cards hơn là streaming platform thật.

### 6. Footer Hơi Template

Footer hiện sạch nhưng generic và hơi chiếm attention.

Nên cân nhắc:

- Giảm height.
- Tăng contrast vừa phải.
- Đơn giản hóa nội dung.
- Không để footer cạnh tranh với nội dung phim.
- Dùng layout gọn hơn, ít decorative hơn.

Movie platform thường nên để nội dung và player là trọng tâm, footer chỉ nên hỗ trợ.

### 7. Search Bar Chưa Đủ Nổi Bật

Search là chức năng rất quan trọng với movie platform.

Hiện search:

- Hơi mờ.
- Hơi generic SaaS.
- Chưa đủ cinematic.
- Search result còn thiếu thông tin để phân biệt phim.

Nên cải thiện:

- Làm search trigger nổi bật hơn ở header.
- Search modal có visual hierarchy mạnh hơn.
- Result item có poster, title, year, category/rating.
- Không mở tab mới trong SPA.
- Thêm debounce và keyboard navigation.
- Empty state search có icon/subtitle/CTA.

Search tốt sẽ làm app có cảm giác sản phẩm thật hơn rất nhiều.

## Thứ Làm App Lên Level Nhanh Nhất

Nếu phải ưu tiên theo tác động thị giác và portfolio, thứ tự nên là:

### Ưu Tiên 1: Data

Quan trọng nhất.

App hiện thiếu:

- Nhiều movie.
- Nhiều section.
- Varied posters.
- Backdrop đẹp.
- Rating/views/category đủ đa dạng.

Đây là thứ kéo cảm giác production xuống mạnh nhất. Thêm data tốt sẽ làm Home, grid, search, related movies và admin dashboard nhìn tốt hơn ngay.

### Ưu Tiên 2: Hero Polish

Chỉ cần polish hero là app lên level thấy rõ.

Tập trung:

- Overlay.
- CTA.
- Typography.
- Alignment.
- Mobile hero.

Hero là first impression của app. Nếu hero mạnh, reviewer sẽ có thiện cảm ngay từ 3 giây đầu.

### Ưu Tiên 3: Card Density

Hiện app quá trống. Card density tốt hơn sẽ làm thư viện phim có cảm giác phong phú hơn.

Tập trung:

- Grid tận dụng space tốt hơn.
- Gap hợp lý hơn.
- More cards per row.
- Poster đẹp và đồng nhất.

### Ưu Tiên 4: Light Mode

Hoặc polish mạnh, hoặc tạm bỏ khỏi portfolio demo.

Vì dark mode hiện mạnh hơn nhiều, demo light mode lúc này có thể làm app bị đánh giá thấp hơn thực tế.

## 1. Design System Consistency

Đây là phần quan trọng nhất. Hiện reviewer có thể thấy app còn cảm giác "đồ án" vì design system chưa thật chặt:

- Màu đỏ chưa thống nhất giữa `#e50914`, `#e94560`, `#b20710`, `#ff0a16`.
- Border radius dùng nhiều mức khác nhau: 4px, 6px, 8px, 10px, 12px, 14px, 16px, 20px.
- Spacing chưa theo scale cố định.
- Shadow/blur/glass effect mỗi khu vực một kiểu.
- Typography hierarchy chưa được định nghĩa rõ.

### Nên bổ sung Color Tokens

Ví dụ:

```css
:root {
  --primary: #e50914;
  --primary-hover: #f6121d;
  --bg: #0f0f0f;
  --surface: #141414;
  --card: #1a1a1a;
  --text: #ffffff;
  --muted: #b3b3b3;
  --border: rgba(255, 255, 255, 0.12);
}
```

### Nên bổ sung Radius Scale

Chỉ nên dùng:

- 6px: input nhỏ, tag, badge
- 8px: button, card nhỏ
- 12px: movie card, modal nhỏ
- 16px: modal lớn, dashboard panel

### Nên bổ sung Spacing Scale

Chỉ nên dùng:

- 4px
- 8px
- 12px
- 16px
- 24px
- 32px
- 40px

### Nên bổ sung Typography Hierarchy

Ví dụ:

- Hero title: 48-56px desktop, 28-34px mobile
- Page title: 32-40px
- Section title: 22-28px
- Card title: 14-18px
- Body: 14-16px
- Caption/meta: 12-13px

Đây là phần giúp UI "pro" lên nhanh nhất vì nó làm toàn bộ app nhất quán hơn ngay cả khi layout chưa đổi nhiều.

## 2. Data Demo Còn Quá Yếu

Movie app mà chỉ có 1-5 phim, ảnh thiếu, category ít thì UI nhìn nghèo dù code tốt. Với portfolio, dữ liệu demo ảnh hưởng trực tiếp đến cảm giác production.

Nên bổ sung tối thiểu:

- 15-20 phim.
- Nhiều category: Action, Drama, Horror, Anime, Sci-fi, Romance, Comedy.
- Poster chất lượng cao.
- Backdrop đẹp cho hero/detail.
- Rating/views khác nhau.
- Một vài phim có trạng thái trending/top-rated/new release.
- Một vài phim có watch history để demo Continue Watching.

Mục tiêu: mở Home lên phải có cảm giác như một nền tảng phim thật, không phải database test.

## 3. Player UX

Player là phần phân biệt một movie platform tốt với một web CRUD có video.

Hiện player đã có:

- Watch history.
- Resume modal.
- Playback speed.
- Video playback bằng `ReactPlayer`.

Nhưng còn yếu ở:

- Source dễ lỗi.
- Error raw từ browser/player.
- Empty/error state chưa đẹp.
- Chưa có fallback source.
- Chưa có subtitle/audio/episode controls.

Nên bổ sung:

- Loading overlay/skeleton trong lúc nguồn phim đang load.
- Error overlay đẹp:

```text
Video unavailable
Please try another source or refresh the page.
```

- Nút "Thử lại".
- Fallback source nếu phim có nhiều server.
- Subtitle selector nếu có data.
- Auto next episode nếu sau này làm series.

Chỉ cần làm tốt 1-2 điểm như loading overlay + error overlay + retry là player đã tăng cảm giác production rõ rệt.

## 4. Search UX

Search modal đã có nền tảng tốt:

- Auto focus input.
- ESC để đóng.
- Recent searches.
- Loading/no result state.

Điểm cần sửa:

- Search result đang dùng `target="_blank"` trong SPA. Điều này khá kỳ vì user bị mở tab mới khi đang dùng app.

Nên sửa sang navigate cùng tab:

```jsx
onClick={() => {
  onClose();
  navigate(`/movie/${item.slug}`);
}}
```

Hoặc dùng `<Link to={`/movie/${item.slug}`}>` nhưng bỏ `target="_blank"`.

Nên bổ sung thêm:

- Debounce search.
- Highlight keyword.
- Empty state có icon + CTA.
- Keyboard navigation bằng ArrowUp/ArrowDown/Enter.

## 5. Accessibility

Accessibility là phần rất nhiều junior project thiếu. Recruiter frontend kỹ sẽ đánh giá cao nếu bạn có.

Hiện app đã có điểm tốt:

- Search modal có ESC close.
- Search input auto focus.
- Một số button/icon có semantic tương đối ổn.

Cần bổ sung:

- `aria-label` cho icon-only buttons như search, close, favorite, share.
- `role="dialog"` và `aria-modal="true"` cho modal.
- Focus trap trong modal.
- Restore focus về button mở modal sau khi đóng.
- Tab order rõ.
- Keyboard navigation cho card/search result.
- Visible focus state cho button/link.

Ví dụ:

```jsx
<button aria-label="Đóng tìm kiếm" onClick={onClose}>
  <FaTimes />
</button>
```

## 6. Screenshot Và Demo Video

Đây là phần cực quan trọng với portfolio. Nhiều app code tốt nhưng demo xấu thì recruiter vẫn lướt qua.

Nên chuẩn bị screenshot desktop:

- Home
- Movie Detail
- Player
- Search
- Login/Register
- Admin Dashboard

Nên chuẩn bị screenshot mobile:

- Home
- Player
- Sidebar/Header
- Search
- Movie Detail

Tốt nhất có thêm video demo 1-3 phút:

1. Vào Home.
2. Search phim.
3. Mở Detail.
4. Bấm xem phim.
5. Resume watch history.
6. Vào Admin Dashboard.

Video demo nên quay với data đẹp, không có console error, không có loading quá lâu.

## 7. Dọn Warnings

Reviewer rất để ý warning vì nó tạo cảm giác thiếu polish.

Hiện project còn nhiều warning như:

- Unused imports.
- Unused state.
- Missing hook dependencies.
- Một số warning từ React hooks.

Cần dọn:

- Xóa import không dùng.
- Xóa state không dùng.
- Sửa dependency array của `useEffect`.
- Không để console error/log debug không cần thiết trong demo.

Mục tiêu trước khi quay demo:

```text
npm run build
Compiled successfully.
```

Không chỉ "Compiled with warnings".

## 8. Thiếu Micro Interactions

Micro interactions là thứ nâng UI từ 7 lên 8+.

Hiện đã có:

- Hover card.
- Hero fade.
- Modal transition.
- Skeleton shimmer một số chỗ.
- Image lazy load.

Nên polish thêm:

- Button press effect.
- Card hover mượt và thống nhất hơn.
- Image loading fade-in rõ hơn.
- Modal open/close animation nhất quán.
- Skeleton cho movie sections.
- Subtle transition khi favorite/unfavorite.
- Player controls fade đẹp hơn.

Lưu ý: không nên animate quá nhiều. App phim nên cinematic, mượt, nhưng không rối.

## 9. Empty States Chuyên Nghiệp Hơn

Hiện nhiều app chỉ có text kiểu "No movies found". Production UI nên có empty state đầy đủ.

Nên có:

- Icon.
- Title.
- Subtitle.
- CTA button.

Ví dụ:

```text
No favorites yet
Start exploring movies and save the ones you love.
[Explore movies]
```

Áp dụng cho:

- Favorites empty.
- Watch history empty.
- Search no results.
- Admin table empty.
- Related movies empty.
- Comments empty.

Empty state tốt giúp app trông có chủ đích hơn nhiều.

## 10. Stack Consistency

Điểm này cần sửa ngay nếu dùng project trong CV/portfolio.

Trong code hiện tại, `package.json` không thấy Tailwind CSS hoặc Redux Toolkit. Project đang dùng:

- React
- React Router
- Context API
- CSS thường
- Axios
- Express
- MongoDB/Mongoose
- ReactPlayer

Nếu CV hoặc README ghi Tailwind/Redux nhưng project không có, recruiter phát hiện rất nhanh. Điều này ảnh hưởng đến đánh giá honesty và technical depth.

Nên ghi đúng stack:

```text
Frontend: React, React Router, Context API, CSS, Axios
Backend: Express, MongoDB, Mongoose, JWT
Media: ReactPlayer-based playback, with support for source URLs that may be HLS streams
UI: Custom component system with reusable Button/Input/Modal/Card components
```

Nếu muốn ghi Redux/Tailwind, cần thật sự tích hợp vào project.

## 11. Mobile UI

Movie platform mà mobile yếu sẽ tụt điểm rất mạnh, vì phần lớn user xem/trailer/tìm phim trên điện thoại. Hiện code có media queries, nhưng chỉ có media queries chưa đủ để kết luận mobile UX tốt.

Reviewer frontend sẽ soi các điểm sau:

- Player mobile có dễ bấm play/pause/seek không.
- Header/navbar mobile có gọn không.
- Sidebar/menu mobile có dễ mở/đóng không.
- Search modal mobile có chiếm màn hợp lý không.
- Touch target có đủ lớn không.
- Hero mobile có bị quá cao hoặc che mất content không.
- Card grid/horizontal scroll có mượt không.
- Modal có bị overflow bàn phím khi input focus không.
- Text có bị cắt quá nhiều không.
- Admin dashboard mobile có còn đọc được không.

### Checklist Mobile Nên Test

Viewport nên test:

- 390x844: iPhone phổ biến.
- 375x667: màn nhỏ.
- 430x932: mobile lớn.
- 768x1024: tablet.

Các màn cần test mobile:

- Home.
- Movie Detail.
- Player.
- Search modal.
- Login/Register.
- Profile/Favorites.
- Admin Dashboard.
- Admin table/list.

### Những Điểm Nên Cải Thiện

- Touch target tối thiểu khoảng 40-44px.
- Button icon cần có khoảng cách đủ để không bấm nhầm.
- Player controls nên tránh bị header che.
- Search modal mobile nên full-screen, input focus tốt, kết quả dễ scroll.
- Hero mobile nên ưu tiên poster/backdrop + title + CTA, không nhồi description quá dài.
- Admin dashboard mobile nên chuyển table sang card/list nếu bảng quá rộng.

Nếu muốn portfolio mạnh hơn, nên có screenshot mobile riêng chứ không chỉ nói "responsive".

## 12. Animation Và Interaction Feel

Có animation trong code không đồng nghĩa với feel tốt. Reviewer sẽ cảm nhận app qua tốc độ, độ mượt và cách phản hồi khi user tương tác.

Hiện app có:

- Card hover.
- Hero animation.
- Modal transition.
- Skeleton shimmer.
- Favorite animation.
- Player controls fade.

Nhưng cần đánh giá thực tế:

- Hover card có smooth không hay bị giật.
- Transition duration có quá dài không.
- Loading skeleton có làm app cảm giác nhanh hơn không.
- Player controls hiện/ẩn có tự nhiên không.
- Modal mở/đóng có "cheap" không.
- Button click có feedback đủ rõ không.
- Animation có gây rối hoặc làm chậm UI không.

### Guideline Nên Theo

- Hover/button: 120-200ms.
- Modal open/close: 180-300ms.
- Page/section fade: 200-350ms.
- Không animate toàn bộ thuộc tính bằng global `*`.
- Ưu tiên `transform` và `opacity`.
- Tránh animation làm layout shift.

### Điểm Cần Lưu Ý Trong Project

Hiện có global transition trong `index.css`:

```css
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

Cách này tiện cho theme switching nhưng có thể gây cảm giác lag hoặc transition ngoài ý muốn. Production UI thường sẽ scope transition vào component cụ thể hơn.

Nên bổ sung:

- Press state cho button.
- Focus state rõ.
- Image fade-in khi load.
- Modal exit animation nếu có.
- Skeleton cho movie rows/cards nhất quán.
- Player loading spinner/overlay mượt.

Animation tốt là animation khiến app có cảm giác phản hồi nhanh hơn, không phải animation chỉ để trang trí.

## 13. Visual Hierarchy Thực Tế

Visual hierarchy rất khó đánh giá chỉ bằng code. Phải nhìn screenshot hoặc video mới biết user có hiểu ngay màn hình muốn họ làm gì không.

Reviewer sẽ hỏi:

- User nhìn vào Home có biết phim nổi bật là gì không.
- Hero có dẫn mắt tới CTA không.
- Section title có đủ nổi bật không.
- Movie cards có scan dễ không.
- Detail page có làm nổi bật nút xem phim không.
- Player có ít distraction không.
- Search result có dễ chọn phim không.
- Admin dashboard có dễ scan số liệu quan trọng không.
- Khoảng cách giữa sections có quá thưa hoặc quá chật không.

### Các Rủi Ro Hiện Có

- Hero có thể overpower phần content nếu backdrop quá tối/sáng hoặc title quá lớn.
- Card title/meta có thể bị cắt nhiều nếu tên phim dài.
- Admin dashboard dùng nhiều card/glass/shadow, nếu không kiểm soát tốt sẽ khó scan.
- Dashboard chart hiện đơn giản, có thể nhìn giống mock data.
- Search result đang chỉ hiển thị poster + name, thiếu year/category/rating để phân biệt phim.

### Nên Đánh Giá Bằng Screenshot/Video

Cần chụp:

- Home desktop ở first viewport.
- Home mobile ở first viewport.
- Detail desktop.
- Detail mobile.
- Search modal desktop/mobile.
- Player desktop/mobile.
- Admin dashboard desktop/mobile.

Khi nhìn screenshot, tự hỏi:

- Mắt mình nhìn vào đâu đầu tiên?
- CTA chính có rõ không?
- Nội dung phụ có bị cạnh tranh quá mạnh không?
- Card/list có dễ scan trong 3 giây không?
- Có chỗ nào text quá nhỏ, quá nhạt hoặc quá gần nhau không?
- Có khoảng trắng nào làm layout bị rỗng không?

Visual hierarchy tốt là khi user không cần suy nghĩ vẫn biết hành động tiếp theo là gì.

## Nếu Chỉ Chọn 3 Việc Để Nâng Level Nhanh Nhất

1. Design consistency  
Chuẩn hóa token màu, spacing, radius, typography.

2. Better demo data  
Thêm 15-20 phim với poster/backdrop đẹp và dữ liệu phong phú.

3. Player/Search UX polish  
Player có loading/error/retry rõ ràng. Search không mở tab mới, có debounce và empty state đẹp.

Ba việc này làm xong app sẽ nhìn khác ngay, không cần refactor toàn bộ.

## Đánh Giá Thật

Project hiện đã vượt:

- CRUD sinh viên cơ bản.
- Copy template đơn giản.
- App chỉ có list/detail.

Project bắt đầu có:

- Product thinking.
- Reusable components.
- App flow tương đối đầy đủ.
- Frontend architecture thinking.
- Client/admin separation.
- Loading/error/empty state awareness.

Đó là lý do project phù hợp để đánh giá ở mức junior khá ổn, không thấp.

Tuy nhiên, để recruiter nhìn vào và nghĩ "ứng viên này làm UI chắc tay", cần polish thêm. Hiện app có nhiều tính năng nhưng độ hoàn thiện chưa đồng đều.

## Kết Luận

Nếu mục tiêu là intern/junior frontend: project đủ tiềm năng để đưa vào portfolio sau khi polish thêm một vòng.

Nếu mục tiêu là production-level hoặc mid frontend: chưa đủ. Cần nâng design system, data handling, accessibility, player UX và code quality.

Ưu tiên hiện tại không phải thêm thật nhiều feature mới. Ưu tiên đúng hơn là làm những feature hiện có trông và hoạt động chắc hơn.
