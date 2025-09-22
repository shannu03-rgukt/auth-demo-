onst express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// Secret key for JWT
const SECRET_KEY = "your_secret_key"; // You can change this

// In-memory users array
const users = [];

// Task 1: Register API
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.json({ message: "User registered successfully" });
});

// Task 1 + Task 2: Login API
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (valid) {
    // Generate JWT token
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login Successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Task 2: Protected Route /profile (without try/catch)
app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  // Verify JWT with callback to handle errors
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    res.json({ message: Welcome ${decoded.username} });
  });
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
