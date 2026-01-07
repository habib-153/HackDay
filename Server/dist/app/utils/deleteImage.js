"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromCloudinary = void 0;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const deleteImageFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary_config_1.default.uploader.destroy(publicId);
        return result;
    }
    catch (_error) {
        throw new Error('Failed to delete image from Cloudinary');
    }
};
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
//# sourceMappingURL=deleteImage.js.map