const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/AuthRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;