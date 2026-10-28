
require("dotenv").config();

const mongoose = require("mongoose");
const Application = require("../cloud-access-portal/Backend/src/models/Application");

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await Application.deleteOne({
      _id: "6ae0782405a693531e29e287",
      name: "TEMP Inactive Test App",
      isActive: false
    });

    console.log("Temporary records deleted:", result.deletedCount);

    if (result.deletedCount !== 1) {
      console.log("No matching record was deleted. Check the record before retrying.");
    }
  } catch (error) {
    console.error("Cleanup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

cleanup();
