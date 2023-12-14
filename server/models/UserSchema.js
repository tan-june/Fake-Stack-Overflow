const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sessions: { type: String, default: '' },
    userCreated: { type: Date, default: Date.now },
    userrep: {type: Number, default: 50},
    usertype: {type: String, default: 'Standard User'},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
