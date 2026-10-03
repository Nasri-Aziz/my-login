const Database = require("better-sqlite3");

const db = new Database("users.db");

console.log("Database connected!");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

console.log("Users table created!");

const insert = db.prepare(`
    INSERT INTO users (email, password)
    VALUES (?, ?)
`);

insert.run("aziz@gmail.com", "123456");

console.log("User added!");