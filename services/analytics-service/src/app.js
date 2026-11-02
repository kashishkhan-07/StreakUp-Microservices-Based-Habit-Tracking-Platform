import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'analytics-service', timestamp: new Date() });
});

// Routes
app.use('/api/analytics', analyticsRoutes);

// Error middleware
app.use(errorHandler);

export default app;