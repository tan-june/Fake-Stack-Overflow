const mongoose = require('mongoose');

const comments = mongoose.Schema({
  text: {type: String, required: true},
  comment_by: {type: String, required: true},
  reputation: {type: Number, default: 0, required: true},
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  qsummary: {type: String, required: true},
  text: { type: String, required: true },
  tags: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], required: true },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
  asked_by: { type: String, default: 'Anonymous' },
  ask_date_time: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  questionrep: {type: Number, default: 0},
  comments: {type: [comments], default: []},
});

questionSchema.index({ title: 'text', text: 'text' });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
