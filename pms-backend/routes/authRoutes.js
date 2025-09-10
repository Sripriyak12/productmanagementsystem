const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

// POST /register
router.post("/register", async (req, res) => {
  let { username, password } = req.body;

  // Trim to avoid accidental spaces
  username = username ? username.trim() : "";
  password = password ? password.trim() : "";

  console.log("📥 Register request body:", { username, password });

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // ❌ DO NOT hash here — let the pre-save hook in User.js handle it
    const user = new User({
      username,
      password, // plain text — will be hashed automatically
      role: "user"
    });

    await user.save();
    console.log("✅ User saved:", user);

    res.status(201).json({
      message: "User registered successfully",
      user: { username: user.username, role: user.role }
    });

  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  let { username, password } = req.body;

  // Trim to avoid accidental spaces
  username = username ? username.trim() : "";
  password = password ? password.trim() : "";

  console.log("📥 Login request body:", { username, password });

  try {
    const user = await User.findOne({ username });
    console.log("🔍 User found in DB:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);
    console.log("✅ Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { username: user.username, role: user.role }
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
