const { Schema, model } = require('mongoose');

const postSchema = new Schema(
  {
    title: { type: String },
    content: { type: String },
    author: { type: Schema.Types.ObjectId, ref:'User'},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    tags: [{ type: String }],
    imageUrl: { type: String },
    location: { type: String },
    isPostLiked: {type: Boolean},
  },
  {
    timestamps: true
  }
);

module.exports = model('Post', postSchema)