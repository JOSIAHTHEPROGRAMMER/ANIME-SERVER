import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action:     { type: String, required: true }, // e.g. "started watching", "completed", "reviewed"
  malId:      { type: Number, required: true },
  animeTitle: { type: String, required: true },
  imageUrl:   { type: String, default: '' },
}, { timestamps: true });

// keep feed queries fast
activitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Activity', activitySchema);
