const express = require("express");
const router = express.Router();
const User = require('../models/userModel');

// GET - Show add subscription form
router.get("/add", (req, res) => {
  res.render("addSubscription");
});

// POST - Handle subscription addition
router.post("/add", async (req, res) => {
  const { name, cost } = req.body;

  try {
    await User.findByIdAndUpdate(
      req.session.userId,
      { $push: { subscriptions: { name, cost } } },
      { new: true }
    );

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});

module.exports = router;
