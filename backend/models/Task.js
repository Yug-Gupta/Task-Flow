const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  category: {
    type: String,
    default: 'Inbox', // Work, Personal, Study
  },
  tags: [String],
  subtasks: [subtaskSchema],
  order: {
    type: Number,
    default: 0, // For drag-and-drop ordering
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
