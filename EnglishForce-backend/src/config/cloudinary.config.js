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
const uploadImage = multer({ imageStorage });


const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'video', // QUAN TRỌNG!
    folder: 'videos',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
  },
});
const uploadVideo = multer({ storage: videoStorage });

export { uploadImage, uploadVideo };

