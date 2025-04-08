const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
// Importing the User model
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const { createTransaction } = require('../components/transaction');

router.get('/history', async (req, res) => {
  try{
    const transactions = await Transaction.find({ user: req.session.userId }).sort({ date: -1 });
    if (!transactions || transactions.length == 0) {
      return res.status(404).json({ message: "No transactions found" });
    }
    res.render('transactionHistory', { transactions });
  }catch(error){
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Add Expense Form
router.get('/addexpense', async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render('addExpensePage', { user });
});

// GET - Add Saving Form
router.get('/addsaving', async (req, res) => {
  const user = await User.findById(req.session.userId).lean();
  res.render('addSavingPage', { user });
});

// Create a new transction
router.post('/', createTransaction);
router.post('/history', async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.session.userId }).sort({ date: -1 });
        if (!transactions || transactions.length == 0) {
            return res.status(404).json({ message: "No transactions found" });
        }
        res.status(200).json(transactions);
    } catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST - Add New Category
router.post('/addcategory', async (req, res) => {
  const { newCategory } = req.body;
  const user = await User.findById(req.session.userId);

  if (!user.customCategories.includes(newCategory)) {
    user.customCategories.push(newCategory);
    await user.save();
  }

  res.redirect('/transaction/addexpense');
});

// POST - Add Expense
router.post('/addexpense', async (req, res) => {
  const { amount, category, description } = req.body;

  const transaction = new Transaction({
    user: req.session.userId,
    amount,
    category,
    description,
    transactionType: "expense",
  });

  await transaction.save();

  // Deduct from user's balance
  const user = await User.findById(req.session.userId);
  user.currentBalance -= Number(amount);
  await user.save();

  res.redirect('/dashboard');
});

// POST - Add Saving
router.post('/addsaving', async (req, res) => {
  const userId = req.session.userId;
  const { amount, description, goalName } = req.body;

  const transaction = new Transaction({
    user: userId,
    transactionType: 'save',
    amount,
    description,
    goalName: goalName || undefined
  });

  await transaction.save();

  // update user balance, etc., if needed
  await User.findByIdAndUpdate(userId, { $inc: { currentBalance: amount } });

  res.redirect('/dashboard');
});


router.get("/expenses/daily", async (req, res) => {
    try {
        const userId = req.session.userId;
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