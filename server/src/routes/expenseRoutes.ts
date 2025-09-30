import { Router } from "express";

import { addExpense,getExpenses, updateExpense,deleteExpense } from "../controllers/ExpenseController.js";

const expeseseRouter = Router();

expeseseRouter.post('/add',addExpense);
expeseseRouter.get('/get',getExpenses);
expeseseRouter.put('/:id', updateExpense);
expeseseRouter.delete('/:id',deleteExpense);
export default expeseseRouter;