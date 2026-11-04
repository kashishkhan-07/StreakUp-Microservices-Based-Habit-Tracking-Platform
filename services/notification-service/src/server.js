import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { startNotificationConsumer } from './events/rabbitMQConsumer.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'notification-service' });
});

app.use('/api/notifications', notificationRoutes);
app.use('/', notificationRoutes);

const PORT = process.env.PORT || 5004;

const startServer = async () => {
  await connectDB();
  startNotificationConsumer().catch((err) => console.warn('RabbitMQ consumer warning:', err.message));
  app.listen(PORT, () => {
    console.log(`🚀 [Notification Service] Running on http://localhost:${PORT}`);
  });
};

startServer();
