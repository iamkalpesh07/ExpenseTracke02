const express = require("express");
const router = express.Router();
const User = require('../models/userModel');

// GET: Add goal form
router.get("/add", (req, res) => {
  res.render("addGoal");
});

// POST: Save new goal
router.post("/add", async (req, res) => {
  const { goalName, goalAmount } = req.body;

  try {
    await User.findByIdAndUpdate(
      req.session.userId,
      { $push: { goals: { goalName, goalAmount } } },
      { new: true }
    );

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error adding goal:", err);
    res.status(500).send("Failed to add goal.");
  }
});

module.exports = router;
