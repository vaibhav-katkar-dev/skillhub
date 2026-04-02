import express from 'express';
import HostRequest from '../models/HostRequest.js';
import { authOptions as protect, adminCheck as admin } from '../middleware/auth.js';

const router = express.Router();

// POST: Public endpoint to submit a hosting request
router.post('/submit', async (req, res) => {
  try {
    const { name, email, organization, expectedParticipants, message } = req.body;
    
    const request = new HostRequest({
      name,
      email,
      organization,
      expectedParticipants,
      message,
    });
    
    await request.save();
    res.status(201).json({ success: true, message: 'Request submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET: Admin endpoint to view all requests
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const requests = await HostRequest.find({}).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching requests' });
  }
});

// PUT: Admin endpoint to update request status
router.put('/admin/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await HostRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating status' });
  }
});

export default router;
