import type { Request, Response } from 'express';
import ExpenseModel from '../models/expenseModel.js';
export const addExpense = async (req:Request,res:Response):Promise<Response> =>{
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

export const getExpenses = async (req:Request,res:Response):Promise<Response> =>{
try {
    const expenses = await ExpenseModel.find().sort({date:-1});
return res.status(200).json({expenses});
    
} catch (error) {
        console.error("error in getExpenses Controller",error);
    return res.status(500).json({message: 'Internal server error'});
}
}

export const  updateExpense = async (req:Request,res:Response):Promise<Response> =>{
try {
    const id = req.params.id;
    const  {amount, currency, description, category, date} = req.body;
    const updatedExpense  = await ExpenseModel.findByIdAndUpdate(id,{
        amount: {
            amount,
            currency
        },
        description,
        category,
        date
    },{new: true});
    if(!updatedExpense) {
        return res.status(404).json({message: 'Expense not found'});
    }
    return res.status(200).json({message: 'Expense updated successfully', updatedExpense});
} catch (error) {
    console.log("error in updateExpense Controller",error);
    return res.status(500).json({message: 'Internal server error'});
}
}

export const deleteExpense = async (req:Request,res:Response):Promise<Response> =>{
    try {
        const id = req.params.id;
        const deletedExpense = await ExpenseModel.findByIdAndDelete(id);
        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        return res.status(200).json({ message: 'Expense deleted successfully', deletedExpense });
    } catch (error) {
        console.error("error in deleteExpense Controller",error);
        return res.status(500).json({message: 'Internal server error'});    
    }
}