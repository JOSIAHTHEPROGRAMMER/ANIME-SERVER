import { authenticate }                                                          from '../middlewares/authMiddleware.js';
import { getReviewsForAnime, getMyReview, upsertReview, removeReview, toggleLike } from '../controllers/reviewController.js';

export default async function reviewRoutes(app) {
  app.get(   '/anime/:malId',       getReviewsForAnime);
  app.get(   '/anime/:malId/mine',  { preHandler: authenticate }, getMyReview);
  app.post(  '/',                   { preHandler: authenticate }, upsertReview);
  app.delete('/anime/:malId',       { preHandler: authenticate }, removeReview);
  app.post(  '/:reviewId/like',     { preHandler: authenticate }, toggleLike);
}
