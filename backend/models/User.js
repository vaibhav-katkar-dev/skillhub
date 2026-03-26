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
  openToWork: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
