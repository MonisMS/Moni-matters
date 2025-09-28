import express from 'express';
import type {Request,Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

connectDB();

app.get('/',(req:Request,res:Response) =>{
    res.send('Hello World!');
})

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
})