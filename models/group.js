const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Group = new Schema({
  name: { type: String, required: true },
  users: [{ type: Schema.ObjectId, ref: 'user' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('group', Group);