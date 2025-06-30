import mongoose from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken'; 

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 115,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAjVBMVEXZ3OFwd39y...",
        publicId: null,
      },
    },
    bio: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
   }
);

// populate posts that belongs to this user when he get his profile

userSchema.virtual("posts",{
    ref: "Post",
    foreignField: "user",
    localField: "_id",
});











// ✅ generate token method
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

const User = mongoose.model('User', userSchema);

// ✅ Joi validation for register
function validateRegisterUser(obj) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).trim().required(),
    email: Joi.string().min(5).max(115).trim().required().email(),
    password: Joi.string().min(8).trim().required(),
  });
  return schema.validate(obj);
}

// ✅ Joi validation for login
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(115).trim().required().email(),
    password: Joi.string().min(8).trim().required(),
  });
  return schema.validate(obj);
}

//  validate uodate user
function validateUpdateUser(obj) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).trim().required(),
    password: Joi.string().min(8).trim(),
    bio: Joi.string(),
  });
  return schema.validate(obj);
}

export { User, validateRegisterUser, validateLoginUser, validateUpdateUser };
