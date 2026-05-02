import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import EventCertificate from '../models/EventCertificate.js';
import { authOptions } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';
import { sendEmail } from '../utils/mailer.js';
import crypto from 'crypto';
import { isDisposableEmail, isValidEmailFormat } from '../utils/emailValidator.js';

const router = express.Router();


const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return process.env.JWT_SECRET;
};

// Google OAuth client (Requires process.env.GOOGLE_CLIENT_ID)
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



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
    const { name, email, password } = req.body;

    if (!isValidEmailFormat(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (isDisposableEmail(email)) {
      return res.status(400).json({ message: 'Temporary or disposable emails are not allowed' });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Always register as 'student' — admin role must be assigned directly in DB
    user = new User({ name, email, password, role: 'student' });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    // Email Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    // Send Verification Email — wrapped separately so a failed email doesn't
    // roll back an already-saved user account.
    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify Your Email — SkillValix',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,Arial,sans-serif">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
                <tr><td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px">SkillValix</h1>
                  <p style="margin:6px 0 0;color:#c7d2fe;font-size:13px">Welcome to the community!</p>
                </td></tr>
                <tr><td style="padding:36px 40px">
                  <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 20px">Hi ${user.name},</p>
                  <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 28px">
                    Thanks for signing up for SkillValix! Please click the button below to verify your email address and activate your account.
                  </p>
                  <div style="text-align:center;margin:28px 0">
                    <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px">Verify Email Address</a>
                  </div>
                  <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:20px 0 0">
                    If the button doesn't work, paste this link into your browser:<br/>
                    <a href="${verifyUrl}" style="color:#6366f1;word-break:break-all">${verifyUrl}</a>
                  </p>
                </td></tr>
                <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0">
                  <p style="margin:0;color:#94a3b8;font-size:12px">&copy; ${new Date().getFullYear()} SkillValix. All rights reserved.</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body></html>
      `,
      });
    } catch (emailErr) {
      // Account is saved — just let the user know to use "Resend Verification"
      console.error('[Register] Failed to send verification email:', emailErr.message);
      return res.status(201).json({
        message: 'Account created, but we could not send a verification email right now. Please use "Resend Verification Link" on the login page to get a new link.',
      });
    }

    res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Verify Email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now login.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Resend Verification Email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this email' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This account is already verified. Please login.' });
    }

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'https://skillvalix.com';
    const verifyUrl = `${frontendUrl}/verify-email/${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email — SkillValix',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,Arial,sans-serif">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
                <tr><td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px">SkillValix</h1>
                  <p style="margin:6px 0 0;color:#c7d2fe;font-size:13px">Account Verification</p>
                </td></tr>
                <tr><td style="padding:36px 40px">
                  <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 20px">Hi ${user.name},</p>
                  <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 28px">
                    We received a request to resend your account verification email. Please click the button below to activate your account.
                  </p>
                  <div style="text-align:center;margin:28px 0">
                    <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px">Verify Email Address</a>
                  </div>
                  <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:20px 0 0">
                    If the button doesn't work, paste this link into your browser:<br/>
                    <a href="${verifyUrl}" style="color:#6366f1;word-break:break-all">${verifyUrl}</a>
                  </p>
                </td></tr>
                <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0">
                  <p style="margin:0;color:#94a3b8;font-size:12px">&copy; ${new Date().getFullYear()} SkillValix. All rights reserved.</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body></html>
      `,
    });

    res.json({ message: 'Verification email resent! Please check your inbox.' });
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

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in.' });
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
        role: 'student',
        isVerified: true // Google accounts are pre-verified
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google ID if email exists from standard reg
      user.googleId = googleId;
      user.isVerified = true; // Auto-verify if they connect Google
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
    
    await sendEmail({
      to: user.email,
      subject: 'Password Reset — SkillValix',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,Arial,sans-serif">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
                <tr><td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:32px 40px;text-align:center">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px">SkillValix</h1>
                  <p style="margin:6px 0 0;color:#c7d2fe;font-size:13px">Password Reset Request</p>
                </td></tr>
                <tr><td style="padding:36px 40px">
                  <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 20px">Hi ${user.name},</p>
                  <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 28px">
                    We received a request to reset the password for your SkillValix account.
                    Click the button below to create a new password. This link expires in <strong>15 minutes</strong>.
                  </p>
                  <div style="text-align:center;margin:28px 0">
                    <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px">Reset My Password</a>
                  </div>
                  <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:20px 0 0">
                    If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
                    <br/>If the button doesn't work, paste this link into your browser:<br/>
                    <a href="${resetUrl}" style="color:#6366f1;word-break:break-all">${resetUrl}</a>
                  </p>
                </td></tr>
                <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0">
                  <p style="margin:0;color:#94a3b8;font-size:12px">&copy; ${new Date().getFullYear()} SkillValix. All rights reserved.</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body></html>
      `,
    });

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

// ── High-Performance Caching for Public Profiles ──────────────────────────
const publicProfileCache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds TTL

// ── Get Public Profile ──────────────────────────────────────────────────────
router.get('/public/:id', async (req, res) => {
  try {
    const queryParam = req.params.id;
    
    // Check Cache
    if (publicProfileCache.has(queryParam)) {
      const cached = publicProfileCache.get(queryParam);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json(cached.data);
      }
      publicProfileCache.delete(queryParam);
    }
    
    let user;

    if (mongoose.Types.ObjectId.isValid(queryParam)) {
      user = await User.findById(queryParam).select('name createdAt github linkedin resume portfolio username openToWork college branch year bio phoneNumber showPhoneNumber theme customLinks projects customSkills');
    }
    
    if (!user) {
      // If not a valid ObjectId or not found, try searching by custom username
      user = await User.findOne({ username: queryParam }).select('name createdAt github linkedin resume portfolio username openToWork college branch year bio phoneNumber showPhoneNumber theme customLinks projects customSkills');
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
    
    const payload = {
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
      theme: user.theme,
      customLinks: user.customLinks,
      projects: user.projects,
      customSkills: user.customSkills,
      certificates: allCerts
    };
    
    publicProfileCache.set(queryParam, { data: payload, timestamp: Date.now() });
    if (user.username && user.username !== queryParam) {
      publicProfileCache.set(user.username, { data: payload, timestamp: Date.now() });
    } else if (user._id.toString() !== queryParam) {
      publicProfileCache.set(user._id.toString(), { data: payload, timestamp: Date.now() });
    }

    res.json(payload);
  } catch (err) {
    console.error('Public Profile Error:', err);
    res.status(500).send('Server Error loading public profile');
  }
});

// ── Update Profile ────────────────────────────────────────────────────────
router.put('/profile', authOptions, async (req, res) => {
  try {
    const { name, github, linkedin, resume, portfolio, username, openToWork, college, branch, year, phoneNumber, bio, showPhoneNumber, theme, customLinks, projects, customSkills } = req.body;
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
    if (theme !== undefined) user.theme = theme;
    if (customLinks !== undefined) user.customLinks = customLinks;
    if (projects !== undefined) user.projects = projects;
    if (customSkills !== undefined) user.customSkills = customSkills;

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
    
    const updatedUser = await User.findById(req.user.id).select('-password').lean();
    
    // Invalidate Cache for this user upon save
    publicProfileCache.delete(updatedUser._id.toString());
    if (updatedUser.username) publicProfileCache.delete(updatedUser.username);
    
    res.json(updatedUser);
  } catch (err) {
    console.error('Profile Update Error:', err);
    res.status(500).send('Server error updating profile');
  }
});

export default router;
