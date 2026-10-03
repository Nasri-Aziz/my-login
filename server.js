const bcrypt = require("bcrypt");
const express = require("express");
const Database = require("better-sqlite3");

const app = express();

app.use(express.static("."));
app.use(express.json());

const db = new Database("users.db");

// ===============================
// Add profile columns if missing
// ===============================

try {
  db.prepare("ALTER TABLE users ADD COLUMN nom TEXT").run();
} catch (error) {}

try {
  db.prepare("ALTER TABLE users ADD COLUMN prenom TEXT").run();
} catch (error) {}

try {
  db.prepare("ALTER TABLE users ADD COLUMN cin TEXT").run();
} catch (error) {}

try {
  db.prepare("ALTER TABLE users ADD COLUMN telephone TEXT").run();
} catch (error) {}

try {
  db.prepare("ALTER TABLE users ADD COLUMN photo TEXT").run();
}catch (error) {}

// ===============================
// Get users
// ===============================

app.get("/api/users", (req, res) => {
  const users = db.prepare("SELECT id, email FROM users").all();

  res.json(users);
});

// ===============================
// LOGIN
// ===============================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (user && bcrypt.compareSync(password, user.password)) {
    res.json({
      success: true,
      message: "Login successful",
      userId: user.id
    });
  } else {

    res.json({
      success: false,
      message: "Email or password incorrect",
    });
  }
});

// ===============================
// REGISTER
// ===============================

app.post("/api/register", (req, res) => {
  const { email, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  try {
    db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(
      email,
      hash
    );

    res.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Email already exists",
    });
  }
});

// ===============================
// GET PROFILE
// ===============================

app.get("/api/profile/:id", (req, res) => {
  const userId = req.params.id;

  const user = db
    .prepare(
      `SELECT id, email, nom, prenom, cin, telephone, photo
       FROM users
       WHERE id = ?`
    )
    .get(userId);

  if (user) {
    res.json({
      success: true,
      user: user
    });
  } else {
    res.json({
      success: false,
      message: "User not found"
    });
  }
});

// ===============================
// UPDATE PROFILE
// ===============================

app.put("/api/profile/:id", (req, res) => {
  const userId = req.params.id;

  const { nom, prenom, cin, telephone, photo } = req.body;

  db.prepare(
    `UPDATE users
     SET nom = ?,
         prenom = ?,
         cin = ?,
         telephone = ?,
         photo = ?
     WHERE id = ?`
  ).run(
    nom,
    prenom,
    cin,
    telephone,
    photo,
    userId
  );

  res.json({
    success: true,
    message: "Profile updated successfully"
  });
});

// ===============================
// SERVER
// ===============================

app.listen(3000, () => {
  console.log("Server running on port 3000");
});