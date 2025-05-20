// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/protected
router.get("/protected", protect, userController.getProtectedData);

// GET /api/profile
router.get("/profile", protect, userController.getUserProfile);

module.exports = router;
