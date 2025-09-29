import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async (): Promise<void>=> {
    try {
        const mongoURI = process.env.MONGODB_URL || '';
        if (!mongoURI) {
            throw new Error('MONGODB_URL is not defined in environment variables');
        }
        await mongoose.connect(mongoURI);
        console.log(`MongoDB connected: ${mongoose.connection.host}`);
                
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message: "Unknown error";
       console.log(`Database connection failed : ${errorMessage}`);
         process.exit(1);
       
    }

}

export default connectDB;