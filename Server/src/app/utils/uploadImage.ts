import cloudinary from '../config/cloudinary.config';

export const uploadToCloudinary = async (
  imageData: string,
  folder: string = 'hackday/patterns',
): Promise<string> => {
  try {
    // Upload base64 image to Cloudinary
    const result = await cloudinary.uploader.upload(imageData, {
      folder: folder,
      resource_type: 'auto',
    });

    return result.secure_url;
  } catch {
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  folder: string = 'hackday/patterns',
): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(new Error('Failed to upload image to Cloudinary'));
          } else {
            resolve(result!.secure_url);
          }
        },
      );

      uploadStream.end(buffer);
    });
  } catch {
    throw new Error('Failed to upload image to Cloudinary');
  }
};
