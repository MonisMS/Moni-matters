import express from 'express';
import type {Request,Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import expeseseRouter from './routes/expenseRoutes.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

connectDB();

app.use(express.json());
app.use('/api/v1/expenses', expeseseRouter);

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
})