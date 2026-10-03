const bcrypt = require("bcrypt");
const Database = require("better-sqlite3");

const db = new Database("users.db");

const password = "123456";

const hash = bcrypt.hashSync(password, 10);

db.prepare(
    "UPDATE users SET password = ? WHERE email = ?"
).run(hash, "aziz@gmail.com");

console.log("Password hashed successfully!");
console.log(hash);