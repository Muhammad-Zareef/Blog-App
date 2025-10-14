
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// load
dotenv.config();

const PORT = process.env.PORT || 3000;

// body parser
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// connect to database
connectDB();

app.use('/api', userRoutes);
app.use('/api', blogRoutes);

app.listen(PORT, () => {
    console.log("Blog App is Running");
});
