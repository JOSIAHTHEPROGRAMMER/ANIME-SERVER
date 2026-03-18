import bcrypt from 'bcrypt';
import { Readable } from 'stream';
import User from '../models/User.js';
import cloudinary from '../configs/cloudinary.js';

function signToken(app, user) {
  return app.jwt.sign({ id: user._id }, { expiresIn: '7d' });
}

function safeUser(user) {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
  };
}

export async function register(request, reply) {
  const { username, email, password } = request.body;

  if (!username || !email || !password)
    return reply.code(400).send({ error: 'All fields are required' });

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists)
    return reply.code(409).send({ error: 'Email or username already in use' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  const token = signToken(request.server, user);

  reply.code(201).send({ token, user: safeUser(user) });
}

export async function login(request, reply) {
  const { email, password } = request.body;

  if (!email || !password)
    return reply.code(400).send({ error: 'Email and password are required' });

  const user = await User.findOne({ email });
  if (!user)
    return reply.code(401).send({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return reply.code(401).send({ error: 'Invalid credentials' });

  const token = signToken(request.server, user);
  reply.send({ token, user: safeUser(user) });
}

export async function getMe(request, reply) {
  reply.send({ user: safeUser(request.user) });
}

export async function updateMe(request, reply) {
  const { username, avatarUrl, bio } = request.body;

  const updated = await User.findByIdAndUpdate(
    request.user._id,
    { username, avatarUrl, bio },
    { new: true, runValidators: true }
  ).select('-password');

  reply.send({ user: safeUser(updated) });
}

// Upload avatar to Cloudinary, save URL to user
export async function uploadAvatar(request, reply) {
  const data = await request.file();
  if (!data) return reply.code(400).send({ error: 'No file provided' });

  // Stream buffer directly to Cloudinary - no disk writes
  const buffer = await data.toBuffer();

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'wgwanime/avatars',
        transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }],
      },
      (err, res) => err ? reject(err) : resolve(res)
    );
    Readable.from(buffer).pipe(stream);
  });

  // Persist URL to user
  const updated = await User.findByIdAndUpdate(
    request.user._id,
    { avatarUrl: result.secure_url },
    { new: true }
  ).select('-password');

  reply.send({ avatarUrl: result.secure_url, user: safeUser(updated) });
}
