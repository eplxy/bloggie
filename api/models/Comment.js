const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CommentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    content: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: [{type: 'String'}]
}, {
    timestamps: true,
});

const CommentModel = model('Comment', CommentSchema);

module.exports = CommentModel;