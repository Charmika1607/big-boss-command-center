import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { readDB } from './database/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Root API Health
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'BIG BOSS COMMAND CENTER CORE',
    version: '2.0.0',
    time: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} not found on Big Boss Core API.`
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Command Center server error occurred.'
  });
});

// Ensure DB is initialized
readDB();

app.listen(PORT, () => {
  console.log(`👁️ BIG BOSS COMMAND CENTER SERVER RUNNING ON PORT ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
