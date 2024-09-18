const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, default:"game", unique: true },
    password: { type: String, default:"game" },
    highScore: { type: Number, default: 0 },
    scores: [{ type: Number }],
});

module.exports = mongoose.model('User', userSchema);
