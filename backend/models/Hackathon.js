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
}, { timestamps: true });

export default mongoose.model('Hackathon', hackathonSchema);
