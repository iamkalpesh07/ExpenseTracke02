const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
// Importing the User model
const Transaction = require('../models/transactionModel');
const { createTransaction } = require('../components/transaction');

// Create a new user
router.post('/', createTransaction);
router.post('/get-all-transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.session.id });
        if (!transactions || transactions.length == 0) {
            return res.status(404).json({ message: "No transactions found" });
        }
        res.status(200).json(transactions);
    } catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/expenses/daily", async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId("67f17552c9786eea89893080");
        const expenses = await Transaction.aggregate([
            {
              $match: {
                user: userId,
                transactionType: "expense",
                date: { $ne: null } // <-- prevent crash on null dates
              }
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$date" }
                },
                totalExpense: { $sum: "$amount" }
              }
            },
            {
              $sort: { _id: 1 }
            }
          ]);
      
        res.status(200).json({ expenses: expenses});
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});







module.exports = router;