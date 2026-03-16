import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }, // Markdown or HTML content
  videoUrl: { type: String },
  order: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Lesson', lessonSchema);
