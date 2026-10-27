
const express = require("express");
const errorHandler = require("./middleware/errorHandler.js");
const healthRoutes = require("./routes/healthRoutes.js");
const applicationRoutes = require("./routes/applicationRoutes.js");
const app = express();

// Read JSON data sent in HTTP requests
app.use(express.json());

// Health test route
app.use("/api/test-health", healthRoutes);
app.use("/api/applications", applicationRoutes);
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
