const Transaction = require('../models/transactionModel');
const createTransaction = async (req, res) => {
    try {
        const { transactionType, amount, description, category } = req.body;
        if (!req.session.userId || !type || !amount) {
            return res.status(400).json({ message: "User, type, and amount are required" });
        }
        const validTypes = ["expense", "save"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid transaction type" });
        }
        const transaction = new Transaction({
            user: req.session.userId,
            transactionType,
            amount,
            description,
            category
        });
        await transaction.save();
        res.status(201).json({ message: "Transaction created successfully", transaction });

    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {createTransaction};