import mongoose from "mongoose";

// Matches the existing documents in the "test" database's "expenses" collection:
// _id, userId, amount, category, description, date, receiptUrl, createdAt, __v
const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
    },
    receiptUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Explicitly bind to the existing "expenses" collection
const Expense = mongoose.model("Expense", expenseSchema, "expenses");

export default Expense;
