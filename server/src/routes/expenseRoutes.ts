import { Router } from "express";

import { addExpense,getExpenses, updateExpense,deleteExpense } from "../controllers/ExpenseController.js";
import { validate } from "../middlewares/validate.js";

import { addExpenseSchema,updateExpenseSchema } from "../validators/expense.js";
const expeseseRouter = Router();

expeseseRouter.post('/add',validate(addExpenseSchema),addExpense);
expeseseRouter.get('/get',getExpenses);
expeseseRouter.put('/:id', validate(updateExpenseSchema), updateExpense);
expeseseRouter.delete('/:id',deleteExpense);
export default expeseseRouter;