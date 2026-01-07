import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  // Add more module routes here as you create them
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
