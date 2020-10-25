const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = new Schema({
  text: { type: String, required: true },
  sender: { type: Schema.ObjectId, ref: 'user', required: true },
  receiver: { type: Schema.ObjectId, ref: 'user' },
  group: { type: Schema.ObjectId, ref: 'group' },
  createdAt: { type: Date, default: Date.now },
  seenAt: { type: Date }
});

module.exports = mongoose.model('messages', Messages);