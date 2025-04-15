// cloudinary.config.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageStorage  = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', // Tên thư mục trên Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
export const uploadImage = multer({ storage: imageStorage });


const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'video', // QUAN TRỌNG!
    folder: 'videos',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
  },
});
export const uploadVideo = multer({ storage: videoStorage });

// Xóa file Cloudinary theo public_id và loại file (image/video)
export const deleteCloudinaryFile = async (publicId, type = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary deletion failed:', error);
    throw error;
  }
};


