import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Route Imports
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import quizRoutes from './routes/quizzes.js';
import certRoutes from './routes/certificates.js';

dotenv.config();

const app = express();

// ── Compression (gzip all responses) ──────────────────────
app.use(compression());

// ── Security & Logging ─────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

// ── Rate Limiting ──────────────────────────────────────────
// General limiter for all API routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // 200 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again after 15 minutes.' }
});

// Stricter limiter for auth routes (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,  // 20 login/register attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again after 15 minutes.' }
});

// Strict limiter for certificate generation
const certLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,                   // 30 cert downloads per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many certificate requests, please try again in an hour.' }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/certificates/download', certLimiter);

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certRoutes);

// ── Global Error Handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// ── DB + Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillhub';

mongoose.connect(MONGO_URI, {
  maxPoolSize: 10,      // connection pool — reuse connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });
