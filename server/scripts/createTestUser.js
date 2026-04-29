const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/user");

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Đã kết nối MongoDB");

    // Tạo user test
    const hashedPassword = bcrypt.hashSync("123456", 10);
    
    const testUser = {
      name: "Test User",
      username: "test",
      email: "test@gmail.com",
      password: hashedPassword,
      role: "user",
      avatar: "https://ui-avatars.com/api/?name=Test+User&background=random&size=150"
    };

    // Xóa user test cũ nếu có
    await User.deleteOne({ username: "test" });
    
    // Tạo user mới
    await User.create(testUser);
    
    console.log("\n✅ Đã tạo user test:");
    console.log("   Username: test");
    console.log("   Password: 123456");
    console.log("\n🎉 Bạn có thể login với thông tin trên!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

createTestUser();
