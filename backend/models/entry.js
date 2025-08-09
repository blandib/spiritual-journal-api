const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;