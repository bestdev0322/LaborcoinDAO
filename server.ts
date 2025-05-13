import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import registrationRoutes from './routes/registrationRoutes';
import connectDB from './config/database';

const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', registrationRoutes);
app.get('/api/test', (req: Request, res: Response) => {
    res.json({ message: 'Hello World' });
});

// Error handling middleware
interface ErrorResponse extends Error {
    status?: number;
}

app.use((err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: 'Something went wrong!' });
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});