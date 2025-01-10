const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Food and groceries", "Transportation", "Utilities"]
    },
    method: {
      type: String,
      require: true,
      enum: ["Bank Transfer", "Cash", "Credit Card"]
    },
    date: {
      type: Date,
      default: null,
    }},{timestamps: true}
);

expenseSchema.index({ user: 1, createdAt: -1 });
const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;