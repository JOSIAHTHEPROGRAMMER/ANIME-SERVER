import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import 'dotenv/config';
import connectDB from './configs/db.js';
import authRoutes from './routes/authRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import recsRoutes from './routes/recommendationsRoutes.js';
import multipart from '@fastify/multipart';


await connectDB();

const app = Fastify({ logger: true });

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

await app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    if (allowedOrigins.includes(origin)) {
      return cb(null, true);
    }

    cb(new Error('Not allowed by CORS'), false);
  },

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
});

await app.register(jwt, {
  secret: process.env.JWT_SECRET,
});
await app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024 } });

// Decorate request with an auth helper - routes call request.authenticate()
app.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

app.get('/', (req, reply) => reply.send({ message: 'WGWAnime API is live' }));

app.register(authRoutes, { prefix: '/api/auth' });
app.register(watchlistRoutes, { prefix: '/api/watchlist' });
app.register(reviewRoutes, { prefix: '/api/reviews' });
app.register(socialRoutes, { prefix: '/api/social' });
app.register(recsRoutes, { prefix: '/api/recommendations' });

const PORT = process.env.PORT || 3000;

// Vercel serverless export
export default async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
};

// Local dev server
if (process.env.NODE_ENV !== 'production') {
  app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
    if (err) { app.log.error(err); process.exit(1); }
  });
}
