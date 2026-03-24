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
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
