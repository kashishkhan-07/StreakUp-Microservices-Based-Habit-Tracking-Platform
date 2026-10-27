import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { setupProxies } from './routes/proxyRoutes.js';
import { gatewayErrorHandler } from './middleware/errorHandler.js';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(morgan('dev'));
app.use(globalLimiter);

// Gateway Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'api-gateway',
    timestamp: new Date(),
  });
});

// Setup downstream service reverse proxies
setupProxies(app);

// Gateway Error Handler
app.use(gatewayErrorHandler);

export default app;