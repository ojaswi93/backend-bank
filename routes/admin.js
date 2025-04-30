const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "your_jwt_secret";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err || decoded.role !== "banker")
      return res.status(403).json({ message: "Forbidden" });
    req.user = decoded;
    next();
  });
};

router.get("/customers", authenticate, (req, res) => {
  db.query(
    'SELECT id, email FROM users WHERE role = "customer"',
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(results);
    }
  );
});

router.get("/transactions/:userId", authenticate, (req, res) => {
  const userId = req.params.userId;
  db.query(
    "SELECT * FROM transactions WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(results);
    }
  );
});

module.exports = router;
