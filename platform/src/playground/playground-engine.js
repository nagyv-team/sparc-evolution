/**
 * SPARC Interactive Code Playground Engine
 * Provides real-time code execution and SPARC methodology guidance
 */

const { EventEmitter } = require('events');
const vm = require('vm');
const fs = require('fs').promises;
const path = require('path');

class SPARCPlaygroundEngine extends EventEmitter {
    constructor(options = {}) {
        super();
        this.sessions = new Map();
        this.examples = new Map();
        this.sparcSteps = {
            specifications: { completed: false, content: '', feedback: [] },
            pseudocode: { completed: false, content: '', feedback: [] },
            architecture: { completed: false, content: '', feedback: [] },
            refinement: { completed: false, content: '', feedback: [] },
            completion: { completed: false, content: '', feedback: [] }
        };
        this.maxExecutionTime = options.timeout || 5000;
        this.loadExamples();
    }

    async loadExamples() {
        try {
            const examplesDir = path.join(__dirname, '../../examples');
            const versions = ['sparc-1.0', 'sparc-2.0', 'sparc-3.0'];
            
            for (const version of versions) {
                const versionPath = path.join(examplesDir, version);
                try {
                    const files = await fs.readdir(versionPath);
                    for (const file of files) {
                        if (file.endsWith('.js')) {
                            const content = await fs.readFile(path.join(versionPath, file), 'utf8');
                            this.examples.set(`${version}/${file}`, {
                                version,
                                name: file.replace('.js', ''),
                                code: content,
                                difficulty: this.getDifficultyLevel(version),
                                sparcSteps: this.extractSPARCSteps(content)
                            });
                        }
                    }
                } catch (err) {
                    console.warn(`Could not load examples from ${version}:`, err.message);
                }
            }
        } catch (error) {
            console.error('Error loading examples:', error);
        }
    }

    createSession(userId, options = {}) {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const session = {
            id: sessionId,
            userId,
            createdAt: new Date(),
            currentStep: 'specifications',
            sparcProgress: JSON.parse(JSON.stringify(this.sparcSteps)),
            codeHistory: [],
            feedback: [],
            completedExercises: [],
            skillLevel: options.skillLevel || 'beginner'
        };
        
        this.sessions.set(sessionId, session);
        this.emit('sessionCreated', { sessionId, userId });
        return sessionId;
    }

    async executeCode(sessionId, code, step = null) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error('Session not found');
        }

        const executionContext = {
            console: {
                log: (...args) => this.emit('output', { sessionId, type: 'log', data: args }),
                error: (...args) => this.emit('output', { sessionId, type: 'error', data: args }),
                warn: (...args) => this.emit('output', { sessionId, type: 'warn', data: args })
            },
            setTimeout,
            clearTimeout,
            setInterval,
            clearInterval,
            Buffer,
            process: { env: {} }
        };

        try {
            const result = await this.runWithTimeout(code, executionContext);
            
            // Store in history
            session.codeHistory.push({
                timestamp: new Date(),
                code,
                step,
                result,
                feedback: this.analyzeSPARCCompliance(code, step)
            });

            // Update SPARC progress if step specified
            if (step && session.sparcProgress[step]) {
                session.sparcProgress[step].content = code;
                session.sparcProgress[step].completed = true;
                session.sparcProgress[step].feedback = this.analyzeSPARCCompliance(code, step);
            }

            this.emit('codeExecuted', { sessionId, step, result });
            return {
                success: true,
                result,
                sparcFeedback: step ? session.sparcProgress[step].feedback : [],
                nextSuggestion: this.getNextStepSuggestion(session)
            };

        } catch (error) {
            this.emit('executionError', { sessionId, error: error.message });
            return {
                success: false,
                error: error.message,
                sparcFeedback: step ? this.analyzeSPARCCompliance(code, step) : []
            };
        }
    }

    runWithTimeout(code, context) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error(`Execution timeout after ${this.maxExecutionTime}ms`));
            }, this.maxExecutionTime);

            try {
                const script = new vm.Script(code);
                const vmContext = vm.createContext(context);
                const result = script.runInContext(vmContext);
                clearTimeout(timeout);
                resolve(result);
            } catch (error) {
                clearTimeout(timeout);
                reject(error);
            }
        });
    }

    analyzeSPARCCompliance(code, step) {
        const feedback = [];
        
        switch (step) {
            case 'specifications':
                if (!code.includes('/**') && !code.includes('//')) {
                    feedback.push({ type: 'warning', message: 'Consider adding documentation comments to clarify requirements' });
                }
                if (code.includes('function') || code.includes('class')) {
                    feedback.push({ type: 'error', message: 'Specifications should focus on requirements, not implementation' });
                }
                break;
                
            case 'pseudocode':
                if (!code.includes('//') && !code.includes('/*')) {
                    feedback.push({ type: 'warning', message: 'Pseudocode should include step-by-step comments' });
                }
                if (code.includes('function') && !code.includes('// TODO') && !code.includes('// Step')) {
                    feedback.push({ type: 'suggestion', message: 'Consider adding step-by-step comments to explain the logic' });
                }
                break;
                
            case 'architecture':
                if (!code.includes('class') && !code.includes('function') && !code.includes('module')) {
                    feedback.push({ type: 'warning', message: 'Architecture should define components and their relationships' });
                }
                break;
                
            case 'refinement':
                if (!code.includes('try') && !code.includes('catch')) {
                    feedback.push({ type: 'suggestion', message: 'Consider adding error handling for robustness' });
                }
                break;
                
            case 'completion':
                if (!code.includes('test') && !code.includes('assert')) {
                    feedback.push({ type: 'suggestion', message: 'Consider adding tests to validate your implementation' });
                }
                break;
        }
        
        return feedback;
    }

    getNextStepSuggestion(session) {
        const steps = Object.keys(session.sparcProgress);
        const currentIndex = steps.indexOf(session.currentStep);
        
        if (currentIndex < steps.length - 1) {
            const nextStep = steps[currentIndex + 1];
            return {
                step: nextStep,
                description: this.getStepDescription(nextStep),
                examples: this.getStepExamples(nextStep)
            };
        }
        
        return {
            step: 'complete',
            description: 'Congratulations! You have completed all SPARC steps.',
            nextExercise: this.suggestNextExercise(session)
        };
    }

    getStepDescription(step) {
        const descriptions = {
            specifications: 'Define clear requirements and problem statement',
            pseudocode: 'Write step-by-step logical flow before implementation',
            architecture: 'Design system components and their relationships',
            refinement: 'Improve and optimize your implementation',
            completion: 'Finalize with testing and validation'
        };
        return descriptions[step] || 'Unknown step';
    }

    getStepExamples(step) {
        return Array.from(this.examples.values())
            .filter(ex => ex.sparcSteps && ex.sparcSteps[step])
            .slice(0, 3)
            .map(ex => ({
                name: ex.name,
                code: ex.sparcSteps[step],
                version: ex.version
            }));
    }

    extractSPARCSteps(code) {
        const steps = {};
        const sections = code.split(/\/\*\*[\s\S]*?\*\//g);
        
        sections.forEach(section => {
            if (section.includes('SPECIFICATIONS') || section.includes('Specifications')) {
                steps.specifications = section.trim();
            }
            if (section.includes('PSEUDOCODE') || section.includes('Pseudocode')) {
                steps.pseudocode = section.trim();
            }
            if (section.includes('ARCHITECTURE') || section.includes('Architecture')) {
                steps.architecture = section.trim();
            }
            if (section.includes('REFINEMENT') || section.includes('Refinement')) {
                steps.refinement = section.trim();
            }
            if (section.includes('COMPLETION') || section.includes('Completion')) {
                steps.completion = section.trim();
            }
        });
        
        return steps;
    }

    getDifficultyLevel(version) {
        const levels = {
            'sparc-1.0': 'beginner',
            'sparc-2.0': 'intermediate', 
            'sparc-3.0': 'advanced'
        };
        return levels[version] || 'beginner';
    }

    suggestNextExercise(session) {
        const userLevel = session.skillLevel;
        const completed = session.completedExercises;
        
        return Array.from(this.examples.values())
            .filter(ex => ex.difficulty === userLevel && !completed.includes(ex.name))
            .slice(0, 3)
            .map(ex => ({
                name: ex.name,
                version: ex.version,
                difficulty: ex.difficulty
            }));
    }

    getSessionProgress(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) return null;
        
        const totalSteps = Object.keys(session.sparcProgress).length;
        const completedSteps = Object.values(session.sparcProgress)
            .filter(step => step.completed).length;
            
        return {
            sessionId,
            progress: {
                completed: completedSteps,
                total: totalSteps,
                percentage: Math.round((completedSteps / totalSteps) * 100)
            },
            currentStep: session.currentStep,
            sparcProgress: session.sparcProgress,
            codeHistory: session.codeHistory.slice(-10), // Last 10 executions
            skillLevel: session.skillLevel
        };
    }

    closeSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            this.emit('sessionClosed', { sessionId, duration: Date.now() - session.createdAt });
            this.sessions.delete(sessionId);
            return true;
        }
        return false;
    }

    getAvailableExamples() {
        return Array.from(this.examples.entries()).map(([key, example]) => ({
            id: key,
            name: example.name,
            version: example.version,
            difficulty: example.difficulty,
            hasSparcSteps: !!example.sparcSteps
        }));
    }
}

module.exports = SPARCPlaygroundEngine;