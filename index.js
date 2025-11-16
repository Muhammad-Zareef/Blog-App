
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// load
dotenv.config();

const PORT = process.env.PORT || 3000;

// body parser
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5501"],
    credentials: true,
}));

// connect to database
connectDB();

app.use('/admin', adminRoutes);
app.use('/api', userRoutes);
app.use('/api', blogRoutes);

app.listen(PORT, () => {
    console.log("Blog App is Running");
});
