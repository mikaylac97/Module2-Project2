const { Schema, model } = require('mongoose');

const collectionSchema = new Schema(
  {
    title: { type: String},
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    tags: [{ type: String }]
  },
  {
    timestamps: true
  }
);

module.exports = model('Collection', collectionSchemaSchema)