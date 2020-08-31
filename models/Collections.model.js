const { Schema, model } = require('mongoose');

const collectionSchema = new Schema(
  {
    title: { 
      type: String,
      trim: true,
      required: [true, 'Title is required.']
    },
    description: { 
      type: String,
      trim: true
    },
    collectionPhotoUrl: {
      type: String,
      default: 'https://www.pikpng.com/pngvi/bJoxRi_default-avatar-svg-png-icon-free-download-264157-user-avatar-icon-png/'
  },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    tags: [{ type: String }]
  },
  {
    timestamps: true
  }
);

module.exports = model('Collection', collectionSchema)