const mongodb = require('mongodb');

const entrySchema = new mongodb.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { 
    type: mongodb.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  tags: [String],
  mood: String,
  scripture: String,
  visibility: { 
    type: String, 
    enum: ['private', 'public'], 
    default: 'private' 
  }
}, { timestamps: true });

module.exports = mongodb.model('Entry', entrySchema);