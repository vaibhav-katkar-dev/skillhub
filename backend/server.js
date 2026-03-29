import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import courseRoutes from './routes/courses.js';
import quizRoutes from './routes/quizzes.js';
import certRoutes from './routes/certificates.js';
import paymentRoutes from './routes/payments.js';
import eventRoutes from './routes/events.js';

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught exception:', err?.message || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Server] Unhandled rejection at:', promise, 'reason:', reason);
});

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(compression());
app.use(express.json({ limit: '2mb' }));

const ALLOWED_ORIGINS = [
  'https://skillvalix.com',
  'https://www.skillvalix.com',
  'https://api.skillvalix.com',
  'https://skillvalixback.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, mobile apps)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    // Log for debugging but don't block — return error
    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Type', 'Content-Disposition', 'Retry-After', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

// Handle all OPTIONS preflight requests FIRST — must be before rate limiters
app.options(/.*/, cors(corsOptions));
app.use(cors(corsOptions));

// CORS configuration handled purely by the cors() middleware
// to ensure no duplicate manual headers trigger preflight errors.


// Helmet must come AFTER cors middleware so it doesn't override CORS headers.
// COOP set to unsafe-none so Google OAuth popup postMessage is NOT blocked.
app.use(helmet({
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false, // Prevents strictly blocking API blob downloads from skillvalix.com
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://checkout.razorpay.com',
        'https://accounts.google.com',
        'https://apis.google.com',
      ],
      frameSrc: [
        "'self'",
        'https://accounts.google.com',
        'https://checkout.razorpay.com',
      ],
      connectSrc: [
        "'self'",
        'https://skillvalix.com',
        'https://www.skillvalix.com',
        'https://api.skillvalix.com',
        'https://skillvalixback.vercel.app',
        'https://accounts.google.com',
        'https://oauth2.googleapis.com',
        'https://api.razorpay.com',
      ],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));
app.use(morgan('dev'));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again after 15 minutes.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again after 15 minutes.' },
});

const certLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many certificate requests, please try again in an hour.' },
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/certificates/download', certLimiter);

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
    return cachedDb.conn;
  }

  if (!cachedDb.promise) {
    cachedDb.promise = mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
      bufferCommands: false,
    }).then((m) => {
      console.log('[Database] Connected to MongoDB');
      return m;
    });
  }

  try {
    cachedDb.conn = await cachedDb.promise;
  } catch (err) {
    cachedDb.promise = null;
    console.error('[Database] Connection error:', err);
    throw err;
  }

  return cachedDb.conn;
}

async function ensureDatabaseConnection(req, res, next) {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('[Database] Request blocked: unavailable:', err?.message || err);
    res.status(503).json({
      message: 'Database temporarily unavailable. Please try again in a moment.',
      success: false,
    });
  }
}

app.get('/api/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    success: true,
    uptimeSeconds: Math.round(process.uptime()),
    databaseReady: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', ensureDatabaseConnection);
app.use('/api/admin', ensureDatabaseConnection);
app.use('/api/quizzes', ensureDatabaseConnection);
app.use('/api/certificates', ensureDatabaseConnection);
app.use('/api/payments', ensureDatabaseConnection);
app.use('/api/events', ensureDatabaseConnection);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/events', eventRoutes);

app.use((err, req, res, next) => {
  console.error('[Global Error]', err?.message || err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err?.status || 500).json({
    message: err?.message || 'An unexpected server error occurred.',
    success: false,
  });
});

connectToDatabase().catch(() => {
  console.error('Critical DB initialization failed.');
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`API server running locally on port ${PORT}`);
  });
}

export default app;
