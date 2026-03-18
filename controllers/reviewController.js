import Review   from '../models/Review.js';
import Activity from '../models/Activity.js';

export async function getReviewsForAnime(request, reply) {
  const malId   = parseInt(request.params.malId, 10);
  const reviews = await Review.find({ malId })
    .populate('userId', 'username avatarUrl')
    .sort({ createdAt: -1 });

  const data = reviews.map(r => ({
    _id:    r._id,
    rating: r.rating,
    body:   r.body,
    likes:  r.likes.length,
    user:   { username: r.userId.username, avatarUrl: r.userId.avatarUrl },
    createdAt: r.createdAt,
  }));

  reply.send({ data });
}

export async function getMyReview(request, reply) {
  const malId  = parseInt(request.params.malId, 10);
  const review = await Review.findOne({ malId, userId: request.user._id });
  if (!review) return reply.code(404).send({ error: 'Not found' });
  reply.send(review);
}

export async function upsertReview(request, reply) {
  const { malId, rating, body } = request.body;

  if (!malId || !rating || !body)
    return reply.code(400).send({ error: 'malId, rating and body are required' });

  const review = await Review.findOneAndUpdate(
    { userId: request.user._id, malId },
    { rating, body },
    { upsert: true, new: true, runValidators: true }
  );

  await Activity.create({
    userId:     request.user._id,
    action:     'reviewed',
    malId,
    animeTitle: request.body.animeTitle ?? '',
    imageUrl:   request.body.imageUrl   ?? '',
  });

  reply.code(201).send(review);
}

export async function removeReview(request, reply) {
  const malId = parseInt(request.params.malId, 10);
  await Review.findOneAndDelete({ userId: request.user._id, malId });
  reply.code(204).send();
}

export async function toggleLike(request, reply) {
  const review = await Review.findById(request.params.reviewId);
  if (!review) return reply.code(404).send({ error: 'Review not found' });

  const uid    = request.user._id.toString();
  const liked  = review.likes.map(l => l.toString()).includes(uid);

  if (liked) review.likes.pull(request.user._id);
  else       review.likes.push(request.user._id);

  await review.save();
  reply.send({ likes: review.likes.length, liked: !liked });
}
