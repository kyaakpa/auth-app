// server.js
const express = require("express");
const pgp = require("pg-promise")();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 5500;

app.use(express.json());
app.use(cookieParser());

const db = pgp({
  host: "your-database-host",
  port: "your-database-port",
  database: "your-database-name",
  user: "your-database-user",
  password: "your-database-password",
});

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.none("INSERT INTO users(username, password) VALUES($1, $2)", [
      username,
      hashedPassword,
    ]);
    res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(400).json({ error: "Username is already taken." });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.one("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials.");
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, "secret_key", {
      expiresIn: "1h",
    });

    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    res.status(401).json({ error: "Invalid credentials." });
  }
});

app.get("/api/logout", (req, res) => {
  // Clear the token cookie
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful." });
});

app.get("/api/user", async (req, res) => {
  const token = req.cookies.token;

  // Verify the JWT token
  try {
    const decoded = jwt.verify(token, "secret_key");
    const user = await db.one("SELECT * FROM users WHERE id = $1", [
      decoded.userId,
    ]);

    if (user) {
      res.status(200).json({ username: user.username });
    } else {
      res.status(401).json({ error: "Invalid token." });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
