/**
 * User Progress Management System
 * Handles module completion tracking and certification prerequisites
 */

const fs = require('fs').promises;
const path = require('path');

class UserProgressManager {
    constructor() {
        this.progressFile = path.join(__dirname, '../../data/user-progress.json');
        this.users = new Map();
        this.loadProgress();
    }

    async loadProgress() {
        try {
            const data = await fs.readFile(this.progressFile, 'utf-8');
            const progressData = JSON.parse(data);
            Object.entries(progressData).forEach(([userId, progress]) => {
                this.users.set(userId, progress);
            });
        } catch (error) {
            console.log('No existing progress file, starting fresh');
            await this.saveProgress();
        }
    }

    async saveProgress() {
        try {
            await fs.mkdir(path.dirname(this.progressFile), { recursive: true });
            const progressData = Object.fromEntries(this.users);
            await fs.writeFile(this.progressFile, JSON.stringify(progressData, null, 2));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    getUserProgress(userId) {
        if (!this.users.has(userId)) {
            this.users.set(userId, {
                id: userId,
                certifications: [],
                moduleProgress: {},
                createdAt: new Date().toISOString(),
                lastActive: new Date().toISOString()
            });
        }
        return this.users.get(userId);
    }

    async updateModuleProgress(userId, moduleId, progressData) {
        const user = this.getUserProgress(userId);
        
        if (!user.moduleProgress[moduleId]) {
            user.moduleProgress[moduleId] = {};
        }
        
        Object.assign(user.moduleProgress[moduleId], progressData, {
            updatedAt: new Date().toISOString()
        });
        
        user.lastActive = new Date().toISOString();
        
        await this.saveProgress();
        return user.moduleProgress[moduleId];
    }

    async addCertification(userId, certification) {
        const user = this.getUserProgress(userId);
        
        // Check if certification already exists
        const existingIndex = user.certifications.findIndex(
            cert => cert.level === certification.level
        );
        
        if (existingIndex >= 0) {
            // Update existing certification if score is better
            if (certification.score > user.certifications[existingIndex].score) {
                user.certifications[existingIndex] = {
                    ...certification,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            user.certifications.push({
                ...certification,
                completedAt: new Date().toISOString()
            });
        }
        
        user.lastActive = new Date().toISOString();
        await this.saveProgress();
        return user.certifications;
    }

    checkCertificationEligibility(userId, level) {
        const user = this.getUserProgress(userId);
        const requirements = this.getCertificationRequirements(level);
        const unmetRequirements = [];

        // Check prerequisite certifications
        if (requirements.prerequisiteCerts) {
            for (const prereqLevel of requirements.prerequisiteCerts) {
                const hasCert = user.certifications.some(
                    cert => cert.level === prereqLevel && cert.score >= requirements.minScore
                );
                if (!hasCert) {
                    unmetRequirements.push(`SPARC ${this.capitalize(prereqLevel)} certification`);
                }
            }
        }

        // Check module completions
        if (requirements.requiredModules) {
            for (const moduleId of requirements.requiredModules) {
                const moduleCompleted = user.moduleProgress[moduleId]?.completed;
                if (!moduleCompleted) {
                    unmetRequirements.push(`Complete ${this.capitalize(moduleId)} module`);
                }
            }
        }

        return {
            eligible: unmetRequirements.length === 0,
            requirements: unmetRequirements,
            level
        };
    }

    getCertificationRequirements(level) {
        const requirements = {
            practitioner: {
                prerequisiteCerts: [],
                requiredModules: ['foundation'],
                minScore: 70
            },
            developer: {
                prerequisiteCerts: ['practitioner'],
                requiredModules: ['foundation'],
                minScore: 75
            },
            architect: {
                prerequisiteCerts: ['developer'],
                requiredModules: ['foundation', 'advanced-patterns'],
                minScore: 80
            },
            master: {
                prerequisiteCerts: ['architect'],
                requiredModules: ['foundation', 'advanced-patterns', 'ai-integration'],
                minScore: 85
            }
        };

        return requirements[level] || { prerequisiteCerts: [], requiredModules: [], minScore: 70 };
    }

    getAvailableModules(userId) {
        const user = this.getUserProgress(userId);
        const modules = [
            {
                id: 'foundation',
                name: 'Module 1: Foundation',
                level: 'Beginner',
                description: 'Learn SPARC fundamentals and build your first application',
                features: [
                    'SPARC methodology overview',
                    'Development environment setup',
                    'First SPARC project'
                ],
                prerequisites: [],
                locked: false,
                completed: user.moduleProgress.foundation?.completed || false,
                score: user.moduleProgress.foundation?.score || 0
            },
            {
                id: 'advanced-patterns',
                name: 'Module 2: Advanced Patterns',
                level: 'Intermediate',
                description: 'Advanced SPARC patterns and real-world applications',
                features: [
                    'Complex system design',
                    'Performance optimization',
                    'Error handling patterns'
                ],
                prerequisites: ['foundation'],
                locked: !user.moduleProgress.foundation?.completed,
                completed: user.moduleProgress['advanced-patterns']?.completed || false,
                score: user.moduleProgress['advanced-patterns']?.score || 0
            },
            {
                id: 'ai-integration',
                name: 'Module 3: AI Integration',
                level: 'Advanced',
                description: 'Integrate AI capabilities using Claude-Flow',
                features: [
                    'Swarm intelligence',
                    'Neural memory systems',
                    'Production deployment'
                ],
                prerequisites: ['foundation', 'advanced-patterns'],
                locked: !user.moduleProgress['advanced-patterns']?.completed,
                completed: user.moduleProgress['ai-integration']?.completed || false,
                score: user.moduleProgress['ai-integration']?.score || 0
            }
        ];

        return { modules, userId };
    }

    getCertificationButtonStates(userId) {
        const user = this.getUserProgress(userId);
        const levels = ['practitioner', 'developer', 'architect', 'master'];
        const buttonStates = {};

        levels.forEach(level => {
            const eligibility = this.checkCertificationEligibility(userId, level);
            const existingCert = user.certifications.find(cert => cert.level === level);
            
            if (existingCert) {
                buttonStates[level] = {
                    enabled: true,
                    completed: true,
                    text: 'View Certificate',
                    score: existingCert.score,
                    completedAt: existingCert.completedAt
                };
            } else if (eligibility.eligible) {
                buttonStates[level] = {
                    enabled: true,
                    completed: false,
                    text: 'Start Assessment',
                    requirements: []
                };
            } else {
                buttonStates[level] = {
                    enabled: false,
                    completed: false,
                    text: eligibility.requirements.length > 0 
                        ? eligibility.requirements[0] 
                        : 'Requirements not met',
                    requirements: eligibility.requirements
                };
            }
        });

        return buttonStates;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Analytics and reporting
    getUserStats(userId) {
        const user = this.getUserProgress(userId);
        const completedModules = Object.values(user.moduleProgress)
            .filter(module => module.completed).length;
        const totalCertifications = user.certifications.length;
        const averageScore = user.certifications.length > 0
            ? Math.round(
                user.certifications.reduce((sum, cert) => sum + cert.score, 0) 
                / user.certifications.length
            )
            : 0;

        return {
            userId,
            completedModules,
            totalModules: 3,
            totalCertifications,
            averageScore,
            createdAt: user.createdAt,
            lastActive: user.lastActive
        };
    }

    getAllUsersStats() {
        const allUsers = Array.from(this.users.values());
        return {
            totalUsers: allUsers.length,
            activeUsers: allUsers.filter(user => {
                const lastActive = new Date(user.lastActive);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return lastActive > weekAgo;
            }).length,
            certificationStats: this.getCertificationStats(),
            moduleCompletionStats: this.getModuleCompletionStats()
        };
    }

    getCertificationStats() {
        const allUsers = Array.from(this.users.values());
        const certCounts = { practitioner: 0, developer: 0, architect: 0, master: 0 };
        
        allUsers.forEach(user => {
            user.certifications.forEach(cert => {
                certCounts[cert.level]++;
            });
        });

        return certCounts;
    }

    getModuleCompletionStats() {
        const allUsers = Array.from(this.users.values());
        const moduleCounts = { foundation: 0, 'advanced-patterns': 0, 'ai-integration': 0 };
        
        allUsers.forEach(user => {
            Object.entries(user.moduleProgress).forEach(([moduleId, progress]) => {
                if (progress.completed && moduleCounts.hasOwnProperty(moduleId)) {
                    moduleCounts[moduleId]++;
                }
            });
        });

        return moduleCounts;
    }

    completeCertification(userId, level, score) {
        const user = this.getUserProgress(userId);
        const certification = {
            level,
            score,
            completedAt: new Date().toISOString(),
            valid: true
        };
        
        // Check if user already has this certification
        const existingIndex = user.certifications.findIndex(cert => cert.level === level);
        if (existingIndex !== -1) {
            // Update existing certification if new score is higher
            if (score > user.certifications[existingIndex].score) {
                user.certifications[existingIndex] = certification;
            }
        } else {
            // Add new certification
            user.certifications.push(certification);
        }
        
        this.saveProgress();
        return certification;
    }
}

module.exports = UserProgressManager;