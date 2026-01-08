"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const video_service_1 = require("./video.service");
const createRoom = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const result = await video_service_1.VideoServices.createRoom(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Video room created successfully',
        data: result,
    });
});
const getRoom = (0, catchAsync_1.default)(async (req, res) => {
    const { roomName } = req.params;
    const result = await video_service_1.VideoServices.getRoom(roomName);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Room details retrieved',
        data: result,
    });
});
const generateToken = (0, catchAsync_1.default)(async (req, res) => {
    const { roomName } = req.params;
    // User might not be authenticated (guest joining)
    const userId = req.user?.userId || null;
    const result = await video_service_1.VideoServices.generateMeetingToken(roomName, userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Meeting token generated',
        data: result,
    });
});
const deleteRoom = (0, catchAsync_1.default)(async (req, res) => {
    const { roomName } = req.params;
    const userId = req.user.userId;
    await video_service_1.VideoServices.deleteRoom(roomName, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Room deleted successfully',
        data: null,
    });
});
const getUserRooms = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const result = await video_service_1.VideoServices.getUserRooms(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User rooms retrieved',
        data: result,
    });
});
exports.VideoControllers = {
    createRoom,
    getRoom,
    generateToken,
    deleteRoom,
    getUserRooms,
};
//# sourceMappingURL=video.controller.js.map