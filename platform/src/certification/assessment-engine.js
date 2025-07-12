/**
 * SPARC Certification Assessment Engine
 * Manages assessments, scoring, and certification levels
 */

const { EventEmitter } = require('events');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class SPARCAssessmentEngine extends EventEmitter {
    constructor(options = {}) {
        super();
        this.assessments = new Map();
        this.userProgress = new Map();
        this.certificates = new Map();
        this.questionBank = new Map();
        this.certificationLevels = {
            practitioner: { threshold: 70, questions: 20, practicalTasks: 2 },
            developer: { threshold: 75, questions: 30, practicalTasks: 3 },
            architect: { threshold: 80, questions: 40, practicalTasks: 4 },
            master: { threshold: 85, questions: 50, practicalTasks: 5 }
        };
        this.loadQuestionBank();
    }

    async loadQuestionBank() {
        try {
            // Knowledge-based questions for each SPARC step
            this.questionBank.set('specifications', [
                {
                    id: 'spec_001',
                    type: 'multiple_choice',
                    question: 'What is the primary purpose of the Specifications phase in SPARC?',
                    options: [
                        'Write code immediately',
                        'Define clear requirements and problem statement',
                        'Test the application',
                        'Deploy to production'
                    ],
                    correct: 1,
                    explanation: 'Specifications focus on clearly defining what needs to be built before any implementation begins.',
                    difficulty: 'beginner'
                },
                {
                    id: 'spec_002',
                    type: 'short_answer',
                    question: 'List three key elements that should be included in a SPARC specification document.',
                    expectedKeywords: ['requirements', 'constraints', 'objectives', 'scope', 'stakeholders'],
                    difficulty: 'intermediate'
                }
            ]);

            this.questionBank.set('pseudocode', [
                {
                    id: 'pseudo_001',
                    type: 'multiple_choice',
                    question: 'What does SPARC Pseudocode primarily focus on?',
                    options: [
                        'Final implementation details',
                        'Step-by-step logical flow before implementation',
                        'Database schema design',
                        'User interface layout'
                    ],
                    correct: 1,
                    explanation: 'Pseudocode in SPARC bridges specifications and architecture by outlining logical flow.',
                    difficulty: 'beginner'
                },
                {
                    id: 'pseudo_002',
                    type: 'code_review',
                    question: 'Review this pseudocode and identify SPARC compliance issues:',
                    code: '// Calculate user score\nfunction calculateScore() { return Math.random() * 100; }',
                    expectedFindings: ['missing step breakdown', 'no input validation', 'unclear logic'],
                    difficulty: 'intermediate'
                }
            ]);

            this.questionBank.set('architecture', [
                {
                    id: 'arch_001',
                    type: 'multiple_choice',
                    question: 'In SPARC Architecture, what is the main focus?',
                    options: [
                        'Writing production code',
                        'System design and component structure',
                        'Testing strategies',
                        'Deployment procedures'
                    ],
                    correct: 1,
                    explanation: 'Architecture phase defines how components interact and system structure.',
                    difficulty: 'beginner'
                },
                {
                    id: 'arch_002',
                    type: 'design_task',
                    question: 'Design a component architecture for a simple calculator following SPARC principles.',
                    requirements: ['input validation', 'calculation engine', 'result display', 'error handling'],
                    difficulty: 'advanced'
                }
            ]);

            this.questionBank.set('refinement', [
                {
                    id: 'refine_001',
                    type: 'multiple_choice',
                    question: 'What is the primary goal of the Refinement phase?',
                    options: [
                        'Initial implementation',
                        'Iterative improvement and optimization',
                        'Requirements gathering',
                        'Final deployment'
                    ],
                    correct: 1,
                    explanation: 'Refinement focuses on improving and optimizing the initial implementation.',
                    difficulty: 'beginner'
                }
            ]);

            this.questionBank.set('completion', [
                {
                    id: 'complete_001',
                    type: 'multiple_choice',
                    question: 'What characterizes the Completion phase in SPARC?',
                    options: [
                        'Starting the project',
                        'Final implementation and validation',
                        'Planning phase',
                        'Initial prototyping'
                    ],
                    correct: 1,
                    explanation: 'Completion involves final implementation, testing, and validation.',
                    difficulty: 'beginner'
                }
            ]);

            // Practical coding tasks
            this.questionBank.set('practical', [
                {
                    id: 'prac_001',
                    type: 'coding_task',
                    question: 'Implement a simple TODO application following SPARC methodology',
                    requirements: [
                        'Follow all 5 SPARC phases',
                        'Include proper error handling',
                        'Add basic tests',
                        'Document each phase'
                    ],
                    starterCode: '// SPARC TODO Application\n// Phase 1: Specifications\n/**\n * TODO: Define requirements\n */',
                    difficulty: 'intermediate',
                    timeLimit: 3600000 // 1 hour
                },
                {
                    id: 'prac_002',
                    type: 'coding_task',
                    question: 'Build a REST API following SPARC architecture principles',
                    requirements: [
                        'Complete SPARC documentation',
                        'Modular component design',
                        'Error handling and validation',
                        'Unit tests for key functions'
                    ],
                    difficulty: 'advanced',
                    timeLimit: 7200000 // 2 hours
                }
            ]);

        } catch (error) {
            console.error('Error loading question bank:', error);
        }
    }

    createAssessment(userId, level = 'practitioner', options = {}) {
        const assessmentId = `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const config = this.certificationLevels[level];
        
        if (!config) {
            throw new Error(`Invalid certification level: ${level}`);
        }

        const assessment = {
            id: assessmentId,
            userId,
            level,
            createdAt: new Date(),
            status: 'active',
            timeLimit: options.timeLimit || 3600000, // 1 hour default
            startedAt: null,
            completedAt: null,
            questions: this.selectQuestions(level, config.questions),
            practicalTasks: this.selectPracticalTasks(level, config.practicalTasks),
            responses: [],
            score: null,
            passed: null,
            threshold: config.threshold
        };

        this.assessments.set(assessmentId, assessment);
        this.emit('assessmentCreated', { assessmentId, userId, level });
        return assessmentId;
    }

    selectQuestions(level, count) {
        const allQuestions = [];
        
        // Collect questions from all SPARC phases
        for (const [phase, questions] of this.questionBank.entries()) {
            if (phase !== 'practical') {
                allQuestions.push(...questions.map(q => ({ ...q, phase })));
            }
        }

        // Filter by difficulty based on level
        const difficulties = this.getDifficultiesForLevel(level);
        const filteredQuestions = allQuestions.filter(q => 
            difficulties.includes(q.difficulty)
        );

        // Randomly select questions ensuring coverage of all phases
        const selected = [];
        const questionsPerPhase = Math.floor(count / 5); // 5 SPARC phases
        const phases = ['specifications', 'pseudocode', 'architecture', 'refinement', 'completion'];

        phases.forEach(phase => {
            const phaseQuestions = filteredQuestions.filter(q => q.phase === phase);
            const shuffled = this.shuffleArray([...phaseQuestions]);
            selected.push(...shuffled.slice(0, questionsPerPhase));
        });

        // Fill remaining slots with random questions
        const remaining = count - selected.length;
        if (remaining > 0) {
            const remainingQuestions = filteredQuestions.filter(q => 
                !selected.find(s => s.id === q.id)
            );
            const shuffled = this.shuffleArray(remainingQuestions);
            selected.push(...shuffled.slice(0, remaining));
        }

        return selected.slice(0, count);
    }

    selectPracticalTasks(level, count) {
        const practicalQuestions = this.questionBank.get('practical') || [];
        const difficulties = this.getDifficultiesForLevel(level);
        
        const filtered = practicalQuestions.filter(q => 
            difficulties.includes(q.difficulty)
        );
        
        return this.shuffleArray([...filtered]).slice(0, count);
    }

    getDifficultiesForLevel(level) {
        const levelDifficulties = {
            practitioner: ['beginner'],
            developer: ['beginner', 'intermediate'],
            architect: ['beginner', 'intermediate', 'advanced'],
            master: ['beginner', 'intermediate', 'advanced']
        };
        return levelDifficulties[level] || ['beginner'];
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    startAssessment(assessmentId) {
        const assessment = this.assessments.get(assessmentId);
        if (!assessment) {
            throw new Error('Assessment not found');
        }

        if (assessment.status !== 'active') {
            throw new Error('Assessment is not in active status');
        }

        assessment.startedAt = new Date();
        assessment.status = 'in_progress';
        
        this.emit('assessmentStarted', { assessmentId, userId: assessment.userId });
        
        // Set timeout for assessment
        setTimeout(() => {
            if (assessment.status === 'in_progress') {
                this.completeAssessment(assessmentId, true); // Force complete on timeout
            }
        }, assessment.timeLimit);

        return {
            assessmentId,
            questions: assessment.questions.map(q => ({
                id: q.id,
                type: q.type,
                question: q.question,
                options: q.options,
                code: q.code,
                requirements: q.requirements,
                starterCode: q.starterCode,
                timeLimit: q.timeLimit
            })),
            practicalTasks: assessment.practicalTasks,
            timeLimit: assessment.timeLimit,
            threshold: assessment.threshold
        };
    }

    submitResponse(assessmentId, questionId, response) {
        const assessment = this.assessments.get(assessmentId);
        if (!assessment || assessment.status !== 'in_progress') {
            throw new Error('Invalid assessment or assessment not in progress');
        }

        // Find existing response or create new one
        let responseIndex = assessment.responses.findIndex(r => r.questionId === questionId);
        const responseData = {
            questionId,
            response,
            submittedAt: new Date(),
            score: this.scoreResponse(questionId, response, assessment.questions)
        };

        if (responseIndex >= 0) {
            assessment.responses[responseIndex] = responseData;
        } else {
            assessment.responses.push(responseData);
        }

        this.emit('responseSubmitted', { assessmentId, questionId, score: responseData.score });
        return responseData;
    }

    scoreResponse(questionId, response, questions) {
        const question = questions.find(q => q.id === questionId);
        if (!question) return 0;

        switch (question.type) {
            case 'multiple_choice':
                return response === question.correct ? 1 : 0;
                
            case 'short_answer':
                const keywords = question.expectedKeywords || [];
                const responseText = response.toLowerCase();
                const matchedKeywords = keywords.filter(keyword => 
                    responseText.includes(keyword.toLowerCase())
                );
                return matchedKeywords.length / keywords.length;
                
            case 'code_review':
                const findings = question.expectedFindings || [];
                const userFindings = Array.isArray(response) ? response : [response];
                const matchedFindings = findings.filter(finding => 
                    userFindings.some(uf => uf.toLowerCase().includes(finding.toLowerCase()))
                );
                return matchedFindings.length / findings.length;
                
            case 'coding_task':
                // This would need more sophisticated code analysis
                // For now, return partial credit based on requirements met
                return this.evaluateCodingTask(question, response);
                
            case 'design_task':
                // Evaluate based on requirements coverage
                const requirements = question.requirements || [];
                const designText = response.toLowerCase();
                const metRequirements = requirements.filter(req => 
                    designText.includes(req.toLowerCase())
                );
                return metRequirements.length / requirements.length;
                
            default:
                return 0;
        }
    }

    evaluateCodingTask(question, code) {
        let score = 0;
        const requirements = question.requirements || [];
        const codeText = code.toLowerCase();

        // Basic checks for SPARC methodology
        if (codeText.includes('specifications') || codeText.includes('spec')) score += 0.2;
        if (codeText.includes('pseudocode') || codeText.includes('pseudo')) score += 0.2;
        if (codeText.includes('architecture') || codeText.includes('arch')) score += 0.2;
        if (codeText.includes('refinement') || codeText.includes('refine')) score += 0.2;
        if (codeText.includes('completion') || codeText.includes('complete')) score += 0.2;

        // Check for specific requirements
        requirements.forEach(req => {
            if (codeText.includes(req.toLowerCase())) {
                score += 0.1; // Bonus for meeting requirements
            }
        });

        return Math.min(score, 1); // Cap at 1.0
    }

    completeAssessment(assessmentId, timeout = false) {
        const assessment = this.assessments.get(assessmentId);
        if (!assessment) {
            throw new Error('Assessment not found');
        }

        assessment.completedAt = new Date();
        assessment.status = timeout ? 'timeout' : 'completed';
        
        // Calculate final score
        const totalQuestions = assessment.questions.length;
        const totalScore = assessment.responses.reduce((sum, response) => sum + response.score, 0);
        assessment.score = Math.round((totalScore / totalQuestions) * 100);
        assessment.passed = assessment.score >= assessment.threshold;

        this.emit('assessmentCompleted', {
            assessmentId,
            userId: assessment.userId,
            score: assessment.score,
            passed: assessment.passed,
            timeout
        });

        // Generate certificate if passed
        if (assessment.passed) {
            this.generateCertificate(assessment);
        }

        return {
            score: assessment.score,
            passed: assessment.passed,
            threshold: assessment.threshold,
            completedAt: assessment.completedAt,
            responses: assessment.responses
        };
    }

    generateCertificate(assessment) {
        const certificateId = `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const certificate = {
            id: certificateId,
            userId: assessment.userId,
            level: assessment.level,
            score: assessment.score,
            assessmentId: assessment.id,
            issuedAt: new Date(),
            validUntil: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 1 year
            verificationHash: crypto.createHash('sha256')
                .update(`${certificateId}-${assessment.userId}-${assessment.level}-${assessment.score}`)
                .digest('hex')
        };

        this.certificates.set(certificateId, certificate);
        this.emit('certificateGenerated', certificate);
        return certificate;
    }

    getAssessmentProgress(assessmentId) {
        const assessment = this.assessments.get(assessmentId);
        if (!assessment) return null;

        const totalQuestions = assessment.questions.length + assessment.practicalTasks.length;
        const answeredQuestions = assessment.responses.length;
        const timeElapsed = assessment.startedAt ? Date.now() - assessment.startedAt : 0;
        const timeRemaining = Math.max(0, assessment.timeLimit - timeElapsed);

        return {
            assessmentId,
            progress: {
                answered: answeredQuestions,
                total: totalQuestions,
                percentage: Math.round((answeredQuestions / totalQuestions) * 100)
            },
            timeElapsed,
            timeRemaining,
            status: assessment.status
        };
    }

    verifyCertificate(certificateId, verificationHash) {
        const certificate = this.certificates.get(certificateId);
        if (!certificate) return { valid: false, reason: 'Certificate not found' };

        if (certificate.verificationHash !== verificationHash) {
            return { valid: false, reason: 'Invalid verification hash' };
        }

        if (new Date() > certificate.validUntil) {
            return { valid: false, reason: 'Certificate expired' };
        }

        return {
            valid: true,
            certificate: {
                id: certificate.id,
                level: certificate.level,
                score: certificate.score,
                issuedAt: certificate.issuedAt,
                validUntil: certificate.validUntil
            }
        };
    }

    getUserCertificates(userId) {
        return Array.from(this.certificates.values())
            .filter(cert => cert.userId === userId)
            .map(cert => ({
                id: cert.id,
                level: cert.level,
                score: cert.score,
                issuedAt: cert.issuedAt,
                validUntil: cert.validUntil,
                verificationHash: cert.verificationHash
            }));
    }

    getAssessmentStatistics() {
        const assessments = Array.from(this.assessments.values());
        const completed = assessments.filter(a => a.status === 'completed');
        const passed = completed.filter(a => a.passed);

        const levelStats = {};
        Object.keys(this.certificationLevels).forEach(level => {
            const levelAssessments = completed.filter(a => a.level === level);
            const levelPassed = levelAssessments.filter(a => a.passed);
            levelStats[level] = {
                attempted: levelAssessments.length,
                passed: levelPassed.length,
                passRate: levelAssessments.length > 0 ? 
                    Math.round((levelPassed.length / levelAssessments.length) * 100) : 0,
                averageScore: levelAssessments.length > 0 ?
                    Math.round(levelAssessments.reduce((sum, a) => sum + a.score, 0) / levelAssessments.length) : 0
            };
        });

        return {
            total: assessments.length,
            completed: completed.length,
            passed: passed.length,
            overallPassRate: completed.length > 0 ? 
                Math.round((passed.length / completed.length) * 100) : 0,
            certificatesIssued: this.certificates.size,
            levelStatistics: levelStats
        };
    }
}

module.exports = SPARCAssessmentEngine;