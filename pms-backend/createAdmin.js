// createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // 1. Remove any existing productify users
    await User.deleteMany({ username: "productify" });

    // 2. Create the admin user with plain password
    const admin = new User({
      username: "productify",
      password: "productify_12", // plain text — will be hashed by pre-save hook
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin user created successfully");
    console.log("Use these credentials to log in:");
    console.log("username: productify");
    console.log("password: productify_12");

    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
})();
