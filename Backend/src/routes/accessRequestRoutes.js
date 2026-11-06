const express = require("express");
const mongoose = require("mongoose");
const AccessRequest = require("../models/AccessRequest.js");
const Application = require("../models/Application.js");
const authenticate = require("../middleware/authenticate.js");
const authorizeRoles = require("../middleware/authorizeRoles.js");

const router = express.Router();
const durations = ["4 Hours", "8 Hours (1 Day)", "7 Days", "30 Days"];
const managerRoles = ["manager", "admin"];

router.use(authenticate);

// Requesters can create access requests for active applications.
router.post("/", async (req, res, next) => {
  try {
    const { applicationId, duration, justification } = req.body || {};

    if (!mongoose.isValidObjectId(applicationId)) {
      return res.status(400).json({ success: false, message: "A valid application is required." });
    }
    if (!durations.includes(duration)) {
      return res.status(400).json({ success: false, message: "Choose a valid access duration." });
    }
    if (typeof justification !== "string" || justification.trim().length < 20 || justification.trim().length > 1000) {
      return res.status(400).json({ success: false, message: "Justification must contain 20 to 1000 characters." });
    }

    const application = await Application.findOne({ _id: applicationId, isActive: true });
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found or inactive." });
    }

    const request = await AccessRequest.create({
      application: application._id,
      requester: req.auth.userId,
      duration,
      justification: justification.trim(),
    });

    const populated = await AccessRequest.findById(request._id)
      .populate("application", "name description category risk")
      .populate("requester", "name email role")
      .lean();

    return res.status(201).json({ success: true, message: "Access request submitted.", data: populated });
  } catch (error) {
    next(error);
  }
});

// Requesters can see only their own requests.
router.get("/mine", async (req, res, next) => {
  try {
    const requests = await AccessRequest.find({ requester: req.auth.userId })
      .populate("application", "name category risk")
      .populate("requester", "name email role")
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
});

// Managers/admins can review the organization inbox.
router.get("/", authorizeRoles(...managerRoles), async (req, res, next) => {
  try {
    const requests = await AccessRequest.find()
      .populate("application", "name category risk")
      .populate("requester", "name email role")
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
});

// Only managers/admins can decide a pending request.
router.patch("/:id/decision", authorizeRoles(...managerRoles), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision, rejectionReason } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid request ID." });
    }
    if (!["Approved", "Rejected"].includes(decision)) {
      return res.status(400).json({ success: false, message: "Decision must be Approved or Rejected." });
    }
    if (decision === "Rejected" && (typeof rejectionReason !== "string" || rejectionReason.trim().length < 10)) {
      return res.status(400).json({ success: false, message: "A rejection reason of at least 10 characters is required." });
    }

    const updated = await AccessRequest.findOneAndUpdate(
      { _id: id, status: "Pending" },
      {
        $set: {
          status: decision,
          reviewer: req.auth.userId,
          reviewedAt: new Date(),
          rejectionReason: decision === "Rejected" ? rejectionReason.trim() : "",
        },
      },
      { new: true, runValidators: true }
    )
      .populate("application", "name category risk")
      .populate("requester", "name email role")
      .populate("reviewer", "name email");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Pending request not found; it may already have been reviewed." });
    }

    res.status(200).json({
      success: true,
      message: `Request ${decision.toLowerCase()}.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
