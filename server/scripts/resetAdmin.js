const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/user");

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Đã kết nối MongoDB");

    // Mật khẩu mới cho admin
    const newPassword = "admin123";
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Tìm và cập nhật admin
    let admin = await User.findOne({ username: "admin" });

    if (admin) {
      // Nếu đã có admin, reset mật khẩu
      admin.password = hashedPassword;
      await admin.save();
      console.log("\n✅ Đã reset mật khẩu admin!");
    } else {
      // Nếu chưa có admin, tạo mới
      admin = await User.create({
        name: "Admin",
        username: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
        avatar: "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=150"
      });
      console.log("\n✅ Đã tạo tài khoản admin mới!");
    }

    console.log("\n📋 Thông tin đăng nhập:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("\n🎉 Bạn có thể login ngay bây giờ!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

resetAdmin();
