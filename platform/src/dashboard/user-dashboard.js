/**
 * SPARC Evolution - User Dashboard Component
 * Displays user progress, achievements, and analytics
 */

class UserDashboard {
    constructor(authManager) {
        this.authManager = authManager;
        this.container = null;
        this.refreshInterval = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for auth events
        document.addEventListener('sparc:userLoggedIn', (e) => {
            this.render();
        });

        document.addEventListener('sparc:userLoggedOut', () => {
            this.hide();
        });

        document.addEventListener('sparc:progressUpdated', () => {
            this.updateProgressDisplays();
        });

        document.addEventListener('sparc:achievementEarned', (e) => {
            this.showAchievementNotification(e.detail.achievement);
        });
    }

    render() {
        if (!this.authManager.isLoggedIn()) return;

        const user = this.authManager.getCurrentUser();
        const progress = this.authManager.getUserProgress();
        
        // Create dashboard HTML
        const dashboardHTML = this.generateDashboardHTML(user, progress);
        
        // Find or create dashboard container
        let container = document.getElementById('userDashboard');
        if (!container) {
            container = document.createElement('div');
            container.id = 'userDashboard';
            container.className = 'user-dashboard';
            
            // Insert dashboard after header
            const header = document.querySelector('.header');
            if (header) {
                header.insertAdjacentElement('afterend', container);
            }
        }
        
        container.innerHTML = dashboardHTML;
        this.container = container;
        
        // Setup dashboard interactions
        this.setupDashboardInteractions();
        
        // Auto-refresh dashboard every 30 seconds
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        this.refreshInterval = setInterval(() => {
            this.updateProgressDisplays();
        }, 30000);
    }

    generateDashboardHTML(user, progress) {
        const analytics = this.authManager.getAnalytics();
        
        return `
            <div class="dashboard-content">
                <div class="dashboard-header">
                    <div class="user-welcome">
                        <h2>Welcome back, ${user.fullName || user.username}!</h2>
                        <p class="last-login">Last login: ${this.formatDate(user.lastLogin)}</p>
                    </div>
                    
                    <div class="dashboard-actions">
                        <button class="btn btn-outline btn-sm" id="exportProgress">
                            <i class="fas fa-download"></i> Export Progress
                        </button>
                        <button class="btn btn-outline btn-sm" id="viewProfile">
                            <i class="fas fa-user"></i> Profile
                        </button>
                        <button class="btn btn-outline btn-sm" id="dashboardLogout">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <!-- Overview Stats -->
                    <div class="dashboard-card overview-stats">
                        <h3><i class="fas fa-chart-line"></i> Learning Overview</h3>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-number">${this.calculateOverallProgress(progress)}%</div>
                                <div class="stat-label">Overall Progress</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${this.formatTime(analytics.user.totalTimeSpent)}</div>
                                <div class="stat-label">Time Spent</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${analytics.achievements.length}</div>
                                <div class="stat-label">Achievements</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${analytics.streaks.current}</div>
                                <div class="stat-label">Day Streak</div>
                            </div>
                        </div>
                    </div>

                    <!-- Module Progress -->
                    <div class="dashboard-card module-progress">
                        <h3><i class="fas fa-graduation-cap"></i> Module Progress</h3>
                        <div class="modules-list">
                            ${this.generateModuleProgressHTML(analytics.modules)}
                        </div>
                    </div>

                    <!-- Certification Status -->
                    <div class="dashboard-card certification-status">
                        <h3><i class="fas fa-certificate"></i> Certifications</h3>
                        <div class="certifications-list">
                            ${this.generateCertificationHTML(analytics.certifications)}
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="dashboard-card recent-activity">
                        <h3><i class="fas fa-clock"></i> Recent Activity</h3>
                        <div class="activity-list">
                            ${this.generateActivityHTML(progress)}
                        </div>
                    </div>

                    <!-- Playground Stats -->
                    <div class="dashboard-card playground-stats">
                        <h3><i class="fas fa-code"></i> Playground Activity</h3>
                        <div class="playground-metrics">
                            <div class="metric">
                                <span class="metric-label">Sessions Completed:</span>
                                <span class="metric-value">${analytics.playground.sessionsCompleted}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Projects Created:</span>
                                <span class="metric-value">${analytics.playground.projectsCreated}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Code Executions:</span>
                                <span class="metric-value">${analytics.playground.codeExecutions}</span>
                            </div>
                            <div class="metric">
                                <span class="metric-label">Time in Playground:</span>
                                <span class="metric-value">${this.formatTime(analytics.playground.totalTimeSpent)}</span>
                            </div>
                        </div>
                        
                        <div class="sparc-steps-progress">
                            <h4>SPARC Steps Mastery</h4>
                            ${this.generateSparcStepsHTML(analytics.playground.sparcStepsCompleted)}
                        </div>
                    </div>

                    <!-- Achievements -->
                    <div class="dashboard-card achievements">
                        <h3><i class="fas fa-trophy"></i> Achievements</h3>
                        <div class="achievements-grid">
                            ${this.generateAchievementsHTML(analytics.achievements)}
                        </div>
                        ${analytics.achievements.length === 0 ? '<p class="no-achievements">No achievements yet. Keep learning to earn your first achievement!</p>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    generateModuleProgressHTML(modules) {
        return modules.map(module => `
            <div class="module-item ${module.completed ? 'completed' : ''} ${module.locked ? 'locked' : ''}">
                <div class="module-info">
                    <div class="module-name">
                        ${module.locked ? '<i class="fas fa-lock"></i>' : ''}
                        ${module.name}
                    </div>
                    <div class="module-stats">
                        <span>${module.lessonsCompleted} lessons completed</span>
                        <span>${this.formatTime(module.timeSpent)} spent</span>
                    </div>
                </div>
                <div class="module-progress-bar">
                    <div class="progress-fill" style="width: ${module.progress}%"></div>
                    <span class="progress-text">${module.progress}%</span>
                </div>
            </div>
        `).join('');
    }

    generateCertificationHTML(certifications) {
        return certifications.map(cert => `
            <div class="cert-item ${cert.achieved ? 'achieved' : ''}">
                <div class="cert-icon">
                    <i class="fas fa-${cert.achieved ? 'medal' : 'certificate'}"></i>
                </div>
                <div class="cert-info">
                    <div class="cert-name">SPARC ${cert.level.charAt(0).toUpperCase() + cert.level.slice(1)}</div>
                    <div class="cert-status">
                        ${cert.achieved 
                            ? `<span class="achieved">✅ Achieved (${cert.score}%)</span>` 
                            : `<span class="not-achieved">Attempts: ${cert.attempts}</span>`
                        }
                    </div>
                </div>
            </div>
        `).join('');
    }

    generateActivityHTML(progress) {
        const activities = [];
        
        // Recent module completions
        Object.values(progress.modules).forEach(module => {
            if (module.completedAt) {
                activities.push({
                    type: 'module',
                    message: `Completed ${module.name}`,
                    timestamp: module.completedAt,
                    icon: 'graduation-cap'
                });
            }
        });

        // Recent certifications
        Object.entries(progress.certifications).forEach(([level, cert]) => {
            if (cert.achievedAt) {
                activities.push({
                    type: 'certification',
                    message: `Earned ${level.charAt(0).toUpperCase() + level.slice(1)} certification`,
                    timestamp: cert.achievedAt,
                    icon: 'certificate'
                });
            }
        });

        // Recent achievements
        progress.achievements.slice(-3).forEach(achievement => {
            activities.push({
                type: 'achievement',
                message: achievement.title,
                timestamp: achievement.earnedAt,
                icon: 'trophy'
            });
        });

        // Sort by timestamp (most recent first)
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (activities.length === 0) {
            return '<p class="no-activity">No recent activity. Start learning to see your progress here!</p>';
        }

        return activities.slice(0, 5).map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-message">${activity.message}</div>
                    <div class="activity-time">${this.formatDate(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    generateSparcStepsHTML(sparcSteps) {
        const steps = ['specifications', 'pseudocode', 'architecture', 'refinement', 'completion'];
        
        return steps.map(step => {
            const count = sparcSteps[step] || 0;
            return `
                <div class="sparc-step-item">
                    <div class="step-name">${step.charAt(0).toUpperCase() + step.slice(1)}</div>
                    <div class="step-count">${count} completed</div>
                </div>
            `;
        }).join('');
    }

    generateAchievementsHTML(achievements) {
        if (achievements.length === 0) return '';

        return achievements.slice(-6).map(achievement => `
            <div class="achievement-item" title="${achievement.description}">
                <div class="achievement-icon">
                    <i class="fas fa-${this.getAchievementIcon(achievement.category)}"></i>
                </div>
                <div class="achievement-info">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-date">${this.formatDate(achievement.earnedAt)}</div>
                </div>
            </div>
        `).join('');
    }

    setupDashboardInteractions() {
        // Export progress
        const exportBtn = document.getElementById('exportProgress');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportProgress();
            });
        }

        // View profile
        const profileBtn = document.getElementById('viewProfile');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.showProfile();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('dashboardLogout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.authManager.logout();
            });
        }
    }

    updateProgressDisplays() {
        if (!this.container || !this.authManager.isLoggedIn()) return;

        const analytics = this.authManager.getAnalytics();
        
        // Update overview stats
        const overallProgress = this.container.querySelector('.overview-stats .stat-number');
        if (overallProgress) {
            overallProgress.textContent = this.calculateOverallProgress(this.authManager.getUserProgress()) + '%';
        }

        // Update time spent
        const timeSpent = this.container.querySelectorAll('.overview-stats .stat-number')[1];
        if (timeSpent) {
            timeSpent.textContent = this.formatTime(analytics.user.totalTimeSpent);
        }

        // Update streak
        const streak = this.container.querySelectorAll('.overview-stats .stat-number')[3];
        if (streak) {
            streak.textContent = analytics.streaks.current;
        }
    }

    showAchievementNotification(achievement) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup">
                <div class="achievement-header">
                    <i class="fas fa-trophy"></i>
                    <h3>Achievement Unlocked!</h3>
                </div>
                <div class="achievement-content">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                </div>
                <button class="btn btn-primary btn-sm" onclick="this.parentElement.parentElement.remove()">
                    Awesome!
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    exportProgress() {
        const progressData = this.authManager.exportProgress();
        if (!progressData) return;

        // Create and download file
        const blob = new Blob([progressData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sparc-progress-${this.authManager.getCurrentUser().username}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('Progress exported successfully!', 'success');
    }

    showProfile() {
        // Create profile modal
        const user = this.authManager.getCurrentUser();
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>User Profile</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="profile-form">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="profileFullName" value="${user.fullName || ''}" placeholder="Enter your full name">
                        </div>
                        <div class="form-group">
                            <label>Username</label>
                            <input type="text" id="profileUsername" value="${user.username}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="profileEmail" value="${user.email}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Joined</label>
                            <input type="text" value="${this.formatDate(user.createdAt)}" readonly>
                        </div>
                        <div class="form-group">
                            <label>Subscription</label>
                            <input type="text" value="${user.subscription}" readonly>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="saveProfile">Save Changes</button>
                    <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup modal interactions
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelector('#saveProfile').addEventListener('click', () => {
            const fullName = modal.querySelector('#profileFullName').value;
            this.authManager.updateUserData({ fullName });
            this.render(); // Re-render dashboard
            modal.remove();
            this.showMessage('Profile updated successfully!', 'success');
        });
    }

    showMessage(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }

    hide() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Utility methods
    calculateOverallProgress(progress) {
        const modules = Object.values(progress.modules);
        const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0);
        return Math.round(totalProgress / modules.length);
    }

    formatTime(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return '< 1m';
        }
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getAchievementIcon(category) {
        const icons = {
            certification: 'certificate',
            learning: 'graduation-cap',
            practice: 'code',
            general: 'star'
        };
        return icons[category] || 'trophy';
    }
}

// Export
window.UserDashboard = UserDashboard;