import Watchlist from '../models/Watchlist.js';
import Activity  from '../models/Activity.js';

export async function getWatchlist(request, reply) {
  const { status } = request.query;
  const filter = { userId: request.user._id };
  if (status) filter.status = status;

  const data = await Watchlist.find(filter).sort({ updatedAt: -1 });
  reply.send({ data });
}

export async function getEntry(request, reply) {
  const entry = await Watchlist.findOne({
    userId: request.user._id,
    malId:  parseInt(request.params.malId, 10),
  });
  if (!entry) return reply.code(404).send({ error: 'Not found' });
  reply.send(entry);
}

export async function upsertEntry(request, reply) {
  const { malId, title, imageUrl, totalEpisodes, status, progress } = request.body;

  const entry = await Watchlist.findOneAndUpdate(
    { userId: request.user._id, malId },
    { title, imageUrl, totalEpisodes, status, progress },
    { upsert: true, new: true, runValidators: true }
  );

  // log activity
  await Activity.create({
    userId:     request.user._id,
    action:     actionLabel(status),
    malId,
    animeTitle: title,
    imageUrl:   imageUrl ?? '',
  });

  reply.code(201).send(entry);
}

export async function updateEntry(request, reply) {
  const { status, progress } = request.body;
  const malId = parseInt(request.params.malId, 10);

  const entry = await Watchlist.findOneAndUpdate(
    { userId: request.user._id, malId },
    { ...(status   !== undefined && { status }),
      ...(progress !== undefined && { progress }) },
    { new: true }
  );

  if (!entry) return reply.code(404).send({ error: 'Entry not found' });

  if (status) {
    await Activity.create({
      userId:     request.user._id,
      action:     actionLabel(status),
      malId,
      animeTitle: entry.title,
      imageUrl:   entry.imageUrl,
    });
  }

  reply.send(entry);
}

export async function removeEntry(request, reply) {
  const malId = parseInt(request.params.malId, 10);
  await Watchlist.findOneAndDelete({ userId: request.user._id, malId });
  reply.code(204).send();
}

function actionLabel(status) {
  const map = {
    watching:  'started watching',
    completed: 'completed',
    planning:  'plans to watch',
    paused:    'put on hold',
    dropped:   'dropped',
  };
  return map[status] ?? 'updated';
}
