import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})

export const uploadOnCloudinary = async (filePath) => {
    try {
        if(!filePath) {
            throw new Error('No file path provided');
        }
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "image"
        })
        return response.url
    } catch (error) {
        fs.unlinkSync(filePath)
        throw new Error('Error uploading file to Cloudinary: ' + error.message);
    }
}