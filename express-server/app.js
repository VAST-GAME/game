require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Import database
const { sequelize } = require("./config/database");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Import error handler
const { errorHandler } = require("./utils/errorHandler");

// Initialize Express app
const app = express();

// Connect to SQLite database
sequelize
  .authenticate()
  .then(() => {
    console.log("SQLite database connected");
    return sequelize.sync();
  })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(morgan("dev")); // Logging

// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Secure Authentication API" });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing
