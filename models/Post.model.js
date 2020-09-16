const { Schema, model } = require('mongoose');

const postSchema = new Schema(
  {
    title: { type: String },
    content: { type: String },
    author: { type: Schema.Types.ObjectId, ref:'User'},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    tags: [{ type: String }],
    imageUrl: { type: String },
    location: { type: { type: String }, coordinates: [Number] },
    isPostLiked: {type: Boolean},
    numOfLikes:{type: Number}
  },
  {
    timestamps: true
  }
);

postSchema.index({ location: '2dsphere' });


module.exports = model('Post', postSchema)