/**
 * SPARC Evolution - User Authentication & Progress Manager
 * Handles user authentication, session management, and progress tracking
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.storageKey = 'sparc_user_data';
        this.progressKey = 'sparc_user_progress';
        this.sessionKey = 'sparc_session';
        this.init();
    }

    init() {
        this.loadUserSession();
        this.setupEventListeners();
    }

    // User Authentication
    async register(userData) {
        try {
            const user = {
                id: this.generateUserId(),
                email: userData.email,
                username: userData.username,
                fullName: userData.fullName,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                preferences: {
                    theme: 'light',
                    notifications: true,
                    autoSave: true
                },
                subscription: 'free'
            };

            const progress = this.initializeUserProgress(user.id);
            
            this.saveUserData(user);
            this.saveUserProgress(progress);
            this.currentUser = user;
            
            this.triggerEvent('userRegistered', { user, progress });
            return { success: true, user, progress };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    }

    async login(credentials) {
        try {
            // In a real app, this would validate against a backend
            const storedUsers = this.getStoredUsers();
            const user = storedUsers.find(u => 
                u.email === credentials.email || u.username === credentials.username
            );

            if (!user) {
                throw new Error('User not found');
            }

            // Update last login
            user.lastLogin = new Date().toISOString();
            this.updateUserData(user);
            this.currentUser = user;
            
            const progress = this.loadUserProgress(user.id);
            this.triggerEvent('userLoggedIn', { user, progress });
            
            return { success: true, user, progress };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
        this.triggerEvent('userLoggedOut');
    }

    // Progress Management
    initializeUserProgress(userId) {
        return {
            userId,
            lastUpdated: new Date().toISOString(),
            modules: {
                foundation: {
                    id: 'foundation',
                    name: 'SPARC Foundation',
                    completed: false,
                    progress: 0,
                    lessons: {},
                    timeSpent: 0,
                    startedAt: null,
                    completedAt: null
                },
                advanced: {
                    id: 'advanced',
                    name: 'Advanced Patterns',
                    completed: false,
                    progress: 0,
                    lessons: {},
                    timeSpent: 0,
                    startedAt: null,
                    completedAt: null,
                    locked: true
                },
                ai_integration: {
                    id: 'ai_integration',
                    name: 'AI Integration',
                    completed: false,
                    progress: 0,
                    lessons: {},
                    timeSpent: 0,
                    startedAt: null,
                    completedAt: null,
                    locked: true
                }
            },
            certifications: {
                practitioner: { achieved: false, score: null, attemptCount: 0, achievedAt: null },
                developer: { achieved: false, score: null, attemptCount: 0, achievedAt: null },
                architect: { achieved: false, score: null, attemptCount: 0, achievedAt: null },
                master: { achieved: false, score: null, attemptCount: 0, achievedAt: null }
            },
            playground: {
                sessionsCompleted: 0,
                projectsCreated: 0,
                codeExecutions: 0,
                sparcStepsCompleted: {},
                totalTimeSpent: 0
            },
            achievements: [],
            streaks: {
                current: 0,
                longest: 0,
                lastActivity: null
            },
            analytics: {
                totalTimeSpent: 0,
                loginCount: 1,
                featuresUsed: [],
                preferredLearningPath: null
            }
        };
    }

    updateModuleProgress(moduleId, lessonId, completed = false, timeSpent = 0) {
        if (!this.currentUser) return;

        const progress = this.loadUserProgress(this.currentUser.id);
        const module = progress.modules[moduleId];

        if (!module) return;

        // Update lesson progress
        if (!module.lessons[lessonId]) {
            module.lessons[lessonId] = {
                completed: false,
                timeSpent: 0,
                attempts: 0,
                firstCompletedAt: null
            };
        }

        const lesson = module.lessons[lessonId];
        lesson.timeSpent += timeSpent;
        lesson.attempts += 1;

        if (completed && !lesson.completed) {
            lesson.completed = true;
            lesson.firstCompletedAt = new Date().toISOString();
        }

        // Calculate module progress
        const totalLessons = this.getModuleLessonsCount(moduleId);
        const completedLessons = Object.values(module.lessons).filter(l => l.completed).length;
        module.progress = Math.round((completedLessons / totalLessons) * 100);
        module.timeSpent += timeSpent;

        // Mark module as completed if all lessons done
        if (module.progress === 100 && !module.completed) {
            module.completed = true;
            module.completedAt = new Date().toISOString();
            this.unlockNextModule(moduleId);
            this.triggerEvent('moduleCompleted', { moduleId, module });
        }

        // Update overall analytics
        progress.analytics.totalTimeSpent += timeSpent;
        progress.lastUpdated = new Date().toISOString();

        this.saveUserProgress(progress);
        this.triggerEvent('progressUpdated', { moduleId, lessonId, progress });
    }

    getModuleLessonsCount(moduleId) {
        const lessonCounts = {
            foundation: 5,
            advanced: 4,
            ai_integration: 6
        };
        return lessonCounts[moduleId] || 0;
    }

    unlockNextModule(completedModuleId) {
        const progress = this.loadUserProgress(this.currentUser.id);
        
        const unlockMap = {
            foundation: 'advanced',
            advanced: 'ai_integration'
        };

        const nextModuleId = unlockMap[completedModuleId];
        if (nextModuleId && progress.modules[nextModuleId]) {
            progress.modules[nextModuleId].locked = false;
            this.saveUserProgress(progress);
            this.triggerEvent('moduleUnlocked', { moduleId: nextModuleId });
        }
    }

    updateCertificationProgress(level, score, passed) {
        if (!this.currentUser) return;

        const progress = this.loadUserProgress(this.currentUser.id);
        const cert = progress.certifications[level];

        cert.attemptCount += 1;
        cert.score = Math.max(cert.score || 0, score);

        if (passed && !cert.achieved) {
            cert.achieved = true;
            cert.achievedAt = new Date().toISOString();
            this.addAchievement(`${level}_certified`, `SPARC ${level.charAt(0).toUpperCase() + level.slice(1)} Certification`);
            this.triggerEvent('certificationEarned', { level, cert });
        }

        this.saveUserProgress(progress);
    }

    updatePlaygroundProgress(actionType, data = {}) {
        if (!this.currentUser) return;

        const progress = this.loadUserProgress(this.currentUser.id);
        const playground = progress.playground;

        switch (actionType) {
            case 'sessionCompleted':
                playground.sessionsCompleted += 1;
                break;
            case 'projectCreated':
                playground.projectsCreated += 1;
                break;
            case 'codeExecuted':
                playground.codeExecutions += 1;
                break;
            case 'sparcStepCompleted':
                const step = data.step;
                if (!playground.sparcStepsCompleted[step]) {
                    playground.sparcStepsCompleted[step] = 0;
                }
                playground.sparcStepsCompleted[step] += 1;
                break;
            case 'timeSpent':
                playground.totalTimeSpent += data.timeSpent || 0;
                break;
        }

        this.saveUserProgress(progress);
        this.triggerEvent('playgroundUpdated', { actionType, data, playground });
    }

    addAchievement(achievementId, title, description = '') {
        if (!this.currentUser) return;

        const progress = this.loadUserProgress(this.currentUser.id);
        
        // Check if achievement already exists
        if (progress.achievements.find(a => a.id === achievementId)) return;

        const achievement = {
            id: achievementId,
            title,
            description,
            earnedAt: new Date().toISOString(),
            category: this.getAchievementCategory(achievementId)
        };

        progress.achievements.push(achievement);
        this.saveUserProgress(progress);
        this.triggerEvent('achievementEarned', { achievement });
    }

    getAchievementCategory(achievementId) {
        if (achievementId.includes('certified')) return 'certification';
        if (achievementId.includes('module')) return 'learning';
        if (achievementId.includes('playground')) return 'practice';
        return 'general';
    }

    updateStreak() {
        if (!this.currentUser) return;

        const progress = this.loadUserProgress(this.currentUser.id);
        const today = new Date().toDateString();
        const lastActivity = progress.streaks.lastActivity;

        if (!lastActivity || new Date(lastActivity).toDateString() !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastActivity && new Date(lastActivity).toDateString() === yesterday.toDateString()) {
                // Continue streak
                progress.streaks.current += 1;
            } else {
                // Start new streak
                progress.streaks.current = 1;
            }

            progress.streaks.longest = Math.max(progress.streaks.longest, progress.streaks.current);
            progress.streaks.lastActivity = new Date().toISOString();

            this.saveUserProgress(progress);
            this.triggerEvent('streakUpdated', { streak: progress.streaks });
        }
    }

    // Data Persistence
    saveUserData(user) {
        const users = this.getStoredUsers();
        const existingIndex = users.findIndex(u => u.id === user.id);
        
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        localStorage.setItem(this.sessionKey, JSON.stringify(user));
    }

    updateUserData(updates) {
        if (!this.currentUser) return;

        this.currentUser = { ...this.currentUser, ...updates };
        this.saveUserData(this.currentUser);
    }

    getStoredUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch (error) {
            console.error('Error loading stored users:', error);
            return [];
        }
    }

    saveUserProgress(progress) {
        const allProgress = this.getAllProgress();
        allProgress[progress.userId] = progress;
        localStorage.setItem(this.progressKey, JSON.stringify(allProgress));
    }

    loadUserProgress(userId) {
        const allProgress = this.getAllProgress();
        return allProgress[userId] || this.initializeUserProgress(userId);
    }

    getAllProgress() {
        try {
            return JSON.parse(localStorage.getItem(this.progressKey) || '{}');
        } catch (error) {
            console.error('Error loading progress data:', error);
            return {};
        }
    }

    loadUserSession() {
        try {
            const sessionData = localStorage.getItem(this.sessionKey);
            if (sessionData) {
                this.currentUser = JSON.parse(sessionData);
                this.updateStreak();
                this.triggerEvent('sessionRestored', { user: this.currentUser });
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
    }

    // Analytics
    getAnalytics() {
        if (!this.currentUser) return null;

        const progress = this.loadUserProgress(this.currentUser.id);
        const analytics = {
            user: {
                id: this.currentUser.id,
                joinedAt: this.currentUser.createdAt,
                lastLogin: this.currentUser.lastLogin,
                totalTimeSpent: progress.analytics.totalTimeSpent
            },
            modules: Object.values(progress.modules).map(module => ({
                id: module.id,
                name: module.name,
                progress: module.progress,
                completed: module.completed,
                timeSpent: module.timeSpent,
                lessonsCompleted: Object.values(module.lessons).filter(l => l.completed).length
            })),
            certifications: Object.entries(progress.certifications).map(([level, cert]) => ({
                level,
                achieved: cert.achieved,
                score: cert.score,
                attempts: cert.attemptCount,
                achievedAt: cert.achievedAt
            })),
            playground: progress.playground,
            achievements: progress.achievements,
            streaks: progress.streaks
        };

        return analytics;
    }

    exportProgress(format = 'json') {
        if (!this.currentUser) return null;

        const analytics = this.getAnalytics();
        const exportData = {
            exportedAt: new Date().toISOString(),
            user: this.currentUser,
            analytics,
            version: '1.0.0'
        };

        if (format === 'json') {
            return JSON.stringify(exportData, null, 2);
        }

        // For other formats, we'd implement PDF generation, etc.
        return exportData;
    }

    // Utility Methods
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    triggerEvent(eventName, data = {}) {
        const event = new CustomEvent(`sparc:${eventName}`, { detail: data });
        document.dispatchEvent(event);
    }

    setupEventListeners() {
        // Listen for page unload to save session
        window.addEventListener('beforeunload', () => {
            if (this.currentUser) {
                this.updateStreak();
            }
        });

        // Listen for visibility change to track time
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackTimeEnd();
            } else {
                this.trackTimeStart();
            }
        });
    }

    trackTimeStart() {
        this.sessionStartTime = Date.now();
    }

    trackTimeEnd() {
        if (this.sessionStartTime) {
            const timeSpent = Date.now() - this.sessionStartTime;
            if (this.currentUser) {
                const progress = this.loadUserProgress(this.currentUser.id);
                progress.analytics.totalTimeSpent += timeSpent;
                this.saveUserProgress(progress);
            }
        }
    }

    // Public API
    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return !!this.currentUser;
    }

    getUserProgress() {
        return this.currentUser ? this.loadUserProgress(this.currentUser.id) : null;
    }
}

// Export as global
window.AuthManager = AuthManager;