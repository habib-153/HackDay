"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/Auth/auth.route");
const video_route_1 = require("../modules/Video/video.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/video',
        route: video_route_1.VideoRoutes,
    },
    // Add more module routes here as you create them
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=index.js.map