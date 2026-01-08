"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const video_validation_1 = require("./video.validation");
const video_controller_1 = require("./video.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Create a new video room (requires auth)
router.post('/rooms', (0, auth_1.default)('user', 'admin'), (0, validateRequest_1.default)(video_validation_1.VideoValidation.createRoomSchema), video_controller_1.VideoControllers.createRoom);
// Get room details (public - for joining)
router.get('/rooms/:roomName', video_controller_1.VideoControllers.getRoom);
// Generate meeting token (optional auth for guest support)
router.post('/rooms/:roomName/token', (0, validateRequest_1.default)(video_validation_1.VideoValidation.generateTokenSchema), video_controller_1.VideoControllers.generateToken);
// Delete a room (requires auth, only owner)
router.delete('/rooms/:roomName', (0, auth_1.default)('user', 'admin'), video_controller_1.VideoControllers.deleteRoom);
// List user's rooms (requires auth)
router.get('/my-rooms', (0, auth_1.default)('user', 'admin'), video_controller_1.VideoControllers.getUserRooms);
exports.VideoRoutes = router;
//# sourceMappingURL=video.route.js.map