/**
 * SPARC Educational Platform API Routes
 * Provides endpoints for playground, assessments, and certification
 */

const express = require('express');
const SPARCPlaygroundEngine = require('../playground/playground-engine');
const SPARCAssessmentEngine = require('../certification/assessment-engine');
const UserProgressManager = require('./user-progress');

const router = express.Router();
const playground = new SPARCPlaygroundEngine();
const assessment = new SPARCAssessmentEngine();
const userProgress = new UserProgressManager();

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
    
    // Check eligibility before creating assessment
    const eligibility = userProgress.checkCertificationEligibility(userId, level);
    if (!eligibility.eligible) {
        return res.status(400).json({ 
            error: 'Prerequisites not met', 
            requirements: eligibility.requirements 
        });
    }
    
    const assessmentId = assessment.createAssessment(userId, level, options);
    res.json({ assessmentId, level, message: 'Assessment created successfully' });
}));

// Start assessment
router.post('/assessment/start/:assessmentId', asyncHandler(async (req, res) => {
    const { assessmentId } = req.params;
    const result = assessment.startAssessment(assessmentId);
    res.json(result);
}));

// Complete assessment
router.post('/assessment/complete/:assessmentId', asyncHandler(async (req, res) => {
    const { assessmentId } = req.params;
    const { responses, finalScore } = req.body;
    
    const result = assessment.completeAssessment(assessmentId);
    
    // If passed, add certification to user progress
    if (result.passed) {
        const assessmentData = assessment.assessments.get(assessmentId);
        await userProgress.addCertification(assessmentData.userId, {
            level: assessmentData.level,
            score: result.score,
            assessmentId
        });
    }
    
    res.json(result);
}));

// ===============================
// USER PROGRESS ENDPOINTS
// ===============================

// Get user progress
router.get('/user/progress/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const progress = userProgress.getUserProgress(userId);
    res.json(progress);
}));

// Update module progress
router.post('/user/progress/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { module, completed, score } = req.body;
    
    if (!module) {
        return res.status(400).json({ error: 'module is required' });
    }
    
    const result = await userProgress.updateModuleProgress(userId, module, {
        completed: completed || false,
        score: score || 0
    });
    
    res.json({ 
        success: true, 
        moduleProgress: userProgress.getUserProgress(userId).moduleProgress 
    });
}));

// Get available modules for user
router.get('/modules/available/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const modules = userProgress.getAvailableModules(userId);
    res.json(modules);
}));

// ===============================
// CERTIFICATION ENDPOINTS
// ===============================

// Check certification eligibility
router.post('/certification/check-eligibility', asyncHandler(async (req, res) => {
    const { userId, level } = req.body;
    
    if (!userId || !level) {
        return res.status(400).json({ error: 'userId and level are required' });
    }
    
    const eligibility = userProgress.checkCertificationEligibility(userId, level);
    res.json(eligibility);
}));

// Get certification button states
router.get('/certification/button-states/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const buttonStates = userProgress.getCertificationButtonStates(userId);
    res.json(buttonStates);
}));

// Get user certificates
router.get('/certification/certificates/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const certificates = assessment.getUserCertificates(userId);
    res.json({ certificates });
}));

// Complete certification
router.post('/certification/complete', asyncHandler(async (req, res) => {
    const { userId, level, score } = req.body;
    
    if (!userId || !level || score === undefined) {
        return res.status(400).json({ error: 'userId, level, and score are required' });
    }
    
    const result = userProgress.completeCertification(userId, level, score);
    
    res.json({ 
        success: true, 
        certification: result,
        message: `${level} certification completed with ${score}% score`
    });
}));

// ===============================
// ANALYTICS ENDPOINTS
// ===============================

// Get user statistics
router.get('/analytics/user/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const stats = userProgress.getUserStats(userId);
    res.json(stats);
}));

// Get system statistics
router.get('/analytics/system', asyncHandler(async (req, res) => {
    const stats = userProgress.getAllUsersStats();
    res.json(stats);
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