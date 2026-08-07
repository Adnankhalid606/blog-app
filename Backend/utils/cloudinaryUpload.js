import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (fileBuffer, folder = "blogs") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};