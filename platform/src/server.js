#!/usr/bin/env node
/**
 * SPARC Evolution Platform Server
 * Comprehensive educational platform for SPARC methodology learning
 * Author: SPARC Evolution Team
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import route modules
const apiRoutes = require('./api/routes');

// Basic logging
const logger = {
    info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
    error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`)
};

// Basic error handler
const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
};

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Allow external connections for Codespaces

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "ws:"]
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://sparc-evolution.com', 'https://www.sparc-evolution.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/examples', express.static(path.join(__dirname, '../examples')));

// API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: require('../package.json').version
  });
});

// SPARC methodology info endpoint
app.get('/api/sparc-info', (req, res) => {
  res.json({
    methodology: 'SPARC',
    creator: 'Reuven Cohen',
    versions: ['1.0', '2.0', '3.0'],
    steps: [
      'Specifications',
      'Pseudocode', 
      'Architecture',
      'Refinement',
      'Completion'
    ],
    repositories: [
      'https://github.com/ruvnet/sparc',
      'https://www.npmjs.com/package/@agentics.org/sparc2',
      'https://www.npmjs.com/package/create-sparc',
      'https://www.npmjs.com/package/claude-flow',
      'https://github.com/ruvnet/claude-flow'
    ]
  });
});

// Serve frontend HTML for SPA routes
app.get('*', (req, res) => {
  const htmlPath = path.join(__dirname, '../src/frontend/index.html');
  if (require('fs').existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>SPARC Evolution Platform</title></head>
      <body>
        <h1>SPARC Evolution Platform</h1>
        <p>Platform is running! API endpoints are available at <a href="/api/health">/api/health</a></p>
        <p>Frontend HTML not found at expected location. Check PORTS tab for Codespace URL.</p>
      </body>
      </html>
    `);
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Socket.IO for real-time features
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://sparc-evolution.com']
      : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
});

// Real-time collaboration for playground
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);
  
  socket.on('join-playground', (playgroundId) => {
    socket.join(`playground-${playgroundId}`);
    socket.to(`playground-${playgroundId}`).emit('user-joined', socket.id);
  });
  
  socket.on('code-change', (data) => {
    socket.to(`playground-${data.playgroundId}`).emit('code-update', data);
  });
  
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, HOST, () => {
  logger.info(`SPARC Evolution Platform running on ${HOST}:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Local access: http://localhost:${PORT}`);
  logger.info(`Codespace access: Check the PORTS tab in VS Code for the public URL`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

module.exports = app;