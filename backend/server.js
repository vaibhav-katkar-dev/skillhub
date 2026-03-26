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
import paymentRoutes from './routes/payments.js';

dotenv.config();

// ── Protect Server from Crashing Globally ─────────────────
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception (Caught to prevent crash):', err?.message || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();

// ── Compression (gzip all responses) ──────────────────────
app.use(compression());

// ── Security & Logging ─────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
const ALLOWED_ORIGINS = [
  'https://skillvalix.com',
  'https://www.skillvalix.com',

  'http://localhost:5173',  // local dev
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(helmet({
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, // Required for Google OAuth popup
}));
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
app.use('/api/auth', ensureDatabaseConnection);
app.use('/api/quizzes', ensureDatabaseConnection);
app.use('/api/certificates', ensureDatabaseConnection);
app.use('/api/payments', ensureDatabaseConnection);

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certRoutes);
app.use('/api/payments', paymentRoutes);

// ── Global Error Handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Global Error]', err?.message || err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err?.status || 500).json({ 
    message: err?.message || 'An unexpected server error occurred.',
    success: false
  });
});

// ── Serverless-Optimized DB Connection ────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillvalix';

let cachedDb = global.mongoose;
if (!cachedDb) {
  cachedDb = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    cachedDb.conn = mongoose;
    return cachedDb.conn;
  }

  if (cachedDb.conn) {
    // Reuse existing connection pool across serverless invocations
    return cachedDb.conn;
  }

  if (!cachedDb.promise) {
    cachedDb.promise = mongoose.connect(MONGO_URI, {
      maxPoolSize: 10, // Prevent exhausting free tier DB limits
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false, // Disable buffering so requests fail fast if DB is down
    }).then((m) => {
      console.log('✅ Connected to MongoDB (New Connection Pool)');
      return m;
    });
  }

  try {
    cachedDb.conn = await cachedDb.promise;
  } catch (e) {
    cachedDb.promise = null;
    console.error('❌ Database connection error:', e);
    throw e;
  }
  return cachedDb.conn;
}

async function ensureDatabaseConnection(req, res, next) {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('❌ Request blocked: database unavailable:', err?.message || err);
    res.status(503).json({
      message: 'Database temporarily unavailable. Please try again in a moment.',
      success: false,
    });
  }
}

// Initialize connection. Vercel container keeps this alive across warm starts.
connectToDatabase().catch(err => {
  console.error("Critical DB Initialization Failed.");
});

// ── Server Initialization ─────────────────────────────────
// Only bind to a specific port if we are NOT running as a serverless function in Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 API Server running locally on port ${PORT}`);
  });
}

// Export the Express app as the default handler for Vercel Serverless functions
export default app;
