import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  theme: { type: String, default: 'blue' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
