const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
