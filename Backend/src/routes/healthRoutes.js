
const express = require("express");

const router = express.Router(); // route handler handle http methods operations here

router.get("/", (req, res) => {   // "/" is the endpoints here 
  res.status(200).json({
    success: true,
    message: "Health route works!"
  });
});

module.exports = router;
