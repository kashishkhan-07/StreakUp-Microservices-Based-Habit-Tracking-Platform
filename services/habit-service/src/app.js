import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import habitRoutes from './routes/habitRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'habit-service', timestamp: new Date() });
});

// Mount routes
app.use('/api/habits', habitRoutes);
app.use('/', habitRoutes);

// Error handling
app.use(errorHandler);

export default app;