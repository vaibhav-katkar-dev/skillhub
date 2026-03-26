import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import { authOptions } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();

// Google OAuth client (Requires process.env.GOOGLE_CLIENT_ID)
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Email service configured
const getTransporter = () => nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get current user details
router.get('/me', authOptions, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Always register as 'student' — admin role must be assigned directly in DB
    user = new User({ name, email, password, role: 'student' });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });
    
    if (!user.password) {
       return res.status(400).json({ message: 'Please login using Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ── Google Login ────────────────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });
    
    if (!user) {
      // Create a user if they don't exist
      user = new User({
        name,
        email,
        googleId,
        role: 'student'
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google ID if email exists from standard reg
      user.googleId = googleId;
      await user.save();
    }

    const jwtPayload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.error('Google Auth Error:', err.message);
    res.status(500).send('Server error during Google Authentication');
  }
});

// ── Forgot Password ─────────────────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      // We still return 200 for security, so attackers can't guess emails
      return res.status(200).json({ message: 'If that email is registered, a reset link will be sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'https://skillvalix.com';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    
    const transporter = getTransporter();
    
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER || 'no-reply@skillvalix.com',
      subject: 'Password Recovery for SkillValix',
      html: `
        <p>You requested a password reset for your SkillValix account.</p>
        <p>Please click on the following link, or paste it into your browser to complete the process:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link is valid for 15 minutes.</p>
      `
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('Skipped sending email. Configuration missing. Reset URL:', resetUrl);
    }

    res.status(200).json({ message: 'If that email is registered, a reset link will be sent.' });
  } catch (err) {
    console.error('Forgot Pass Error:', err);
    res.status(500).send('Error processing request.');
  }
});

// ── Reset Password ──────────────────────────────────────────────────────────
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() } // Must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Clear the reset tokens
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been successfully updated. You can now login.' });
  } catch (err) {
    console.error('Reset Pass Error:', err);
    res.status(500).send('Error processing request.');
  }
});

// ── Get Public Profile ──────────────────────────────────────────────────────
router.get('/public/:id', async (req, res) => {
  try {
    const queryParam = req.params.id;
    let user;

    if (mongoose.Types.ObjectId.isValid(queryParam)) {
      user = await User.findById(queryParam).select('name createdAt github linkedin resume portfolio username openToWork');
    }
    
    if (!user) {
      // If not a valid ObjectId or not found, try searching by custom username
      user = await User.findOne({ username: queryParam }).select('name createdAt github linkedin resume portfolio username openToWork');
    }

    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Courses are in JSON, we can't populate them in MongoDB. Return raw certs.
    // Make sure we select the necessary fields
    const certs = await Certificate.find({ student: user._id });
    
    res.json({
      name: user.name,
      joinedAt: user.createdAt,
      github: user.github,
      linkedin: user.linkedin,
      resume: user.resume,
      portfolio: user.portfolio,
      username: user.username,
      openToWork: user.openToWork,
      certificates: certs
    });
  } catch (err) {
    console.error('Public Profile Error:', err);
    res.status(500).send('Server Error loading public profile');
  }
});

// ── Update Profile ────────────────────────────────────────────────────────
router.put('/profile', authOptions, async (req, res) => {
  try {
    const { github, linkedin, resume, portfolio, username, openToWork } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username !== undefined && username !== (user.username || '')) {
      const formattedUsername = username.toLowerCase().replace(/[^a-z0-9-]/g, '');
      
      if (!formattedUsername) {
        // If they cleared it, remove the field so it doesn't trigger unique index
        user.username = undefined;
      } else {
        const existingUser = await User.findOne({ username: formattedUsername });
        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
          return res.status(400).json({ message: 'Username is already taken' });
        }
        user.username = formattedUsername;
      }
    }

    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (resume !== undefined) user.resume = resume;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (openToWork !== undefined) user.openToWork = openToWork;

    await user.save();
    
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('Profile Update Error:', err);
    res.status(500).send('Server error updating profile');
  }
});

export default router;
