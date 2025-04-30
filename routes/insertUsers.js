const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // replace if different
  password: "ojaswi", // replace with your password
  database: "banking_system", // replace if different
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }

  console.log("Connected to MySQL");

  const users = [
    {
      email: "newcustomer1@example.com",
      password: "password123",
      role: "customer",
    },
    {
      email: "newcustomer2@example.com",
      password: "password123",
      role: "customer",
    },
    {
      email: "newcustomer3@example.com",
      password: "password123",
      role: "customer",
    },
    { email: "newbanker@example.com", password: "admin123", role: "banker" },
  ];

  let remaining = users.length;

  users.forEach(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    connection.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [user.email, hashedPassword, user.role],
      (err, results) => {
        if (err) {
          console.error("Error inserting user:", err);
        } else {
          console.log(`Inserted user: ${user.email}`);
        }

        remaining--;
        if (remaining === 0) {
          connection.end();
        }
      }
    );
  });
});
