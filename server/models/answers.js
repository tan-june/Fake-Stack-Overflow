const mongoose = require('mongoose');

const comments = mongoose.Schema({
    text: {type: String, required: true},
    comment_by: {type: String, required: true},
    reputation: {type: Number, default: 0, required: true},
});

const answerSchema = new mongoose.Schema({
    text: { type: String, required: true },
    ans_by: { type: String, required: true },
    ans_date_time: { type: Date, default: Date.now },
    comments: {type: [comments], default: []},
    answerrep: {type: Number, default: 0},
});


const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;