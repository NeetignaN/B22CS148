console.log("=== THIS IS THE CORRECT SERVER ===");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running...");
});
//other
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/url", require("./routes/urlRoutes"));

app.get("/api/test", (req, res) => res.send("Test route works!"));

app.use((req, res) => {
  res.status(404).json({ message: "Page Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server runnign at ${PORT}`);
});
