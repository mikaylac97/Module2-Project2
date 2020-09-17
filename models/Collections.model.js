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
      default: 'https://res.cloudinary.com/drewcloud06/image/upload/v1600379020/93554615-iron-chemical-element-periodic-table-science-symbol_guuqyr.jpg'
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