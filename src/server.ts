import express from 'express';
import { config } from './config/env';
import vapiRoutes from './routes/vapi';
import googleRoutes from './routes/google';

const app = express();

// Use express.json() to parse JSON bodies automatically
app.use(express.json());

// Register API Routes
app.use('/api', vapiRoutes);
app.use('/api/google', googleRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AI Phone Agent Backend is running.' });
});

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`Vapi Webhook URL: http://localhost:${config.port}/api/vapi-webhook`);
});
