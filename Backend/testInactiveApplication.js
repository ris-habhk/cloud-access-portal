
require("dotenv").config();

const mongoose = require("mongoose");
const Application = require("../cloud-access-portal/Backend/src/models/Application");

async function testInactiveApplication() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to:", mongoose.connection.name);

    const testApplication = await Application.create({
      name: "TEMP Inactive Test App",
      description: "Temporary record for inactive application testing",
      category: "Testing",
      isActive: false
    });

    console.log("Temporary application created.");
    console.log("Temporary ID:", testApplication._id.toString());
  } catch (error) {
    console.error("Test failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

testInactiveApplication();
