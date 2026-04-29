# ⚡ Git Quick Reference - Tra Cứu Nhanh

## 🔥 Các Lệnh Thường Dùng Nhất

### Xem Trạng Thái
```bash
git status              # Xem file nào thay đổi
git branch              # Xem branch hiện tại
git log --oneline       # Xem lịch sử ngắn gọn
```

### Tạo & Chuyển Branch
```bash
git checkout -b feature/ten-tinh-nang    # Tạo + chuyển branch (1 lệnh)
git checkout master                       # Chuyển về master
```

### Commit Code
```bash
git add .                                 # Thêm tất cả file
git commit -m "feat: Add new feature"    # Commit với message
```

### Merge Branch
```bash
git checkout master                       # Chuyển về master
git merge feature/ten-tinh-nang          # Merge branch vào master
```

---

## 📋 Workflow Chuẩn (Copy & Paste)

### Làm Tính Năng Mới
```bash
# 1. Tạo branch mới
git checkout -b feature/ten-tinh-nang

# 2. Code tính năng...
# (Sửa file, thêm file...)

# 3. Commit
git add .
git commit -m "feat: Add ten-tinh-nang"

# 4. Merge về master
git checkout master
git merge feature/ten-tinh-nang

# 5. Xóa branch (tùy chọn)
git branch -d feature/ten-tinh-nang
```

### Sửa Lỗi
```bash
# 1. Tạo branch bugfix
git checkout -b bugfix/ten-loi

# 2. Sửa lỗi...

# 3. Commit
git add .
git commit -m "fix: Fix ten-loi"

# 4. Merge về master
git checkout master
git merge bugfix/ten-loi
```

---

## 🎯 Commit Message Convention

```bash
feat:     # Tính năng mới
fix:      # Sửa lỗi
docs:     # Cập nhật tài liệu
style:    # CSS/styling
refactor: # Tái cấu trúc code
test:     # Thêm test
chore:    # Công việc khác (build, config...)
```

### Ví Dụ:
```bash
git commit -m "feat: Add user login"
git commit -m "fix: Fix login validation error"
git commit -m "docs: Update README"
git commit -m "style: Update button colors"
git commit -m "refactor: Simplify auth logic"
```

---

## 🌐 Push Lên GitHub/GitLab

### Lần Đầu
```bash
# 1. Tạo repo trên GitHub/GitLab
# 2. Add remote
git remote add origin https://github.com/username/repo-name.git

# 3. Push master
git push -u origin master

# 4. Push branch khác
git push -u origin feature/ten-branch
```

### Lần Sau
```bash
git push                    # Push branch hiện tại
git push origin master      # Push master
```

---

## 🔄 Pull Code Từ Remote

```bash
git pull                    # Pull branch hiện tại
git pull origin master      # Pull master
```

---

## 🚨 Xử Lý Conflict

```bash
# 1. Khi merge bị conflict, Git sẽ báo
git merge feature/branch-name
# CONFLICT (content): Merge conflict in file.js

# 2. Mở file bị conflict, tìm:
# <<<<<<< HEAD
# code của branch hiện tại
# =======
# code của branch đang merge
# >>>>>>> feature/branch-name

# 3. Sửa code, xóa các dấu <<<<, ====, >>>>

# 4. Add và commit
git add .
git commit -m "fix: Resolve merge conflict"
```

---

## 🗑️ Xóa Branch

```bash
# Xóa branch local
git branch -d feature/branch-name

# Xóa branch remote
git push origin --delete feature/branch-name
```

---

## ↩️ Hoàn Tác (Undo)

```bash
# Hoàn tác file chưa commit
git checkout -- file.js

# Hoàn tác tất cả file chưa commit
git checkout -- .

# Hoàn tác commit cuối (giữ code)
git reset --soft HEAD~1

# Hoàn tác commit cuối (xóa code) - NGUY HIỂM!
git reset --hard HEAD~1
```

---

## 📊 Xem Lịch Sử

```bash
# Ngắn gọn
git log --oneline

# Có graph
git log --oneline --graph --all

# Chi tiết
git log

# Xem thay đổi của commit
git show <commit-hash>
```

---

## 🔍 Tìm Kiếm

```bash
# Tìm trong commit message
git log --grep="search term"

# Xem ai sửa dòng nào
git blame file.js
```

---

## 💾 Stash (Cất Code Tạm)

```bash
# Cất code tạm thời
git stash

# Xem danh sách stash
git stash list

# Lấy code ra
git stash pop

# Xóa stash
git stash drop
```

---

## 🎓 Khi Nào Dùng Gì?

| Tình Huống | Lệnh |
|------------|------|
| Bắt đầu tính năng mới | `git checkout -b feature/name` |
| Xem file nào thay đổi | `git status` |
| Commit code | `git add . && git commit -m "message"` |
| Merge về master | `git checkout master && git merge feature/name` |
| Push lên remote | `git push` |
| Pull code mới | `git pull` |
| Xem lịch sử | `git log --oneline --graph --all` |
| Hoàn tác file | `git checkout -- file.js` |
| Xóa branch | `git branch -d branch-name` |

---

## 🆘 Cứu Hộ Khẩn Cấp

### "Tôi commit nhầm vào master!"
```bash
# Tạo branch mới từ commit hiện tại
git branch feature/new-branch

# Quay master về commit trước
git reset --hard HEAD~1

# Chuyển sang branch mới
git checkout feature/new-branch
```

### "Tôi muốn bỏ tất cả thay đổi!"
```bash
git checkout -- .           # Bỏ thay đổi chưa commit
git reset --hard HEAD       # Bỏ tất cả (NGUY HIỂM!)
```

### "Tôi muốn xem code trước khi merge!"
```bash
git diff master..feature/branch-name
```

---

## 📱 Alias (Lệnh Tắt)

Thêm vào `~/.gitconfig`:
```bash
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    lg = log --oneline --graph --all
    last = log -1 HEAD
```

Sau đó dùng:
```bash
git st          # thay vì git status
git co master   # thay vì git checkout master
git br          # thay vì git branch
git lg          # thay vì git log --oneline --graph --all
```

---

## 🎯 Checklist Trước Khi Commit

- [ ] Code chạy được không?
- [ ] Đã test chưa?
- [ ] Commit message rõ ràng chưa?
- [ ] Có file không cần thiết không? (node_modules, .env)
- [ ] Đã pull code mới nhất chưa?

---

## 📞 Cần Giúp?

```bash
git status      # Xem trạng thái hiện tại
git log         # Xem lịch sử
git branch      # Xem branch
```

Hoặc đọc `GIT_WORKFLOW.md` để hiểu chi tiết hơn! 📚
