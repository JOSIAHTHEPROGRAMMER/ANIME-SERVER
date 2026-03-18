import { authenticate } from '../middlewares/authMiddleware.js';
import { followUser, unfollowUser, getFeed, getPublicProfile, searchUsers, getFollowers, getFollowing } from '../controllers/socialController.js';

export default async function socialRoutes(app) {
  app.get('/feed', { preHandler: authenticate }, getFeed);
  app.get('/users', searchUsers);                          // public - no auth needed to search
  app.get('/users/:username', getPublicProfile);
  app.get('/users/:userId/followers', getFollowers);
  app.get('/users/:userId/following', getFollowing);
  app.post('/follow/:userId', { preHandler: authenticate }, followUser);
  app.delete('/follow/:userId', { preHandler: authenticate }, unfollowUser);
}