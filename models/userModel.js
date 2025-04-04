const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  customCategories: { 
    type: [String], 
    default: ["Food", "Travel", "Games", "Shopping", "Other"] 
  },
  subscriptions: [
    {
      name: { type: String, required: true },
      cost: { type: Number, required: true },  
    }
  ],
  goals: [
    {
      goalName: { type: String, required: true },
      goalAmount: { type: Number, required: true },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
