import multer from 'multer';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

export default cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'posts',
        allowedFormats: ["png", "jpg", "jpeg"],
        public_id: (req, file) => {
            const imgName = req.body.name;
            // const newImg = imgName.replace(/\s+/g, '')
            // return newImg.substring(0, newImg.lastIndexOf('.'));
            return imgName;
        }
    },
});
