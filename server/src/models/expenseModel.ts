import mongoose from "mongoose";
import type { Expense } from "../types/expenseType.js";

interface ExpenseDocument extends Omit<Expense, 'id'>, mongoose.Document {}

const expenseSchema = new mongoose.Schema({
  description: { type: String },
  amount: {
    amount: { type: Number, required: true },
    currency: { type: String, required: true }
  },
  category: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

const ExpenseModel = mongoose.model<ExpenseDocument>('Expense',expenseSchema);
export default ExpenseModel;