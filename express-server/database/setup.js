// database/setup.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcryptjs"); // For hashing a default admin password if needed

// Define the path to the database file
const dbPath = path.resolve(__dirname, "main.db");

// Create or open the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    createUsersTable();
  }
});

function createUsersTable() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      profile TEXT, -- Storing JSON as TEXT
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Trigger to update 'updatedAt' timestamp (SQLite specific)
  const createUpdatedAtTriggerSql = `
    CREATE TRIGGER IF NOT EXISTS update_users_updatedAt
    AFTER UPDATE ON users
    FOR EACH ROW
    BEGIN
        UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `;

  db.serialize(() => {
    // Use serialize to ensure statements run in order
    db.run(createTableSql, (err) => {
      if (err) {
        console.error("Error creating users table", err.message);
      } else {
        console.log("Users table created or already exists.");
        // You could add a default admin user here for testing if needed
        // seedAdminUser(); // Optional
      }
    });
    db.run(createUpdatedAtTriggerSql, (err) => {
      if (err) {
        console.error("Error creating updatedAt trigger for users table", err.message);
      } else {
        console.log("UpdatedAt trigger for users table created or already exists.");
      }
    });
  });
}

// Optional: Seed an admin user (example)
// async function seedAdminUser() {
//   const adminEmail = 'admin@example.com';
//   const adminPassword = 'AdminPassword123!';
//   try {
//     const row = await new Promise((resolve, reject) => {
//       db.get('SELECT email FROM users WHERE email = ?', [adminEmail], (err, row) => {
//         if (err) reject(err);
//         resolve(row);
//       });
//     });

//     if (!row) {
//       const hashedPassword = await bcrypt.hash(adminPassword, 10);
//       db.run('INSERT INTO users (email, password, profile) VALUES (?, ?, ?)',
//         [adminEmail, hashedPassword, JSON.stringify({ role: 'admin' })],
//         (err) => {
//           if (err) console.error('Error seeding admin user', err.message);
//           else console.log('Admin user seeded.');
//         }
//       );
//     }
//   } catch (error) {
//     console.error('Error checking/seeding admin user', error);
//   }
// }

// Close the database connection when the script is done (if run directly)
// or handle connections per request in the app.
// For a setup script, you might want to close it.
// db.close((err) => {
//   if (err) console.error('Error closing database', err.message);
//   else console.log('Database connection closed.');
// });

module.exports = db; // Export the db connection for use in the app
