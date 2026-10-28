
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler.js");
const healthRoutes = require("./routes/healthRoutes.js");
const applicationRoutes = require("./routes/applicationRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const app = express();

// Read JSON data sent in HTTP requests
// app.use(express.json());
// app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Health test route
app.use("/api/test-health", healthRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    number: 345383,
    email: "rishabhkumarsingh0507@gamil.com",
    service: "cloud-access-portal-api",
    message: "API is healthy"
  });
});


app.use(errorHandler);
module.exports = app;
