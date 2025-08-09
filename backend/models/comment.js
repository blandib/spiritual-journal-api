const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    entryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Entry'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;