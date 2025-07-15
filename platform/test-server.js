/**
 * Test Server for Certification Flow Testing
 * This is a simplified version for running tests
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./src/api/routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API routes
app.use('/api', apiRoutes);

// Health check for tests
app.get('/test/health', (req, res) => {
    res.json({ status: 'test server running', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Test server error:', err);
    res.status(500).json({ 
        error: 'Test server error', 
        message: err.message 
    });
});

const PORT = process.env.TEST_PORT || 3001;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Test server running on port ${PORT}`);
    });
}

module.exports = app;