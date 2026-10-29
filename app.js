//console.log("hello Wolrd");
const express = require("express");
require('dotenv').config();
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.router');

const app = express();
app.use(express.json());
app.use('/api/v1/user', userRoutes);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello world' });
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error('Failed to start the server due to DB connection error:', err.message);
    process.exit(1);
});
