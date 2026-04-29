# 📚 Hướng Dẫn Git Workflow - Thực Hành

## 🎯 Bạn đã làm được gì?

✅ Khởi tạo Git repository: `git init`  
✅ Tạo commit đầu tiên với 235 files  
✅ Tạo branch mới: `feature/advanced-search`  
✅ Đang ở branch: `feature/advanced-search` (dấu * hiển thị branch hiện tại)

---

## 📖 Các Lệnh Git Cơ Bản

### 1️⃣ Xem trạng thái hiện tại
```bash
git status              # Xem file nào đã thay đổi
git branch              # Xem danh sách branch (dấu * là branch hiện tại)
git log --oneline       # Xem lịch sử commit ngắn gọn
git log                 # Xem lịch sử commit chi tiết
```

### 2️⃣ Tạo và chuyển branch
```bash
# Cách 1: Tạo rồi chuyển (2 bước)
git branch feature/new-feature    # Tạo branch mới
git checkout feature/new-feature  # Chuyển sang branch đó

# Cách 2: Tạo và chuyển luôn (1 bước) - KHUYÊN DÙNG
git checkout -b feature/new-feature

# Cách 3: Git mới hơn (từ Git 2.23+)
git switch -c feature/new-feature
```

### 3️⃣ Làm việc với code
```bash
# Sau khi sửa code, thêm file vào staging
git add .                    # Thêm tất cả file
git add client/src/App.js    # Thêm file cụ thể

# Commit thay đổi
git commit -m "Add advanced search feature"

# Xem thay đổi
git diff                     # Xem thay đổi chưa add
git diff --staged            # Xem thay đổi đã add
```

### 4️⃣ Merge branch
```bash
# Chuyển về branch chính (master/main)
git checkout master

# Merge branch feature vào master
git merge feature/advanced-search

# Xóa branch sau khi merge (tùy chọn)
git branch -d feature/advanced-search
```

### 5️⃣ Xử lý conflict
```bash
# Khi merge bị conflict:
# 1. Git sẽ báo file nào bị conflict
# 2. Mở file đó, tìm dòng:
#    <<<<<<< HEAD
#    code của branch hiện tại
#    =======
#    code của branch đang merge
#    >>>>>>> feature/advanced-search

# 3. Sửa code, xóa các dấu <<<<, ====, >>>>
# 4. Add và commit
git add .
git commit -m "Resolve merge conflict"
```

---

## 🌳 Git Branching Strategy

### Quy tắc đặt tên branch:
```
feature/ten-tinh-nang      # Tính năng mới
bugfix/ten-loi             # Sửa lỗi
hotfix/loi-khan-cap        # Sửa lỗi khẩn cấp production
refactor/ten-phan          # Tái cấu trúc code
docs/ten-tai-lieu          # Cập nhật tài liệu
```

### Ví dụ thực tế:
```bash
feature/dark-mode          # ✅ Đã làm
feature/advanced-search    # ✅ Đang làm
feature/user-notification  # Sắp làm
feature/playlist           # Sắp làm
bugfix/login-error         # Sửa lỗi login
hotfix/security-patch      # Vá lỗ hổng bảo mật
```

---

## 🔄 Workflow Thực Tế

### Kịch bản 1: Làm tính năng mới
```bash
# 1. Tạo branch từ master
git checkout master
git checkout -b feature/user-notification

# 2. Code tính năng...
# (Sửa file, thêm file...)

# 3. Commit thường xuyên
git add .
git commit -m "Add notification model"

git add .
git commit -m "Add notification API endpoints"

git add .
git commit -m "Add notification UI component"

# 4. Merge về master khi xong
git checkout master
git merge feature/user-notification

# 5. Xóa branch (tùy chọn)
git branch -d feature/user-notification
```

### Kịch bản 2: Làm nhiều tính năng song song
```bash
# Branch 1: Notification
git checkout -b feature/notification
# ... code ...
git commit -m "Add notification"

# Chuyển sang branch 2: Playlist (không merge branch 1)
git checkout master
git checkout -b feature/playlist
# ... code ...
git commit -m "Add playlist"

# Merge từng branch một
git checkout master
git merge feature/notification

git checkout master
git merge feature/playlist
```

### Kịch bản 3: Sửa lỗi khẩn cấp
```bash
# Đang code feature, phát hiện lỗi khẩn cấp
git checkout master
git checkout -b hotfix/login-crash

# Sửa lỗi
git add .
git commit -m "Fix login crash"

# Merge ngay
git checkout master
git merge hotfix/login-crash

# Quay lại tiếp tục feature
git checkout feature/advanced-search
```

---

## 🚀 Làm Việc Với Remote (GitHub/GitLab)

### Lần đầu push lên remote:
```bash
# Thêm remote repository
git remote add origin https://github.com/username/movie-app.git

# Push branch master
git push -u origin master

# Push branch feature
git push -u origin feature/advanced-search
```

### Push code thường xuyên:
```bash
git push                    # Push branch hiện tại
git push origin master      # Push branch master
git push origin feature/advanced-search  # Push branch cụ thể
```

### Pull code từ remote:
```bash
git pull                    # Pull branch hiện tại
git pull origin master      # Pull branch master
```

---

## 💡 Tips & Best Practices

### ✅ NÊN:
- Commit thường xuyên với message rõ ràng
- Tạo branch cho mỗi tính năng/bugfix
- Merge về master khi tính năng hoàn thành
- Pull code trước khi bắt đầu làm việc
- Push code lên remote thường xuyên

### ❌ KHÔNG NÊN:
- Commit trực tiếp vào master (trừ khi làm một mình)
- Commit quá nhiều file không liên quan
- Dùng message commit mơ hồ: "fix", "update", "abc"
- Để code lâu không commit
- Force push (`git push -f`) trừ khi thực sự cần

### 📝 Commit Message Tốt:
```bash
# ❌ Không tốt
git commit -m "fix"
git commit -m "update"
git commit -m "abc"

# ✅ Tốt
git commit -m "Fix login validation error"
git commit -m "Add dark mode toggle button"
git commit -m "Update user profile API endpoint"
git commit -m "Refactor movie card component"
```

---

## 🎓 Bài Tập Thực Hành

### Bài 1: Tạo file mới trong branch hiện tại
```bash
# Bạn đang ở: feature/advanced-search
# 1. Tạo file mới: client/src/components/AdvancedSearch/AdvancedSearch.jsx
# 2. Add và commit
# 3. Xem log
```

### Bài 2: Chuyển branch và merge
```bash
# 1. Chuyển về master
# 2. Merge feature/advanced-search vào master
# 3. Xem log để thấy commit từ branch feature
```

### Bài 3: Tạo branch mới cho tính năng khác
```bash
# 1. Tạo branch: feature/user-notification
# 2. Tạo file mới trong branch này
# 3. Commit
# 4. Chuyển về master (không merge)
# 5. Xem file vừa tạo có trong master không?
```

---

## 🔍 Các Lệnh Hữu Ích Khác

```bash
# Xem chi tiết commit
git show <commit-hash>

# Quay lại commit trước (cẩn thận!)
git reset --hard HEAD~1

# Xem ai sửa dòng code nào
git blame <file>

# Tìm kiếm trong lịch sử commit
git log --grep="search term"

# Xem branch đã merge
git branch --merged

# Xem branch chưa merge
git branch --no-merged

# Đổi tên branch
git branch -m old-name new-name

# Xóa branch local
git branch -d feature/old-feature

# Xóa branch remote
git push origin --delete feature/old-feature
```

---

## 📊 Trạng Thái Hiện Tại Của Bạn

```
Repository: D:/movie
Branch hiện tại: feature/advanced-search
Commit gần nhất: Initial commit: Movie streaming platform with Dark/Light theme
Số file: 235 files
Dòng code: 61,539 insertions
```

### Cấu trúc branch:
```
master (1c80b55)
  └── feature/advanced-search (1c80b55) ← Bạn đang ở đây
```

---

## 🎯 Bước Tiếp Theo

1. **Thực hành tạo file mới** trong branch `feature/advanced-search`
2. **Commit thay đổi**
3. **Merge về master**
4. **Tạo branch mới** cho tính năng tiếp theo
5. **Push lên GitHub/GitLab** (nếu có)

---

## 📞 Cần Giúp Đỡ?

Nếu gặp vấn đề, hãy chạy:
```bash
git status    # Xem trạng thái hiện tại
git log       # Xem lịch sử
git branch    # Xem branch
```

Hoặc hỏi tôi bất cứ lúc nào! 😊
