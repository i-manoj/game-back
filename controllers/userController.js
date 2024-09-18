const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.send({code: 400, message: 'User already exists'});
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.send({code: 201, message: 'User created', user: newUser});
    } catch (error) {
        res.status(500).json({ error });
    }
}

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        
        if (!user) return res.send({code: 400, message: 'User not found'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.send({code: 400, message: 'Invalid credentials'});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({code: 200, token, user});
    } catch (error) {
        res.status(500).json({ error });
    }
}

// const updateHighScore = async (req, res) => {
//     const { highScore } = req.body;
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) return res.send({code: 404, message: 'User not found'});
//         user.highScore = Math.max(user.highScore, highScore);  // Update only if new score is higher
//         await user.save();
//         res.send({code: 200, message: 'High score updated'});
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// }

// const saveScore = async (req, res) => {
//     const { score } = req.body;
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) return res.status(404).send({ code: 404, message: 'User not found' });
//         user.scores.push(score);
//         await user.save();
//         res.send({ code: 200, message: 'Score saved' });
//     } catch (error) {
//         console.error('Error saving score:', error);
//         res.status(500).json({ error });
//     }
// };

// Update high score
const updateHighScore = async (req, res) => {
    const { highScore } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.send({ code: 404, message: 'User not found' });
        user.highScore = Math.max(user.highScore, highScore);  // Update only if new score is higher
        await user.save();
        res.send({ code: 200, message: 'High score updated' });
    } catch (error) {
        console.error('Error updating high score:', error);
        res.status(500).json({ error });
    }
};

// Save score
const saveScore = async (req, res) => {
    const { score } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send({ code: 404, message: 'User not found' });
        user.scores.push(score);
        await user.save();
        res.send({ code: 200, message: 'Score saved' });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error });
    }
};
const fetchScores = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.send({code: 404, message: 'User not found'});
        res.send({code:200, highScore: user.highScore, scores: user.scores });
    } catch (error) {
        res.status(500).json({ error });
    }
}

const getTop10Scores = async (req, res) => {
    try {
        const topUsers = await User.find().sort({ highScore: -1 }).limit(10).select('username highScore');
        if(topUsers.length === 0) return res.send({code: 400, message: 'No users found'});
        res.send({code: 200, topUsers});
    } catch (error) {
        res.status(500).json({ error });
    }
}

module.exports = {
    registerUser,
    loginUser,
    updateHighScore,
    saveScore,
    fetchScores,
    getTop10Scores
}