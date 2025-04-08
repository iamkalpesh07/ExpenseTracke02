const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", required: true 
  },

  amount: { 
    type: Number, 
    required: true 
  },

  transactionType: { 
    type: String, 
    required: true, 
    enum: ["expense", "save"] 
  },

  category: { 
    type: String, 
    required: function() { return this.transactionType === "expense"; } 
  },

  description: {
    type: String,
    required: false,
    default: null,
  },
  goalName: {
    type: String,
    default: null
  },

  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;