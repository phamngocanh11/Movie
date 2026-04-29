const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/user");

const fixAvatars = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Đã kết nối MongoDB");

    // Tìm tất cả users có avatar từ via.placeholder.com
    const users = await User.find({
      avatar: { $regex: /via\.placeholder\.com/i }
    });

    console.log(`\n🔍 Tìm thấy ${users.length} users cần cập nhật avatar`);

    // Cập nhật từng user
    for (const user of users) {
      const newAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=150`;
      user.avatar = newAvatar;
      await user.save();
      console.log(`✅ Đã cập nhật avatar cho: ${user.username}`);
    }

    console.log("\n🎉 Hoàn tất cập nhật avatars!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

fixAvatars();
