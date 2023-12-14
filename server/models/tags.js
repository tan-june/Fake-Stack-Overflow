const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {type: String, required: true},
});

const Tag = mongoose.model('Tag', tagSchema);

tagSchema.virtual('url').get(function () {
    return '/posts/tag/' + this._id;
});

module.exports = Tag;
