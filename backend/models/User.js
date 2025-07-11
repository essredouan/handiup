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
    phone: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
        publicId: null,
      },
    },
    bio: {
      type: String,
    },
    role: {
      type: String,
      enum: ["disabled", "organization", "volunteer", "admin"],
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    lastMessageAt: {
      type: Date
    },
    unreadMessages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }]
  },
  { 
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }
);

userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

const User = mongoose.model('User', userSchema);

// Joi validation for register
function validateRegisterUser(obj) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).trim().required(),
    email: Joi.string().min(5).max(115).trim().required().email(),
    password: Joi.string().min(8).trim().required(),
    role: Joi.string()
      .valid("disabled", "organization", "volunteer")
      .required()
      .messages({
        "any.only": "Role must be one of: disabled, organization, volunteer",
        "string.empty": "Role is required",
      }),
  });
  return schema.validate(obj);
}

// Joi validation for login
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(115).trim().required().email(),
    password: Joi.string().min(8).trim().required(),
  });
  return schema.validate(obj);
}

// validate update user (محدث لإضافة email required)
function validateUpdateUser(obj) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).trim().required(),
    email: Joi.string().min(5).max(115).trim().required().email(),
    password: Joi.string().min(8).trim(),
    bio: Joi.string().allow('', null),
    phone: Joi.string().allow('', null),
    address: Joi.string().allow('', null),
    role: Joi.string()
      .valid("disabled", "organization", "volunteer")
      .messages({
        "any.only": "Role must be one of: disabled, organization, volunteer",
      }),
  });
  return schema.validate(obj);
}

export { User, validateRegisterUser, validateLoginUser, validateUpdateUser };
