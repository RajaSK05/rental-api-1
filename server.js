const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const propertyRoutes = require('./routes/properties');
const { router: authRoutes } = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for development and production
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:4000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:4000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:8080',
    // Add your production domain here when deploying
    // 'https://yourdomain.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (must come before property routes)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Rental Property API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/', propertyRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: [
      'GET / - List all platforms',
      'GET /magicbrix - Get MagicBrix properties',
      'GET /99acres - Get 99acres properties',
      'GET /housing - Get Housing.com properties',
      'GET /health - Health check',
      'POST /auth/login - User login',
      'GET /auth/verify - Verify JWT token',
      'POST /properties - Create property (Admin only)'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Rental Property API is running on port ${PORT}`);
  console.log(`📍 Available endpoints:`);
  console.log(`   GET http://localhost:${PORT}/ - List all platforms`);
  console.log(`   GET http://localhost:${PORT}/magicbrix - MagicBrix properties`);
  console.log(`   GET http://localhost:${PORT}/99acres - 99acres properties`);
  console.log(`   GET http://localhost:${PORT}/housing - Housing.com properties`);
  console.log(`   GET http://localhost:${PORT}/health - Health check`);
  console.log(`   POST http://localhost:${PORT}/auth/login - User login`);
  console.log(`   GET http://localhost:${PORT}/auth/verify - Verify JWT token`);
  console.log(`   POST http://localhost:${PORT}/properties - Create property (Admin only)`);
});

module.exports = app; 