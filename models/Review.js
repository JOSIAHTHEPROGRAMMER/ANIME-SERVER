import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  malId:      { type: Number, required: true },
  rating:     { type: Number, required: true, min: 1, max: 10 },
  body:       { type: String, required: true, trim: true },
  likes:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// one review per user per anime
reviewSchema.index({ userId: 1, malId: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
