import type { Request, Response } from 'express';
import ExpenseModel from '../models/expenseModel.js';
export const addExpense = async (req:Request,res:Response) =>{
try {
    const {amount, currency, description, category, date} = req.body;
    if(!amount || !currency || !category || !date) {
        return res.status(400).json({message: 'Please fill all required fields'});
    }
    const newExpense = {
        amount: {
            amount,
            currency
        },
        description: description || '',
        category,
        date
    };
    const expense = new ExpenseModel(newExpense);
    await expense.save();
    return res.status(201).json({message: 'Expense added successfully', expense});
} catch (error) {
      console.error("error in addExpense Controller",error);
    return res.status(500).json({message: 'Internal server error'});
  
}
}