const Transaction = require('../models/transactionModel');

const createTransaction = async (req, res) => {
    try {
        const { type, amount, description } = req.body;
        if (!req.session.id || !type || !amount) {
            return res.status(400).json({ message: "User, type, and amount are required" });
        }
        const validTypes = ["expense", "withdraw", "saved"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid transaction type" });
        }
        const transaction = new Transaction({
            user: req.session.id,
            type,
            amount,
            description
        });
        await transaction.save();
        res.status(201).json({ message: "Transaction created successfully", transaction });

    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {createTransaction};