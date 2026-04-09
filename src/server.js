import express from 'express';
import next from 'next';
import { config } from './config/env.js';
import vapiRoutes from './routes/vapi.js';
import googleRoutes from './routes/google.js';
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: './dashboard' });
const handle = nextApp.getRequestHandler();
nextApp.prepare().then(() => {
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
    // Handle all other requests with Next.js
    app.all('*splat', (req, res) => {
        return handle(req, res);
    });
    // Start the server
    app.listen(config.port, () => {
        console.log(`> Hybrid Server ready on http://localhost:${config.port}`);
        console.log(`> Vapi Webhook URL: http://localhost:${config.port}/api/vapi-webhook`);
    });
});
//# sourceMappingURL=server.js.map