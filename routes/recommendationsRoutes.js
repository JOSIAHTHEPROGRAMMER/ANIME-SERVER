import { authenticate }                                                        from '../middlewares/authMiddleware.js';
import { getRecommendations, getSimilarTo, dismissRecommendation }            from '../controllers/recommendationsController.js';

export default async function recommendationsRoutes(app) {
  app.get(   '/',                { preHandler: authenticate }, getRecommendations);
  app.get(   '/similar/:malId',  { preHandler: authenticate }, getSimilarTo);
  app.delete('/:malId',          { preHandler: authenticate }, dismissRecommendation);
}
