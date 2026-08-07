export const deleteFromCloudinary = async (publicId) => {
    return cloudinary.uploader.destroy(publicId);
}