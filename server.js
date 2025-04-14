const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { config } = require('./config');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', registrationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});