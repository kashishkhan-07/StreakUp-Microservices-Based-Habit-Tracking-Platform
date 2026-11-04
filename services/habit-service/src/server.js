import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { connectRabbitMQ } from './events/rabbitMQPublisher.js';

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  await connectDB();
  // Connect RabbitMQ asynchronously so it doesn't block server startup
  connectRabbitMQ().catch((err) => console.warn('RabbitMQ init warning:', err.message));

  app.listen(PORT, () => {
    console.log(`🚀 [Habit Service] Running on http://localhost:${PORT}`);
  });
};

startServer();
