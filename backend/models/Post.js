import mongoose from "mongoose";
import Joi from "joi";

// post schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Post content is required"],
      minlength: 10,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String, // ✅ كان كاتبها: string (خاص تكون String)
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null, // ← مهم باش تحيد الصورة من Cloudinary
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // ✅ "user" كان خاصو يكون "User" بحال اسم الموديل
      },
    ],
  },
  {
    timestamps: true, // ← createdAt & updatedAt
  }
);

// post model
const Post = mongoose.model("Post", postSchema);

export default Post;
  


// Joi validation  for creqt post
export const validateCreatePost = (obj) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(200).required().messages({
      "string.empty": "عنوان التدوينة مطلوب",
      "string.min": "عنوان التدوينة قصير جدا",
      "string.max": "عنوان التدوينة طويل جدا",
    }),
    description: Joi.string().min(10).required().messages({
      "string.empty": "محتوى التدوينة مطلوب",
      "string.min": "محتوى التدوينة قصير جدا",
    }),
    category: Joi.string().required().messages({
      "string.empty": "التصنيف مطلوب",
    }),
  });

  return schema.validate(obj, { abortEarly: false }); // باش يرجع جميع الأخطاء ماشي أول وحدة فقط
};

// Joi validation for updating post
export const validateUpdatePost = (obj) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(200).messages({
      "string.min": "عنوان التدوينة خاصو يكون على الأقل 2 حروف",
      "string.max": "عنوان التدوينة طويل بزاف",
    }),
    description: Joi.string().min(10).messages({
      "string.min": "محتوى التدوينة خاصو يكون على الأقل 10 حروف",
    }),
    category: Joi.string().messages({
      "string.empty": "التصنيف لا يمكن أن يكون فارغا",
    }),
  });

  return schema.validate(obj, { abortEarly: false });
};
