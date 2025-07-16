const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS Setup for Local + Deployed Frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://copypaste-ai-authbackend.onrender.com',
  'https://dancing-mousse-c5c6d5.netlify.app/', // ✅ Add Netlify frontend
];



app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);      
  next();
});

// ✅ Route Imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const historyRoutes = require('./routes/history');
const codeRoutes = require('./routes/code');
const passwordRoutes = require('./routes/password');
const chatRoutes = require('./routes/chat'); // ✅ Chat route

// ✅ Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/chat', chatRoutes);

// ✅ Error Handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
