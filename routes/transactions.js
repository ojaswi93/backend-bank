const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "your_jwt_secret";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

router.get("/", authenticate, (req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT * FROM transactions WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json(results);
    }
  );
});

router.post("/deposit", authenticate, (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  db.query(
    'INSERT INTO transactions (user_id, type, amount) VALUES (?, "deposit", ?)',
    [userId, amount],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Error processing deposit" });
      res.json({ message: "Deposit successful" });
    }
  );
});

router.post("/withdraw", authenticate, (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  db.query(
    'SELECT SUM(CASE WHEN type = "deposit" THEN amount ELSE -amount END) AS balance FROM transactions WHERE user_id = ?',
    [userId],
    (err, result) => {
      const balance = result[0].balance || 0;

      if (amount > balance) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      db.query(
        'INSERT INTO transactions (user_id, type, amount) VALUES (?, "withdrawal", ?)',
        [userId, amount],
        (err) => {
          if (err)
            return res.status(500).json({ message: "Withdrawal failed" });
          res.json({ message: "Withdrawal successful" });
        }
      );
    }
  );
});

module.exports = router;
