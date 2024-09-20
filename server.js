// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const userRoutes = require('./routes/userRoutes');

// dotenv.config();

// const app = express();
// app.use(express.json());
// // app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:3000', // Your frontend origin
//     credentials: true                // Allow credentials (cookies)
// }));

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch((err) => console.log(err));

// // User routes
// app.use('/api/users', userRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration
// app.use(cors({
//     origin: process.env.FRONTEND_URL, // Update for deployed frontend URL
//     credentials: true
// }));

app.use(cors({
    origin: 'https://main--creative-jelly-492343.netlify.app',
    credentials: true,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));


// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch((err) => console.log(err));

// User routes
app.use('/api/users', userRoutes);

// Serve static files from React app
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'build')));

//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, 'build', 'index.html'));
//     });
// }

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
