import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  malId:          { type: Number, required: true },
  title:          { type: String, required: true },
  imageUrl:       { type: String, default: '' },
  totalEpisodes:  { type: Number, default: 0 },
  progress:       { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['watching', 'completed', 'planning', 'paused', 'dropped'],
    default: 'planning',
  },
}, { timestamps: true });

// one entry per user per anime
watchlistSchema.index({ userId: 1, malId: 1 }, { unique: true });

export default mongoose.model('Watchlist', watchlistSchema);
