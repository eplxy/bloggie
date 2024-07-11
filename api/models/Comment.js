const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CommentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    replyto: { type: Schema.Types.ObjectId, ref: 'Comment' },
    content: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
});

const CommentModel = model('Comment', CommentSchema);

module.exports = CommentModel;