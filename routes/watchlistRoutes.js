import { authenticate }                                                   from '../middlewares/authMiddleware.js';
import { getWatchlist, getEntry, upsertEntry, updateEntry, removeEntry } from '../controllers/watchlistController.js';

export default async function watchlistRoutes(app) {
  app.get(   '/',          { preHandler: authenticate }, getWatchlist);
  app.get(   '/:malId',    { preHandler: authenticate }, getEntry);
  app.post(  '/',          { preHandler: authenticate }, upsertEntry);
  app.patch( '/:malId',    { preHandler: authenticate }, updateEntry);
  app.delete('/:malId',    { preHandler: authenticate }, removeEntry);
}
