// models/User.js
const bcrypt = require("bcryptjs");
const db = require("../database/setup"); // Use the initialized db connection

class User {
  static async create({ email, password, profile = {} }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (email, password, profile) VALUES (?, ?, ?)`;
    // profile should be a JSON string
    const profileString = JSON.stringify(profile);

    return new Promise((resolve, reject) => {
      // 'this' refers to the statement object in 'run', not the class instance
      // So we use db.run and get the lastID from the callback.
      db.run(sql, [email, hashedPassword, profileString], function (err) {
        if (err) {
          // Handle specific errors like UNIQUE constraint violation for email
          if (err.message.includes("UNIQUE constraint failed: users.email")) {
            return reject(new Error("Email already exists"));
          }
          return reject(err);
        }
        resolve({ id: this.lastID, email, profile });
      });
    });
  }

  static findByEmail(email) {
    const sql = `SELECT id, email, password, profile FROM users WHERE email = ?`;
    return new Promise((resolve, reject) => {
      db.get(sql, [email], (err, row) => {
        if (err) return reject(err);
        if (row && row.profile) {
          try {
            row.profile = JSON.parse(row.profile);
          } catch (e) {
            console.error("Failed to parse profile JSON for user:", row.email, e);
            row.profile = {}; // Default to empty object if parsing fails
          }
        }
        resolve(row);
      });
    });
  }

  static findById(id) {
    const sql = `SELECT id, email, profile FROM users WHERE id = ?`; // Exclude password
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        if (row && row.profile) {
          try {
            row.profile = JSON.parse(row.profile);
          } catch (e) {
            console.error("Failed to parse profile JSON for user ID:", row.id, e);
            row.profile = {};
          }
        }
        resolve(row);
      });
    });
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;
