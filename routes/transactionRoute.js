const express = require('express');
const router = express.Router();

// Importing the User model
const Transaction = require('../models/transactionModel');
const { createTransaction } = require('../components/transaction');

// Create a new user
router.post('/', createTransaction);
router.post('/get-all-transactions', async (req, res) => {
    try{
        const transactions = await Transaction.find({user: req.session.id});
        if(!transactions || transactions.length == 0){
            return res.status(404).json({message: "No transactions found"});
        }
        res.status(200).json(transactions);
    }catch(err){
        console.error("Error fetching transactions:", err);
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;