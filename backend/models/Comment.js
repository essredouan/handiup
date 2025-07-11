import mongoose from 'mongoose';
import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi); // تعريف نوع ObjectId ف Joi

const CommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },

  username: {
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

// VALIDATION CREATE COMMENT
function validateCreateComment(obj) {
  const schema = Joi.object({
    post: Joi.objectId().required(),      // غيرنا هاد السطر لـ ObjectId
    text: Joi.string().trim().required(),
  });
  return schema.validate(obj);
}

// VALIDATION update COMMENT
function validateUpdateComment(obj) {
  const schema = Joi.object({
    text: Joi.string().trim().required(),
  });
  return schema.validate(obj);
}

export default { Comment, validateCreateComment, validateUpdateComment };
