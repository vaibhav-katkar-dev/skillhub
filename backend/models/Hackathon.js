import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  tagline:      { type: String, trim: true },
  description:  { type: String, required: true },
  theme:        { type: String },                          // e.g. "AI / ML", "Web3"
  prizes:       [{ rank: String, amount: String }],        // e.g. [{rank:"1st", amount:"₹10,000"}]
  startDate:    { type: Date },
  endDate:      { type: Date },
  registrationLink: { type: String },
  image:        { type: String },                          // banner URL
  tags:         [String],
  status:       { type: String, enum: ['upcoming', 'live', 'ended'], default: 'upcoming' },
  visible:      { type: Boolean, default: false },         // admin toggle
  featured:     { type: Boolean, default: false },
  teamConfig: {
    minMembers: { type: Number, default: 1, min: 1, max: 20 },
    maxMembers: { type: Number, default: 4, min: 1, max: 20 },
    requireExistingUsers: { type: Boolean, default: true },
  },
  paymentConfig: {
    enabled: { type: Boolean, default: false },
    amountInr: { type: Number, default: 0, min: 0 },
    description: { type: String, default: 'Hackathon registration fee' },
  },
  submissionConfig: {
    acceptsDriveLink: { type: Boolean, default: true },
    acceptsPdfLink: { type: Boolean, default: true },
    instructions: { type: String, default: '' },
    maxSubmissionsPerTeam: { type: Number, default: 3, min: 1, max: 50 },
  },
  contentConfig: {
    rules: [{ type: String, trim: true }],
    judgingCriteria: [{ type: String, trim: true }],
    timeline: [{
      label: { type: String, trim: true },
      date: { type: Date },
      description: { type: String, trim: true },
    }],
    faqs: [{
      question: { type: String, trim: true },
      answer: { type: String, trim: true },
    }],
  },
  styleConfig: {
    accentColor: { type: String, default: '#4F46E5' },
    cardStyle: { type: String, default: 'modern' },
    bannerStyle: { type: String, default: 'gradient' },
  },
}, { timestamps: true });

export default mongoose.model('Hackathon', hackathonSchema);
