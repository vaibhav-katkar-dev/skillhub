import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Made optional for OAuth users
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  googleId: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  quizAttempts: [{ 
    courseId: { type: String }, 
    attempts: { type: Number, default: 0 },
    unlockedAttempts: { type: Number, default: 0 }
  }],
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  resume: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  username: { type: String, unique: true, sparse: true },
  openToWork: { type: Boolean, default: false },
  college: { type: String, default: '' },
  branch: { type: String, default: '' },
  year: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  bio: { type: String, default: '' },
  showPhoneNumber: { type: Boolean, default: false },
  
  // Public Portfolio Improvements
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  customLinks: [{
    title: { type: String, required: true },
    url: { type: String, required: true }
  }],
  projects: [{
    title: { type: String, required: true },
    description: { type: String },
    link: { type: String },
    github: { type: String },
    techStack: [String]
  }],
  customSkills: [String],

  // Email Verification
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, index: true },
  verificationTokenExpires: { type: Date }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
