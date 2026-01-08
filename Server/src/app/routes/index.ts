import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { VideoRoutes } from '../modules/Video/video.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/video',
    route: VideoRoutes,
  },
  // Add more module routes here as you create them
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
