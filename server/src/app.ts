import express from 'express';
import type {Request,Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import expeseseRouter from './routes/expenseRoutes.js';
import { ok } from './utils/reponse.js';
import { errorHandler } from './middlewares/errorHandler.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
connectDB();

app.get('/api/v1/health',(req:Request,res:Response) =>{
    res.json(ok('OK',{env: process.env.NODE_ENV || 'development'}));
});
app.use('/api/v1/expenses', expeseseRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);


app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
})