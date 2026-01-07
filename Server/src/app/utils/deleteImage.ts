import cloudinary from '../config/cloudinary.config';

export const deleteImageFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (_error) {
    throw new Error('Failed to delete image from Cloudinary');
  }
};
