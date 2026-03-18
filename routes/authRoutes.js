import { authenticate }                                from '../middlewares/authMiddleware.js';
import { register, login, getMe, updateMe, uploadAvatar } from '../controllers/authController.js';

export default async function authRoutes(app) {
  app.post('/register',      register);
  app.post('/login',         login);
  app.get( '/me',            { preHandler: authenticate }, getMe);
  app.patch('/me',           { preHandler: authenticate }, updateMe);
  app.post('/upload-avatar', { preHandler: authenticate }, uploadAvatar);
}
