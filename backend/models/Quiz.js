import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true }
  }],
  passingScore: { type: Number, default: 60 }, // Percentage
  ribbonTheme: { type: String, default: 'blue', enum: ['gold', 'purple', 'teal', 'ruby', 'blue', 'emerald'] }
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
