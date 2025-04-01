const TransactionSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['expense', 'withdraw', 'saved'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = mongoose.model('Transaction', TransactionSchema);
  