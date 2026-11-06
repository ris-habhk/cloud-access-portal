
require("dotenv").config();

const mongoose = require("mongoose");
const Application = require("./src/models/Application.js");

const applications = [
  {
    name: "AWS Console",
    description: "Manage cloud infrastructure and services",
    category: "Cloud",
    risk: "High"
  },
  {
    name: "GitHub",
    description: "Manage repositories and collaborate on code",
    category: "Development",
    risk: "Medium"
  },
  {
    name: "Jira",
    description: "Manage tasks, projects, and workflows",
    category: "Productivity",
    risk: "Low"
  },
  {
    name: "Grafana",
    description: "Monitor systems and visualize metrics",
    category: "Monitoring",
    risk: "Medium"
  }
];

async function seedApplications() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to:", mongoose.connection.name);

    for (const application of applications) {
      await Application.updateOne(
        { name: application.name },
        { $setOnInsert: application, $set: { risk: application.risk } },
        { upsert: true, runValidators: true }
      );
    }

    console.log("Application catalog seeded successfully.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedApplications();
