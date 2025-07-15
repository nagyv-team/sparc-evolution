/**
 * Test Suite for Certification Flow and Module Unlock Functionality
 * Tests the progression from Foundation -> Developer -> Architect -> Master
 */

const request = require('supertest');
const { expect } = require('chai');

// Mock user progress data
const mockUsers = {
    newUser: { id: 'user_new', certifications: [], moduleProgress: {} },
    foundationComplete: { 
        id: 'user_foundation', 
        certifications: [{ level: 'practitioner', score: 85, completedAt: new Date() }],
        moduleProgress: { foundation: { completed: true, score: 85 } }
    },
    developerComplete: { 
        id: 'user_developer', 
        certifications: [
            { level: 'practitioner', score: 85, completedAt: new Date() },
            { level: 'developer', score: 82, completedAt: new Date() }
        ],
        moduleProgress: { 
            foundation: { completed: true, score: 85 },
            developer: { completed: true, score: 82 }
        }
    }
};

describe('Certification Flow Tests', function() {
    let app;

    before(() => {
        // Initialize test app - we'll need to create this
        app = require('../test-server');
    });

    describe('User Progress Tracking', function() {
        it('should initialize new user with empty progress', async function() {
            const response = await request(app)
                .get('/api/user/progress/user_new')
                .expect(200);
            
            expect(response.body.certifications).to.be.an('array').that.is.empty;
            expect(response.body.moduleProgress).to.be.an('object').that.is.empty;
        });

        it('should track module completion correctly', async function() {
            const response = await request(app)
                .post('/api/user/progress/user_test')
                .send({
                    module: 'foundation',
                    completed: true,
                    score: 85
                })
                .expect(200);
            
            expect(response.body.success).to.be.true;
            expect(response.body.moduleProgress.foundation.completed).to.be.true;
        });
    });

    describe('Certification Prerequisite Checks', function() {
        it('should allow practitioner certification for new users', async function() {
            const response = await request(app)
                .post('/api/certification/check-eligibility')
                .send({
                    userId: 'user_new',
                    level: 'practitioner'
                })
                .expect(200);
            
            expect(response.body.eligible).to.be.true;
            expect(response.body.requirements).to.deep.equal([]);
        });

        it('should require practitioner cert for developer level', async function() {
            const response = await request(app)
                .post('/api/certification/check-eligibility')
                .send({
                    userId: 'user_new',
                    level: 'developer'
                })
                .expect(200);
            
            expect(response.body.eligible).to.be.false;
            expect(response.body.requirements).to.include('SPARC Practitioner certification');
        });

        it('should allow developer certification after practitioner', async function() {
            const response = await request(app)
                .post('/api/certification/check-eligibility')
                .send({
                    userId: 'user_foundation',
                    level: 'developer'
                })
                .expect(200);
            
            expect(response.body.eligible).to.be.true;
            expect(response.body.requirements).to.deep.equal([]);
        });

        it('should require developer cert for architect level', async function() {
            const response = await request(app)
                .post('/api/certification/check-eligibility')
                .send({
                    userId: 'user_foundation',
                    level: 'architect'
                })
                .expect(200);
            
            expect(response.body.eligible).to.be.false;
            expect(response.body.requirements).to.include('SPARC Developer certification');
        });
    });

    describe('Module Unlock Logic', function() {
        it('should show only foundation module for new users', async function() {
            const response = await request(app)
                .get('/api/modules/available/user_new')
                .expect(200);
            
            expect(response.body.modules).to.have.lengthOf(1);
            expect(response.body.modules[0].id).to.equal('foundation');
            expect(response.body.modules[0].locked).to.be.false;
        });

        it('should unlock advanced patterns after foundation completion', async function() {
            const response = await request(app)
                .get('/api/modules/available/user_foundation')
                .expect(200);
            
            const foundationModule = response.body.modules.find(m => m.id === 'foundation');
            const advancedModule = response.body.modules.find(m => m.id === 'advanced-patterns');
            
            expect(foundationModule.locked).to.be.false;
            expect(foundationModule.completed).to.be.true;
            expect(advancedModule.locked).to.be.false;
            expect(advancedModule.completed).to.be.false;
        });

        it('should unlock AI integration after developer completion', async function() {
            const response = await request(app)
                .get('/api/modules/available/user_developer')
                .expect(200);
            
            const aiModule = response.body.modules.find(m => m.id === 'ai-integration');
            expect(aiModule.locked).to.be.false;
        });
    });

    describe('Frontend Button State Management', function() {
        it('should return correct button states for certification levels', async function() {
            const response = await request(app)
                .get('/api/certification/button-states/user_foundation')
                .expect(200);
            
            expect(response.body.practitioner.enabled).to.be.true;
            expect(response.body.practitioner.completed).to.be.true;
            expect(response.body.practitioner.text).to.equal('View Certificate');
            
            expect(response.body.developer.enabled).to.be.true;
            expect(response.body.developer.completed).to.be.false;
            expect(response.body.developer.text).to.equal('Start Assessment');
            
            expect(response.body.architect.enabled).to.be.false;
            expect(response.body.architect.text).to.equal('Complete Developer Level');
        });
    });

    describe('Assessment Flow Integration', function() {
        it('should prevent starting assessment without prerequisites', async function() {
            const response = await request(app)
                .post('/api/assessment/create')
                .send({
                    userId: 'user_new',
                    level: 'developer'
                })
                .expect(400);
            
            expect(response.body.error).to.include('prerequisites not met');
        });

        it('should allow assessment creation with valid prerequisites', async function() {
            const response = await request(app)
                .post('/api/assessment/create')
                .send({
                    userId: 'user_foundation',
                    level: 'developer'
                })
                .expect(200);
            
            expect(response.body.assessmentId).to.exist;
        });
    });

    describe('Progress Persistence', function() {
        it('should persist user progress across sessions', async function() {
            // First, save progress
            await request(app)
                .post('/api/user/progress/user_test_persist')
                .send({
                    module: 'foundation',
                    completed: true,
                    score: 90
                })
                .expect(200);
            
            // Then retrieve it
            const response = await request(app)
                .get('/api/user/progress/user_test_persist')
                .expect(200);
            
            expect(response.body.moduleProgress.foundation.score).to.equal(90);
        });
    });
});

describe('Integration Tests - Full Certification Flow', function() {
    it('should complete full progression from Foundation to Developer', async function() {
        const userId = 'integration_test_user';
        
        // 1. Start as new user
        let response = await request(app)
            .get(`/api/user/progress/${userId}`)
            .expect(200);
        expect(response.body.certifications).to.be.empty;
        
        // 2. Complete foundation module
        await request(app)
            .post(`/api/user/progress/${userId}`)
            .send({
                module: 'foundation',
                completed: true,
                score: 85
            })
            .expect(200);
        
        // 3. Take practitioner assessment
        response = await request(app)
            .post('/api/assessment/create')
            .send({
                userId,
                level: 'practitioner'
            })
            .expect(200);
        
        const assessmentId = response.body.assessmentId;
        
        // 4. Complete assessment with passing score
        await request(app)
            .post(`/api/assessment/complete/${assessmentId}`)
            .send({
                responses: [/* mock responses */],
                finalScore: 85
            })
            .expect(200);
        
        // 5. Verify developer level is now available
        response = await request(app)
            .get(`/api/certification/button-states/${userId}`)
            .expect(200);
        
        expect(response.body.developer.enabled).to.be.true;
        expect(response.body.developer.text).to.equal('Start Assessment');
    });
});