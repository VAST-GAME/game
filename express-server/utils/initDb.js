require("dotenv").config();
const { sequelize } = require("../config/database");
const User = require("../models/User");

// Function to sync all models with the database
const initDb = async () => {
  try {
    // Force sync all models
    // WARNING: This will drop existing tables
    await sequelize.sync({ force: true });
    console.log("Database synced successfully");

    // Create a default user for testing
    await User.create({
      email: "test@example.com",
      password: "StrongPass123!",
    });
    console.log("Test user created");

    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

// Run the initialization
initDb();
