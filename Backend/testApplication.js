
require("dotenv").config();

const mongoose = require("mongoose");
const Application = require("./src/models/Application.js");

async function testApplication() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database in use:", mongoose.connection.name);
    console.log("Connected to MongoDB!");

    const application = await Application.create({
      name: "IAM Test Application",
      description: "Temporary test record for the Cloud Access Portal",
      category: "Testing"
    });

    console.log("Application saved successfully:");
    console.log(application.toObject());

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Test failed:", error.message);
    await mongoose.disconnect().catch(() => {});
    process.exitCode = 1;
  }
}

testApplication();
