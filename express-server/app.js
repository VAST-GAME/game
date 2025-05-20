// app.js (snippet - changes)
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const db = require("./database/setup"); // Import the SQLite db instance

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { errorHandler } = require("./middleware/errorHandler"); // You'll create this

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Make db available to routes if needed (e.g., via req.db)
// Or import it directly in your models/controllers
app.use((req, res, next) => {
  req.db = db;
  next();
});

// API Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing
