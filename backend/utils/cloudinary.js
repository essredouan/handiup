import cloudinaryModule from "cloudinary";
const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  cloud_name: "dl1zsu0o7",
  api_key: "718912156694627",
  api_secret: "gsRM_6-Tn5fGMYrGPXsV5cq8TeU",
});



// رفع الصور
export const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    return error;
  }
};



// حذف الصور
export const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
    return result;
  } catch (error) {
    return error;
  }
};
