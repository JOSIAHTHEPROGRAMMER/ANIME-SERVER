import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Watchlist from '../models/Watchlist.js';

export async function followUser(request, reply) {
  const targetId = request.params.userId;
  const me = request.user;

  if (targetId === me._id.toString())
    return reply.code(400).send({ error: 'You cannot follow yourself' });

  const target = await User.findById(targetId);
  if (!target) return reply.code(404).send({ error: 'User not found' });

  const alreadyFollowing = me.following.map(f => f.toString()).includes(targetId);
  if (alreadyFollowing)
    return reply.code(409).send({ error: 'Already following' });

  await User.findByIdAndUpdate(me._id, { $push: { following: targetId } });
  await User.findByIdAndUpdate(targetId, { $push: { followers: me._id } });

  reply.send({ message: `Now following ${target.username}` });
}

export async function unfollowUser(request, reply) {
  const targetId = request.params.userId;
  const me = request.user;

  await User.findByIdAndUpdate(me._id, { $pull: { following: targetId } });
  await User.findByIdAndUpdate(targetId, { $pull: { followers: me._id } });

  reply.send({ message: 'Unfollowed' });
}

export async function getFeed(request, reply) {
  const page = parseInt(request.query.page ?? '1', 10);
  const limit = 20;
  const skip = (page - 1) * limit;
  const me = request.user;

  const data = await Activity.find({ userId: { $in: me.following } })
    .populate('userId', 'username avatarUrl')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const items = data.map(a => ({
    _id: a._id,
    action: a.action,
    malId: a.malId,
    animeTitle: a.animeTitle,
    imageUrl: a.imageUrl,
    createdAt: a.createdAt,
    user: { username: a.userId.username, avatarUrl: a.userId.avatarUrl },
  }));

  reply.send({ data: items });
}

export async function getPublicProfile(request, reply) {
  const user = await User.findOne({ username: request.params.username })
    .select('-password -email');
  if (!user) return reply.code(404).send({ error: 'User not found' });

  const watchlist = await Watchlist.find({ userId: user._id });
  reply.send({ data: { ...user.toObject(), watchlist } });
}

export async function searchUsers(request, reply) {
  const q = request.query.q ?? '';
  if (!q) return reply.send({ data: [] });

  const users = await User.find({
    username: { $regex: q, $options: 'i' },
  }).select('-password -email').limit(20);

  // try to get current user for isFollowing flag — optional since route is public
  let myFollowing = [];
  try {
    await request.jwtVerify();
    const me = await User.findById(request.user.id).select('following');
    myFollowing = me?.following.map(f => f.toString()) ?? [];
  } catch {
    // not logged in — isFollowing will just be false for all results
  }

  const data = users.map(u => ({
    ...u.toObject(),
    isFollowing: myFollowing.includes(u._id.toString()),
  }));

  reply.send({ data });
}

export async function getFollowers(request, reply) {
  const user = await User.findById(request.params.userId)
    .populate('followers', 'username avatarUrl');
  if (!user) return reply.code(404).send({ error: 'User not found' });
  reply.send({ data: user.followers });
}

export async function getFollowing(request, reply) {
  const user = await User.findById(request.params.userId)
    .populate('following', 'username avatarUrl');
  if (!user) return reply.code(404).send({ error: 'User not found' });
  reply.send({ data: user.following });
}