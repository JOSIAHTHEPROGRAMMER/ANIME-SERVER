import Watchlist from '../models/Watchlist.js';
import { ask } from '../configs/ai.js';

export async function getRecommendations(request, reply) {
  const watchlist = await Watchlist.find({ userId: request.user._id })
    .sort({ updatedAt: -1 })
    .limit(30);

  if (!watchlist.length)
    return reply.send({ data: [], message: 'Add some anime to your list to get recommendations.' });

  const titles = watchlist.map(e => `${e.title} (${e.status})`).join(', ');

  const prompt = `
You are an anime recommendation engine.
The user has the following anime in their list: ${titles}.
Based on their taste, recommend 10 anime they have NOT seen.
Respond ONLY with a valid JSON array. No extra text, no markdown, no explanation.
Format: [{ "title": "...", "reason": "..." }]
  `.trim();

  try {
    const raw = await ask(prompt);
    const clean = raw.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);
    reply.send({ data });
  } catch {
    reply.code(500).send({ error: 'Failed to generate recommendations' });
  }
}

export async function getSimilarTo(request, reply) {
  const { malId } = request.params;

  // fetch title from Jikan to give the AI context
  let animeTitle = `anime with MAL ID ${malId}`;
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
    const data = await res.json();
    animeTitle = data?.data?.title ?? animeTitle;
  } catch { /* use fallback title */ }

  const prompt = `
You are an anime recommendation engine.
Recommend 10 anime similar to "${animeTitle}".
Respond ONLY with a valid JSON array. No extra text, no markdown.
Format: [{ "title": "...", "reason": "..." }]
  `.trim();

  try {
    const raw = await ask(prompt);
    const clean = raw.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);
    reply.send({ data });
  } catch {
    reply.code(500).send({ error: 'Failed to generate recommendations' });
  }
}

export async function dismissRecommendation(request, reply) {
  // For now just acknowledge - full dismiss logic can store in a dismissed[] array on User later
  reply.send({ message: 'Dismissed' });
}
