import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import EventCertificate from '../models/EventCertificate.js';
import { authOptions } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();


const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return process.env.JWT_SECRET;
};

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
    const token = jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    if (err.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ message: 'Authentication is not configured on the server' });
    }
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
    const token = jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    if (err.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ message: 'Authentication is not configured on the server' });
    }
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
    const token = jwt.sign(jwtPayload, getJwtSecret(), { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    console.error('Google Auth Error:', err.message);
    if (err.message === 'JWT_SECRET is not configured') {
      return res.status(500).json({ message: 'Authentication is not configured on the server' });
    }
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
      user = await User.findById(queryParam).select('name createdAt github linkedin resume portfolio username openToWork college branch year bio phoneNumber showPhoneNumber');
    }
    
    if (!user) {
      // If not a valid ObjectId or not found, try searching by custom username
      user = await User.findOne({ username: queryParam }).select('name createdAt github linkedin resume portfolio username openToWork college branch year bio phoneNumber showPhoneNumber');
    }

    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Courses are in JSON, we can't populate them in MongoDB. Return raw certs.
    // Make sure we select the necessary fields
    const stdCerts = await Certificate.find({ student: user._id }).lean();
    const eventCertsRaw = await EventCertificate.find({ student: user._id }).lean();
    
    const eventCerts = eventCertsRaw.map(c => ({
      ...c,
      isEvent: true,
      course: { title: c.eventTitle }
    }));
    
    const allCerts = [...stdCerts, ...eventCerts].sort((a,b) => new Date(b.issueDate) - new Date(a.issueDate));
    
    res.json({
      name: user.name,
      joinedAt: user.createdAt,
      github: user.github,
      linkedin: user.linkedin,
      resume: user.resume,
      portfolio: user.portfolio,
      username: user.username,
      openToWork: user.openToWork,
      college: user.college,
      branch: user.branch,
      year: user.year,
      bio: user.bio,
      phoneNumber: user.showPhoneNumber ? user.phoneNumber : undefined,
      showPhoneNumber: user.showPhoneNumber,
      certificates: allCerts
    });
  } catch (err) {
    console.error('Public Profile Error:', err);
    res.status(500).send('Server Error loading public profile');
  }
});

// ── Update Profile ────────────────────────────────────────────────────────
router.put('/profile', authOptions, async (req, res) => {
  try {
    const { name, github, linkedin, resume, portfolio, username, openToWork, college, branch, year, phoneNumber, bio, showPhoneNumber } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const normalizedName = typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : undefined;
    let nameChanged = false;
    if (normalizedName !== undefined && normalizedName !== (user.name || '')) {
      if (!normalizedName) {
        return res.status(400).json({ message: 'Name cannot be empty.' });
      }
      user.name = normalizedName;
      nameChanged = true;
    }

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
    if (college !== undefined) user.college = college;
    if (branch !== undefined) user.branch = branch;
    if (year !== undefined) user.year = year;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.bio = bio;
    if (showPhoneNumber !== undefined) user.showPhoneNumber = showPhoneNumber;

    await user.save();

    if (nameChanged) {
      await Promise.all([
        Certificate.updateMany(
          { student: user._id },
          {
            $set: {
              pdfStatus: 'pending',
              pdfRequestedAt: null,
              pdfGeneratedAt: null,
              pdfError: '',
            },
            $unset: { pdfBuffer: 1, pdfUrl: 1 },
          }
        ),
        EventCertificate.updateMany(
          { student: user._id },
          {
            $set: {
              pdfStatus: 'pending',
              pdfGeneratedAt: null,
              pdfError: '',
            },
            $unset: { pdfBuffer: 1 },
          }
        ),
      ]);
    }
    
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('Profile Update Error:', err);
    res.status(500).send('Server error updating profile');
  }
});

export default router;
