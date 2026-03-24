import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';
import { authOptions } from '../middleware/auth.js';

const router = express.Router();

router.post('/razorpay-order', authOptions, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay keys not configured' });
    }

    const user = await User.findById(req.user.id);
    let attemptRecord = user.quizAttempts?.find(a => a.courseId === courseId);

    const amountToCharge = 4900; // Flat ₹49 for specific Certification Access

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amountToCharge,
      currency: 'INR',
      receipt: `receipt_${courseId}_${req.user.id}`.substring(0, 40)
    };

    const order = await rzp.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ message: 'Error creating payment order' });
  }
});

router.post('/razorpay-verify', authOptions, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Find or create attempt record
      const user = await User.findById(req.user.id);
      let attemptRecord = user.quizAttempts?.find(a => a.courseId === courseId);

      if (!attemptRecord) {
        user.quizAttempts.push({ courseId, attempts: 0, unlockedAttempts: 1000 });
      } else {
        attemptRecord.unlockedAttempts = 1000;
      }
      await user.save();
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: 'Verification error' });
  }
});

export default router;
