const express = require("express");

const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

// Destructured import to match module.exports = { protect }
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", protect, getMe);

router.post("/logout", protect, (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;