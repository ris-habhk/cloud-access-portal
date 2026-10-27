
const express = require("express");
const Application = require("../models/Application");
const mongoose = require("mongoose");
const router = express.Router();

// GET /api/applications
router.get("/", async (req, res, next) => {
  try {
    const applications = await Application.find({ isActive: true })
      .select("name description category isActive")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
});



router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID"
      });
    }

    const application = await Application.findOne({
      _id: id,
      isActive: true
    }).select("name description category isActive");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
});




module.exports = router;
