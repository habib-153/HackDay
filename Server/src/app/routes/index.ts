import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { ContactRoutes } from '../modules/Contact/contact.route';
import { CallRoutes } from '../modules/Call/call.route';
import { PatternRoutes } from '../modules/Pattern/pattern.route';
import { ChatRoutes } from '../modules/Chat/chat.route';
import { AvatarRoutes } from '../modules/Avatar/avatar.route';
import { VideoRoutes } from '../modules/Video/video.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/contacts',
    route: ContactRoutes,
  },
  {
    path: '/calls',
    route: CallRoutes,
  },
  {
    path: '/patterns',
    route: PatternRoutes,
  },
  {
    path: '/chat',
    route: ChatRoutes,
  },
  {
    path: '/avatar',
    route: AvatarRoutes,
  },
    path: '/video',
    route: VideoRoutes,
  },
  // Add more module routes here as you create them
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;

