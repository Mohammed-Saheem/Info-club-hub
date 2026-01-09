require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const projectsRoutes = require('./routes/projects');
const teamRoutes = require('./routes/team');
const galleryRoutes = require('./routes/gallery');
const contactRoutes = require('./routes/contact');
const applicationsRoutes = require('./routes/applications');
const statsRoutes = require('./routes/stats');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Allowed origins for CORS (supports multiple ports)
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:5173',
  FRONTEND_URL
];

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// CORS Configuration - allow multiple origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('   INFO CLUB HUB - Backend Server');
  console.log('========================================');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📡 API Base URL:      http://localhost:${PORT}/api`);
  console.log(`🌐 CORS enabled for:  ${FRONTEND_URL}`);
  console.log(`📁 Environment:       ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================');
  console.log('\n📌 Available API Endpoints:');
  console.log('   GET  /api/health     - Health check');
  console.log('   POST /api/auth/signin - Sign in');
  console.log('   POST /api/auth/signup - Sign up');
  console.log('   GET  /api/events     - List events');
  console.log('   GET  /api/projects   - List projects');
  console.log('   GET  /api/team       - List team members');
  console.log('   GET  /api/gallery    - List gallery photos');
  console.log('   GET  /api/stats/public - Public stats');
  console.log('========================================\n');
});
