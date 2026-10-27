import app from './app.js';
import { config } from './config/index.js';

app.listen(config.port, () => {
  console.log(`🌐 [API Gateway] Listening on http://localhost:${config.port}`);
  console.log(`   └─ Routing /api/auth          -> ${config.services.auth}`);
  console.log(`   └─ Routing /api/habits        -> ${config.services.habits}`);
  console.log(`   └─ Routing /api/analytics     -> ${config.services.analytics}`);
  console.log(`   └─ Routing /api/notifications -> ${config.services.notifications}`);
});