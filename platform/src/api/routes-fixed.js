/**
 * SPARC Educational Platform API Routes
 * Provides endpoints for playground, assessments, and certification
 */

const express = require('express');
const SPARCPlaygroundEngine = require('../playground/playground-engine');
const SPARCAssessmentEngine = require('../certification/assessment-engine');

const router = express.Router();
const playground = new SPARCPlaygroundEngine();
const assessment = new SPARCAssessmentEngine();

// Middleware for request logging
router.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ===============================
// PLAYGROUND ENDPOINTS
// ===============================

// Create new playground session
router.post('/playground/session', asyncHandler(async (req, res) => {
    const { userId, skillLevel } = req.body;
    
    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }
    
    const sessionId = playground.createSession(userId, { skillLevel });
    res.json({ sessionId, message: 'Playground session created successfully' });
}));

// Execute code in playground
router.post('/playground/execute', asyncHandler(async (req, res) => {
    const { sessionId, code, step } = req.body;
    
    if (!sessionId || !code) {
        return res.status(400).json({ error: 'sessionId and code are required' });
    }
    
    const result = await playground.executeCode(sessionId, code, step);
    res.json(result);
}));

// Get playground session progress
router.get('/playground/progress/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const progress = playground.getSessionProgress(sessionId);
    
    if (!progress) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(progress);
});

// Get available code examples
router.get('/playground/examples', (req, res) => {
    const examples = playground.getAvailableExamples();
    res.json({ examples });
});

// ===============================
// ASSESSMENT ENDPOINTS
// ===============================

// Create new assessment
router.post('/assessment/create', asyncHandler(async (req, res) => {
    const { userId, level, options } = req.body;
    
    if (!userId || !level) {
        return res.status(400).json({ error: 'userId and level are required' });
    }
    
    const validLevels = ['practitioner', 'developer', 'architect', 'master'];
    if (!validLevels.includes(level)) {
        return res.status(400).json({ error: 'Invalid certification level' });
    }
    
    const assessmentId = assessment.createAssessment(userId, level, options);
    res.json({ assessmentId, level, message: 'Assessment created successfully' });
}));

// ===============================
// HEALTH CHECK ENDPOINTS
// ===============================

router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
            playground: 'active',
            assessment: 'active',
            certification: 'active'
        }
    });
});

// ===============================
// ERROR HANDLING
// ===============================

router.use((error, req, res, next) => {
    console.error('API Error:', error);
    
    if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
    }
    
    if (error.message.includes('required') || error.message.includes('Invalid')) {
        return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

module.exports = router;