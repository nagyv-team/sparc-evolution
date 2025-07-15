/**
 * SPARC Evolution Platform - Main JavaScript
 * Interactive functionality for the educational platform
 */

// Global state
const state = {
    currentSection: 'home',
    playgroundSession: null,
    assessmentSession: null,
    user: null,
    userProgress: null
};

// API Configuration
const API_BASE = '/api';

// DOM Elements
const elements = {};

// Test immediate execution
console.log('JavaScript file loaded!');

// Debug function - can be called from browser console
window.debugButtons = function() {
    console.log('=== BUTTON DEBUG ===');
    
    // Find all buttons
    const moduleButtons = document.querySelectorAll('.module-btn');
    const certButtons = document.querySelectorAll('.cert-btn');
    
    console.log('Module buttons found:', moduleButtons.length);
    moduleButtons.forEach((btn, i) => {
        console.log(`Module button ${i}:`, btn, 'data-module:', btn.dataset.module, 'disabled:', btn.disabled, 'visible:', !btn.closest('.hidden'));
    });
    
    console.log('Cert buttons found:', certButtons.length);
    certButtons.forEach((btn, i) => {
        console.log(`Cert button ${i}:`, btn, 'data-level:', btn.dataset.level, 'disabled:', btn.disabled, 'visible:', !btn.closest('.hidden'));
    });
    
    console.log('Current section:', state.currentSection);
    console.log('User progress:', state.userProgress);
};

// Force update function
window.forceUpdate = async function() {
    console.log('=== FORCING UI UPDATE ===');
    await updateCertificationUI();
    await updateLearningModulesUI();
    console.log('Update complete');
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing...');
    console.log('Window location:', window.location.href);
    initializeElements();
    
    // Debug: Check loading overlay status
    const overlay = document.getElementById('loadingOverlay');
    console.log('Loading overlay found:', !!overlay);
    console.log('Loading overlay classes:', overlay?.className);
    console.log('Loading overlay style.display:', overlay?.style.display);
    
    // Force hide loading overlay
    if (overlay) {
        overlay.style.display = 'none';
        overlay.classList.add('hidden');
        console.log('Forced loading overlay to hidden');
    }
    
    setupEventListeners();
    setupNavigation();
    
    // Load user progress and update UI immediately
    console.log('Loading user progress...');
    await loadUserProgress();
    console.log('User progress loaded:', state.userProgress);
    
    // Always update both UIs regardless of current section
    console.log('Updating certification UI...');
    await updateCertificationUI();
    
    console.log('Updating learning modules UI...');
    await updateLearningModulesUI();
    
    // Force update again after a delay to ensure DOM is ready
    setTimeout(async () => {
        console.log('Running delayed UI updates...');
        await updateCertificationUI();
        await updateLearningModulesUI();
        console.log('Delayed updates complete');
    }, 1000);
    
    // Don't load examples immediately to prevent loading popup
    // loadExamples();
    
    console.log('Initialization complete');
    
    // Debug: Check if buttons are being found and updated
    setTimeout(() => {
        console.log('=== POST-LOAD BUTTON CHECK ===');
        const foundationBtn = document.querySelector('[data-module="foundation"]');
        const practBtn = document.querySelector('[data-level="practitioner"]');
        console.log('Foundation button:', foundationBtn);
        console.log('Practitioner button:', practBtn);
        
        if (foundationBtn) {
            console.log('Foundation button classes:', foundationBtn.className);
            console.log('Foundation button text:', foundationBtn.textContent);
            console.log('Foundation button disabled:', foundationBtn.disabled);
        }
        
        if (practBtn) {
            console.log('Practitioner button classes:', practBtn.className);
            console.log('Practitioner button text:', practBtn.textContent);
            console.log('Practitioner button disabled:', practBtn.disabled);
        }
    }, 2000);
});

// Initialize DOM element references
function initializeElements() {
    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.sections = document.querySelectorAll('section');
    elements.startLearningBtn = document.getElementById('startLearningBtn');
    elements.tryPlaygroundBtn = document.getElementById('tryPlaygroundBtn');
    elements.loginBtn = document.getElementById('loginBtn');
    elements.signupBtn = document.getElementById('signupBtn');
    elements.loadingOverlay = document.getElementById('loadingOverlay');
    
    // Playground elements
    elements.codeEditor = document.getElementById('codeEditor');
    elements.runCode = document.getElementById('runCode');
    elements.clearCode = document.getElementById('clearCode');
    elements.outputContent = document.getElementById('outputContent');
    elements.examplesList = document.getElementById('examplesList');
    elements.progressSteps = document.querySelectorAll('.progress-step');
    
    // Certification elements
    elements.certBtns = document.querySelectorAll('.cert-btn');
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Hero buttons
    elements.startLearningBtn?.addEventListener('click', () => navigateToSection('learning'));
    elements.tryPlaygroundBtn?.addEventListener('click', () => navigateToSection('playground'));
    
    // Auth buttons
    elements.loginBtn?.addEventListener('click', handleLogin);
    elements.signupBtn?.addEventListener('click', handleSignup);
    
    // Playground
    elements.runCode?.addEventListener('click', executeCode);
    elements.clearCode?.addEventListener('click', clearEditor);
    
    // Progress steps
    elements.progressSteps.forEach(step => {
        step.addEventListener('click', () => switchSparcStep(step.dataset.step));
    });
    
    // Use single event delegation for all button clicks
    document.addEventListener('click', (e) => {
        console.log('Click detected on:', e.target);
        
        if (e.target.classList.contains('cert-btn')) {
            console.log('Certification button clicked:', e.target, 'Level:', e.target.dataset.level);
            startAssessment(e.target.dataset.level);
        } else if (e.target.classList.contains('module-btn')) {
            console.log('Module button clicked:', e.target);
            handleModuleStart(e);
        }
    });
}

// Navigation handling
function setupNavigation() {
    // Check for hash in URL
    const hash = window.location.hash.slice(1) || 'home';
    navigateToSection(hash);
}

function handleNavigation(e) {
    e.preventDefault();
    const target = e.target.getAttribute('href').slice(1);
    navigateToSection(target);
}

function navigateToSection(sectionId) {
    console.log('Navigating to section:', sectionId);
    
    // Update active nav link
    elements.navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
    });
    
    // Show/hide sections
    elements.sections.forEach(section => {
        const isTarget = section.id === sectionId;
        section.classList.toggle('hidden', !isTarget);
        console.log(`Section ${section.id}: ${isTarget ? 'shown' : 'hidden'}`);
    });
    
    // Update state
    state.currentSection = sectionId;
    window.location.hash = sectionId;
    
    // Initialize section-specific features with delay to ensure DOM is ready
    setTimeout(() => {
        if (sectionId === 'playground' && !state.playgroundSession) {
            initializePlayground();
            // Load examples when playground is accessed
            loadExamples();
        } else if (sectionId === 'certification') {
            console.log('Loading certification section...');
            updateCertificationUI();
        } else if (sectionId === 'learning') {
            console.log('Loading learning section...');
            updateLearningModulesUI();
        }
    }, 100);
}

// Playground functionality
async function initializePlayground() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/playground/session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: state.user?.id || 'guest_' + Date.now(),
                skillLevel: 'beginner'
            })
        });
        
        const data = await response.json();
        state.playgroundSession = data.sessionId;
        showMessage('Playground initialized. Start with specifications!', 'success');
    } catch (error) {
        console.error('Error initializing playground:', error);
        showMessage('Failed to initialize playground', 'error');
    } finally {
        hideLoading();
    }
}

async function executeCode() {
    if (!state.playgroundSession) {
        await initializePlayground();
    }
    
    const code = elements.codeEditor.value;
    const currentStep = document.querySelector('.progress-step.active').dataset.step;
    
    if (!code.trim()) {
        showMessage('Please write some code first', 'warning');
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/playground/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: state.playgroundSession,
                code,
                step: currentStep
            })
        });
        
        const result = await response.json();
        displayExecutionResult(result);
        
        // Update progress if successful
        if (result.success) {
            updateProgress();
        }
    } catch (error) {
        console.error('Error executing code:', error);
        showMessage('Execution failed: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

function displayExecutionResult(result) {
    elements.outputContent.innerHTML = '';
    
    if (result.success) {
        // Show execution result
        if (result.result) {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'execution-result';
            resultDiv.textContent = 'Result: ' + JSON.stringify(result.result);
            elements.outputContent.appendChild(resultDiv);
        }
        
        // Show SPARC feedback
        if (result.sparcFeedback && result.sparcFeedback.length > 0) {
            result.sparcFeedback.forEach(feedback => {
                const feedbackDiv = document.createElement('div');
                feedbackDiv.className = `feedback-message ${feedback.type}`;
                feedbackDiv.innerHTML = `<i class="fas fa-${getFeedbackIcon(feedback.type)}"></i> ${feedback.message}`;
                elements.outputContent.appendChild(feedbackDiv);
            });
        } else {
            showMessage('Great job! Your code follows SPARC principles.', 'success');
        }
        
        // Show next suggestion
        if (result.nextSuggestion) {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'feedback-message success';
            suggestionDiv.innerHTML = `<i class="fas fa-arrow-right"></i> Next: ${result.nextSuggestion.description}`;
            elements.outputContent.appendChild(suggestionDiv);
        }
    } else {
        showMessage(`Error: ${result.error}`, 'error');
    }
}

function getFeedbackIcon(type) {
    const icons = {
        'error': 'times-circle',
        'warning': 'exclamation-triangle',
        'success': 'check-circle',
        'suggestion': 'lightbulb'
    };
    return icons[type] || 'info-circle';
}

function clearEditor() {
    elements.codeEditor.value = '';
    elements.outputContent.innerHTML = '<div class="feedback-message"><i class="fas fa-info-circle"></i> Editor cleared. Ready for new code!</div>';
}

function switchSparcStep(step) {
    elements.progressSteps.forEach(s => {
        s.classList.toggle('active', s.dataset.step === step);
    });
    
    // Update editor placeholder
    const placeholders = {
        specifications: 'Start writing your SPARC specifications here...\n\n/**\n * SPECIFICATIONS\n * \n * Problem: [Define the problem]\n * Requirements: [List requirements]\n * Constraints: [Any limitations]\n */',
        pseudocode: 'Write your pseudocode here...\n\n/**\n * PSEUDOCODE\n * \n * Step 1: [First step]\n * Step 2: [Second step]\n * Step 3: [Third step]\n */',
        architecture: 'Design your system architecture...\n\n/**\n * ARCHITECTURE\n * \n * Components:\n * - [Component 1]: [Description]\n * - [Component 2]: [Description]\n * \n * Interactions:\n * - [How components interact]\n */',
        refinement: 'Refine and optimize your implementation...\n\n/**\n * REFINEMENT\n * \n * Optimizations:\n * - [Optimization 1]\n * - [Optimization 2]\n * \n * Error Handling:\n * - [Error case 1]\n * - [Error case 2]\n */',
        completion: 'Complete your implementation with tests...\n\n/**\n * COMPLETION\n * \n * Implementation:\n * [Your final code]\n * \n * Tests:\n * [Test cases]\n */'
    };
    
    if (!elements.codeEditor.value.trim()) {
        elements.codeEditor.placeholder = placeholders[step] || 'Start coding...';
    }
    
    // Update current step display
    document.querySelector('.current-step').textContent = step.charAt(0).toUpperCase() + step.slice(1);
}

async function updateProgress() {
    if (!state.playgroundSession) return;
    
    try {
        const response = await fetch(`${API_BASE}/playground/progress/${state.playgroundSession}`);
        const progress = await response.json();
        
        // Update UI based on progress
        Object.entries(progress.sparcProgress).forEach(([step, data]) => {
            const stepElement = document.querySelector(`[data-step="${step}"]`);
            if (stepElement && data.completed) {
                stepElement.classList.add('completed');
            }
        });
        
        // Show completion message if all steps done
        if (progress.progress.percentage === 100) {
            showMessage('Congratulations! You\'ve completed all SPARC steps!', 'success');
        }
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

// Load code examples
async function loadExamples() {
    try {
        const response = await fetch(`${API_BASE}/playground/examples`);
        const data = await response.json();
        
        elements.examplesList.innerHTML = '';
        data.examples.forEach(example => {
            const exampleDiv = document.createElement('div');
            exampleDiv.className = 'example-item';
            exampleDiv.innerHTML = `
                <div class="example-title">${example.name}</div>
                <div class="example-meta">
                    <span class="example-version">${example.version}</span>
                    <span class="example-difficulty">${example.difficulty}</span>
                </div>
            `;
            exampleDiv.addEventListener('click', () => loadExample(example.id));
            elements.examplesList.appendChild(exampleDiv);
        });
    } catch (error) {
        console.error('Error loading examples:', error);
    }
}

async function loadExample(exampleId) {
    showMessage(`Loading example: ${exampleId}`, 'info');
    // In a real implementation, fetch the example code
    // For now, show a placeholder
    elements.codeEditor.value = `// Example: ${exampleId}\n// This would load the actual example code`;
}

// Assessment functionality
async function startAssessment(level) {
    console.log('Starting assessment for level:', level);
    
    // Check if user is eligible for this certification level
    const userId = getCurrentUserId();
    const response = await fetch(`${API_BASE}/certification/button-states/${userId}`);
    const buttonStates = await response.json();
    
    if (!buttonStates[level] || !buttonStates[level].enabled) {
        showMessage('You are not eligible for this certification level yet', 'warning');
        return;
    }
    
    // Show actual assessment
    showAssessmentModal(level);
}

function showAssessmentModal(level) {
    const assessmentData = getAssessmentData(level);
    
    // Create assessment modal
    const modal = document.createElement('div');
    modal.className = 'assessment-modal module-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${assessmentData.title}</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Certification Level:</strong> ${assessmentData.level}</p>
                <p><strong>Questions:</strong> ${assessmentData.questions.length}</p>
                <p><strong>Passing Score:</strong> ${assessmentData.passingScore}%</p>
                <p><strong>Time Limit:</strong> ${assessmentData.timeLimit} minutes</p>
                
                <div class="assessment-questions">
                    ${assessmentData.questions.map((question, index) => `
                        <div class="question" data-question="${index}">
                            <h4>Question ${index + 1}</h4>
                            <p>${question.question}</p>
                            ${question.options.map((option, optIndex) => `
                                <label>
                                    <input type="radio" name="question_${index}" value="${optIndex}">
                                    ${option}
                                </label>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
                
                <div class="assessment-actions">
                    <button class="submit-assessment-btn" data-level="${level}">Submit Assessment</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setupAssessmentModalEventListeners(modal, assessmentData);
    modal.style.display = 'block';
}

function getAssessmentData(level) {
    const assessments = {
        'practitioner': {
            title: 'SPARC Practitioner Certification',
            level: 'Foundation',
            passingScore: 70,
            timeLimit: 30,
            questions: [
                {
                    question: 'What does SPARC stand for?',
                    options: [
                        'System, Protocol, Architecture, Runtime, Code',
                        'Specifications, Pseudocode, Architecture, Refinement, Completion',
                        'Software, Programming, Analysis, Research, Construction',
                        'Structure, Process, Algorithm, Review, Completion'
                    ],
                    correct: 1
                },
                {
                    question: 'Which step comes first in the SPARC methodology?',
                    options: ['Pseudocode', 'Specifications', 'Architecture', 'Refinement'],
                    correct: 1
                },
                {
                    question: 'What is the purpose of the Refinement step?',
                    options: [
                        'To write the final code',
                        'To create the initial design',
                        'To iteratively improve and optimize the solution',
                        'To document the requirements'
                    ],
                    correct: 2
                },
                {
                    question: 'In SPARC, when should you write pseudocode?',
                    options: [
                        'After completing the implementation',
                        'Before defining specifications',
                        'After specifications but before architecture',
                        'During the completion phase'
                    ],
                    correct: 2
                }
            ]
        },
        'developer': {
            title: 'SPARC Developer Certification',
            level: 'Intermediate',
            passingScore: 75,
            timeLimit: 45,
            questions: [
                {
                    question: 'How does SPARC handle complex system design?',
                    options: [
                        'By skipping the architecture phase',
                        'By breaking down problems into manageable components',
                        'By writing code first and then documenting',
                        'By using only pseudocode'
                    ],
                    correct: 1
                },
                {
                    question: 'What is the key benefit of the SPARC refinement process?',
                    options: [
                        'Faster initial development',
                        'Less documentation required',
                        'Iterative improvement and optimization',
                        'Automatic code generation'
                    ],
                    correct: 2
                }
            ]
        },
        'architect': {
            title: 'SPARC Architect Certification',
            level: 'Advanced',
            passingScore: 80,
            timeLimit: 60,
            questions: [
                {
                    question: 'How do you design enterprise systems using SPARC?',
                    options: [
                        'Start with code and add architecture later',
                        'Focus only on specifications',
                        'Use systematic architecture planning with refinement cycles',
                        'Skip pseudocode for complex systems'
                    ],
                    correct: 2
                }
            ]
        }
    };
    
    return assessments[level] || assessments['practitioner'];
}

function setupAssessmentModalEventListeners(modal, assessmentData) {
    // Close modal
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Submit assessment
    const submitBtn = modal.querySelector('.submit-assessment-btn');
    submitBtn.addEventListener('click', async (e) => {
        const level = e.target.dataset.level;
        const questions = modal.querySelectorAll('.question');
        let correctAnswers = 0;
        let totalQuestions = assessmentData.questions.length;
        
        // Check answers
        questions.forEach((questionEl, index) => {
            const selectedAnswer = questionEl.querySelector('input[type="radio"]:checked');
            if (selectedAnswer && parseInt(selectedAnswer.value) === assessmentData.questions[index].correct) {
                correctAnswers++;
            }
        });
        
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const passed = score >= assessmentData.passingScore;
        
        // Save certification result
        if (passed) {
            await completeCertification(level, score);
            showMessage(`Congratulations! You passed the ${assessmentData.title} with ${score}%`, 'success');
        } else {
            showMessage(`You scored ${score}%. You need ${assessmentData.passingScore}% to pass. Try again after more study.`, 'warning');
        }
        
        modal.remove();
    });
}

async function completeCertification(level, score) {
    try {
        const userId = getCurrentUserId();
        const response = await fetch(`${API_BASE}/certification/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                level,
                score
            })
        });
        
        const result = await response.json();
        if (result.success) {
            // Update UI
            await updateCertificationUI();
            console.log('Certification completed:', result);
        }
    } catch (error) {
        console.error('Error completing certification:', error);
    }
}

// Module handling

// Auth functionality
function handleLogin() {
    showMessage('Login functionality coming soon!', 'info');
}

function handleSignup() {
    showMessage('Signup functionality coming soon!', 'info');
}

// Utility functions
function showLoading() {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.classList.remove('hidden');
        elements.loadingOverlay.style.display = 'flex';
    }
}

function hideLoading() {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.classList.add('hidden');
        elements.loadingOverlay.style.display = 'none';
    }
}

function showMessage(message, type = 'info') {
    if (elements.outputContent && state.currentSection === 'playground') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `feedback-message ${type}`;
        messageDiv.innerHTML = `<i class="fas fa-${getFeedbackIcon(type)}"></i> ${message}`;
        elements.outputContent.appendChild(messageDiv);
    } else {
        // In a real app, show a toast notification
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// User Progress Management Functions
async function loadUserProgress() {
    try {
        const userId = getCurrentUserId();
        const response = await fetch(`${API_BASE}/user/progress/${userId}`);
        const data = await response.json();
        state.userProgress = data;
        
        // Update UI immediately if on relevant sections
        if (state.currentSection === 'certification') {
            updateCertificationUI();
        } else if (state.currentSection === 'learning') {
            updateLearningModulesUI();
        }
    } catch (error) {
        console.error('Error loading user progress:', error);
        // Initialize with empty progress for guest users
        state.userProgress = {
            id: getCurrentUserId(),
            certifications: [],
            moduleProgress: {}
        };
    }
}

async function updateCertificationUI() {
    if (!state.userProgress) {
        await loadUserProgress();
    }
    
    try {
        const userId = getCurrentUserId();
        const response = await fetch(`${API_BASE}/certification/button-states/${userId}`);
        const buttonStates = await response.json();
        
        // Update certification buttons based on user progress
        console.log('Updating certification buttons with states:', buttonStates);
        
        // Find all cert buttons first
        const allCertButtons = document.querySelectorAll('.cert-btn');
        console.log('All cert buttons found:', allCertButtons.length);
        
        Object.entries(buttonStates).forEach(([level, state_data]) => {
            console.log(`Looking for cert button with data-level="${level}"`);
            const btn = document.querySelector(`[data-level="${level}"]`);
            console.log('Found cert button:', btn);
            if (!btn) {
                console.error(`Button not found for level: ${level}`);
                return;
            }
            
            btn.textContent = state_data.text;
            btn.disabled = !state_data.enabled;
            btn.className = state_data.enabled 
                ? (state_data.completed ? 'btn btn-success cert-btn' : 'btn btn-primary cert-btn')
                : 'btn btn-disabled cert-btn';
            
            // Update requirements display
            const card = btn.closest('.cert-card');
            const requirements = card.querySelector('.cert-requirements');
            if (state_data.requirements && state_data.requirements.length > 0) {
                requirements.innerHTML = state_data.requirements.map(req => 
                    `<li><i class="fas fa-lock"></i> ${req}</li>`
                ).join('');
            } else if (state_data.completed) {
                requirements.innerHTML = `<li><i class="fas fa-check"></i> Completed with ${state_data.score}%</li>`;
            }
        });
    } catch (error) {
        console.error('Error updating certification UI:', error);
    }
}

async function updateLearningModulesUI() {
    if (!state.userProgress) {
        await loadUserProgress();
    }
    
    try {
        const userId = getCurrentUserId();
        const response = await fetch(`${API_BASE}/modules/available/${userId}`);
        const data = await response.json();
        
        // Update module cards based on progress
        console.log('Updating modules UI with data:', data.modules);
        
        // Find all module buttons first
        const allModuleButtons = document.querySelectorAll('.module-btn');
        console.log('All module buttons found:', allModuleButtons.length);
        
        data.modules.forEach(module => {
            console.log(`Looking for button with data-module="${module.id}"`);
            const btn = document.querySelector(`[data-module="${module.id}"]`);
            console.log('Found button:', btn);
            if (!btn) {
                console.error(`Button not found for module: ${module.id}`);
                return;
            }
            
            const card = btn.closest('.module-card');
            const progressFill = card.querySelector('.progress-fill');
            const progressText = card.querySelector('.progress-text');
            const features = card.querySelectorAll('.module-features li i');
            
            console.log(`Updating ${module.id}: locked=${module.locked}, completed=${module.completed}, score=${module.score}`);
            
            // Clear any test styling
            btn.removeAttribute('style');
            
            if (module.locked) {
                btn.textContent = `Complete ${module.prerequisites[0]} Module`;
                btn.disabled = true;
                btn.className = 'btn btn-disabled module-btn';
                
                // Show lock icons
                features.forEach(icon => {
                    icon.className = 'fas fa-lock';
                });
                
                if (progressText) progressText.textContent = 'Locked';
            } else if (module.completed) {
                btn.textContent = 'Review Module';
                btn.disabled = false;
                btn.className = 'btn btn-success module-btn';
                
                if (progressFill) progressFill.style.width = '100%';
                if (progressText) progressText.textContent = `Completed - Score: ${module.score}%`;
                
                // Show check icons
                features.forEach(icon => {
                    icon.className = 'fas fa-check';
                });
            } else {
                btn.textContent = 'Start Module';
                btn.disabled = false;
                btn.className = 'btn btn-primary module-btn';
                
                if (progressText) progressText.textContent = '0% Complete';
                if (progressFill) progressFill.style.width = '0%';
                
                // Show check icons for unlocked modules
                features.forEach(icon => {
                    icon.className = 'fas fa-check';
                });
            }
            
            console.log(`Updated ${module.id} button to: text="${btn.textContent}", disabled=${btn.disabled}, className="${btn.className}"`);
        });
    } catch (error) {
        console.error('Error updating learning modules UI:', error);
    }
}

function getModuleIndex(moduleId) {
    const moduleIndices = {
        'foundation': 1,
        'advanced-patterns': 2,
        'ai-integration': 3
    };
    return moduleIndices[moduleId] || 1;
}

function getCurrentUserId() {
    const userId = state.user?.id || 'guest_' + (localStorage.getItem('guestId') || Date.now());
    console.log('getCurrentUserId returning:', userId);
    return userId;
}

async function completeModule(moduleId, score = 85) {
    try {
        const userId = getCurrentUserId();
        console.log('Completing module:', moduleId, 'for user:', userId, 'with score:', score);
        
        const response = await fetch(`${API_BASE}/user/progress/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                module: moduleId,
                completed: true,
                score: score
            })
        });
        
        console.log('API response status:', response.status);
        const result = await response.json();
        console.log('API response result:', result);
        
        if (result.success) {
            state.userProgress.moduleProgress = result.moduleProgress;
            showMessage(`${moduleId} module completed with ${score}% score!`, 'success');
            
            // Update UI - update both learning modules and certification buttons
            console.log('Updating UI after module completion...');
            await updateLearningModulesUI();
            await updateCertificationUI();
            console.log('UI updates completed');
        }
    } catch (error) {
        console.error('Error completing module:', error);
        showMessage('Failed to save module progress', 'error');
    }
}

// Enhanced Assessment functionality
async function startAssessment(level) {
    try {
        // Check eligibility first
        const userId = getCurrentUserId();
        const eligibilityResponse = await fetch(`${API_BASE}/certification/check-eligibility`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, level })
        });
        
        const eligibility = await eligibilityResponse.json();
        if (!eligibility.eligible) {
            showMessage(`Prerequisites not met: ${eligibility.requirements.join(', ')}`, 'warning');
            return;
        }
        
        showLoading();
        const response = await fetch(`${API_BASE}/assessment/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, level })
        });
        
        const data = await response.json();
        state.assessmentSession = data.assessmentId;
        
        // Start the assessment
        const startResponse = await fetch(`${API_BASE}/assessment/start/${data.assessmentId}`, {
            method: 'POST'
        });
        
        const assessmentData = await startResponse.json();
        
        // For demo purposes, simulate assessment completion
        if (level === 'practitioner') {
            await simulateAssessmentCompletion(data.assessmentId, 85);
        } else {
            showAssessmentModal(assessmentData);
        }
    } catch (error) {
        console.error('Error starting assessment:', error);
        showMessage(error.message || 'Failed to start assessment', 'error');
    } finally {
        hideLoading();
    }
}

// Demo function to simulate assessment completion
async function simulateAssessmentCompletion(assessmentId, score) {
    try {
        showMessage('Simulating assessment completion...', 'info');
        
        const response = await fetch(`${API_BASE}/assessment/complete/${assessmentId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                responses: [], // Mock responses
                finalScore: score
            })
        });
        
        const result = await response.json();
        
        if (result.passed) {
            showMessage(`Congratulations! You passed with ${result.score}%`, 'success');
            // Reload user progress
            await loadUserProgress();
            updateCertificationUI();
        } else {
            showMessage(`Assessment failed. Score: ${result.score}%. Required: ${result.threshold}%`, 'error');
        }
    } catch (error) {
        console.error('Error completing assessment:', error);
        showMessage('Failed to complete assessment', 'error');
    }
}

// Enhanced Module handling
function handleModuleStart(e) {
    const btn = e.target;
    console.log('handleModuleStart called with button:', btn);
    
    if (btn.disabled) {
        console.log('Button is disabled, ignoring click');
        return;
    }
    
    const moduleId = btn.dataset.module || 'foundation';
    const moduleCard = btn.closest('.module-card');
    const moduleTitle = moduleCard.querySelector('h3').textContent;
    
    console.log('Module ID:', moduleId, 'Title:', moduleTitle, 'Button text:', btn.textContent);
    
    if (btn.textContent === 'Start Module') {
        showMessage(`Starting ${moduleTitle}...`, 'info');
        console.log('Starting module:', moduleId);
        // Navigate to actual module content
        startActualModule(moduleId);
    } else if (btn.textContent === 'Review Module') {
        showMessage(`Opening ${moduleTitle} for review...`, 'info');
        // Navigate to module review
        startActualModule(moduleId);
    }
}

function startActualModule(moduleId) {
    console.log('Starting actual module:', moduleId);
    
    // Create module content based on module ID
    const moduleContent = getModuleContent(moduleId);
    
    // Show module in a modal or navigate to dedicated page
    showModuleModal(moduleContent);
}

function getModuleContent(moduleId) {
    const modules = {
        'foundation': {
            title: 'SPARC Foundation Module',
            description: 'Learn the fundamentals of SPARC methodology',
            lessons: [
                {
                    title: 'Introduction to SPARC',
                    content: `
                        <h3>What is SPARC?</h3>
                        <p>SPARC is a structured methodology for software development that emphasizes:</p>
                        <ul>
                            <li><strong>S</strong>pecifications - Clear requirements and problem definition</li>
                            <li><strong>P</strong>seudocode - Step-by-step logical flow before implementation</li>
                            <li><strong>A</strong>rchitecture - System design and component structure</li>
                            <li><strong>R</strong>efinement - Iterative improvement and optimization</li>
                            <li><strong>C</strong>ompletion - Final implementation and validation</li>
                        </ul>
                        <p>This methodology helps developers create more maintainable, scalable, and robust software.</p>
                    `,
                    quiz: {
                        question: 'What does the "S" in SPARC stand for?',
                        options: ['System', 'Specifications', 'Software', 'Structure'],
                        correct: 1
                    }
                },
                {
                    title: 'SPARC Development Process',
                    content: `
                        <h3>The SPARC Development Flow</h3>
                        <p>Follow these steps in your development process:</p>
                        <ol>
                            <li><strong>Specifications</strong>: Define what you want to build</li>
                            <li><strong>Pseudocode</strong>: Plan the logic flow</li>
                            <li><strong>Architecture</strong>: Design the system structure</li>
                            <li><strong>Refinement</strong>: Optimize and improve</li>
                            <li><strong>Completion</strong>: Finalize and validate</li>
                        </ol>
                        <p>Each step builds upon the previous one, ensuring a systematic approach to development.</p>
                    `,
                    quiz: {
                        question: 'Which step comes after Pseudocode in the SPARC process?',
                        options: ['Specifications', 'Architecture', 'Refinement', 'Completion'],
                        correct: 1
                    }
                }
            ]
        },
        'advanced-patterns': {
            title: 'Advanced SPARC Patterns',
            description: 'Learn advanced patterns and real-world applications',
            lessons: [
                {
                    title: 'Complex System Design',
                    content: `
                        <h3>Designing Complex Systems with SPARC</h3>
                        <p>When building complex systems, SPARC helps you:</p>
                        <ul>
                            <li>Break down complex problems into manageable components</li>
                            <li>Design scalable architectures</li>
                            <li>Implement modular solutions</li>
                            <li>Handle cross-cutting concerns</li>
                        </ul>
                    `,
                    quiz: {
                        question: 'What is a key benefit of using SPARC for complex systems?',
                        options: ['Faster coding', 'Breaking down problems', 'Less documentation', 'Automatic testing'],
                        correct: 1
                    }
                }
            ]
        },
        'ai-integration': {
            title: 'AI Integration with SPARC',
            description: 'Integrate AI capabilities using Claude-Flow',
            lessons: [
                {
                    title: 'Swarm Intelligence',
                    content: `
                        <h3>Building AI-Powered Systems</h3>
                        <p>Learn how to integrate AI capabilities into your SPARC workflow:</p>
                        <ul>
                            <li>Swarm intelligence and multi-agent systems</li>
                            <li>Neural memory systems</li>
                            <li>Production deployment strategies</li>
                        </ul>
                    `,
                    quiz: {
                        question: 'What is swarm intelligence?',
                        options: ['Single AI agent', 'Multiple AI agents working together', 'Neural networks', 'Machine learning'],
                        correct: 1
                    }
                }
            ]
        }
    };
    
    return modules[moduleId] || modules['foundation'];
}

function showModuleModal(moduleContent) {
    // Add modal CSS if not already added
    if (!document.querySelector('#module-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'module-modal-styles';
        style.textContent = `
            .module-modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
            }
            .modal-content {
                background-color: white;
                margin: 5% auto;
                padding: 20px;
                border-radius: 10px;
                width: 90%;
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            .close-btn {
                font-size: 24px;
                background: none;
                border: none;
                cursor: pointer;
                color: #999;
            }
            .close-btn:hover {
                color: #333;
            }
            .lesson {
                margin-bottom: 30px;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #f9f9f9;
            }
            .lesson h3 {
                color: #333;
                margin-bottom: 15px;
            }
            .lesson-content {
                margin-bottom: 20px;
            }
            .lesson-quiz {
                border-top: 1px solid #ddd;
                padding-top: 15px;
            }
            .lesson-quiz h4 {
                color: #666;
                margin-bottom: 10px;
            }
            .lesson-quiz label {
                display: block;
                margin: 10px 0;
                cursor: pointer;
            }
            .lesson-quiz input[type="radio"] {
                margin-right: 10px;
            }
            .check-answer {
                background-color: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            }
            .check-answer:hover {
                background-color: #0056b3;
            }
            .module-actions {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
            }
            .complete-module-btn {
                background-color: #28a745;
                color: white;
                border: none;
                padding: 15px 30px;
                font-size: 16px;
                border-radius: 5px;
                cursor: pointer;
            }
            .complete-module-btn:hover {
                background-color: #218838;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'module-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${moduleContent.title}</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p>${moduleContent.description}</p>
                <div class="lessons-container">
                    ${moduleContent.lessons.map((lesson, index) => `
                        <div class="lesson" data-lesson="${index}">
                            <h3>${lesson.title}</h3>
                            <div class="lesson-content">
                                ${lesson.content}
                            </div>
                            <div class="lesson-quiz">
                                <h4>Quiz</h4>
                                <p>${lesson.quiz.question}</p>
                                ${lesson.quiz.options.map((option, optIndex) => `
                                    <label>
                                        <input type="radio" name="quiz_${index}" value="${optIndex}">
                                        ${option}
                                    </label>
                                `).join('')}
                                <button class="check-answer" data-lesson="${index}" data-correct="${lesson.quiz.correct}">Check Answer</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="module-actions">
                    <button class="complete-module-btn" data-module="${moduleContent.title}">Complete Module</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.appendChild(modal);
    
    // Add event listeners
    setupModuleModalEventListeners(modal, moduleContent);
    
    // Show modal
    modal.style.display = 'block';
}

function setupModuleModalEventListeners(modal, moduleContent) {
    // Close modal
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Quiz functionality
    const checkAnswerBtns = modal.querySelectorAll('.check-answer');
    checkAnswerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lessonIndex = e.target.dataset.lesson;
            const correctAnswer = parseInt(e.target.dataset.correct);
            const selectedAnswer = modal.querySelector(`input[name="quiz_${lessonIndex}"]:checked`);
            
            if (!selectedAnswer) {
                alert('Please select an answer');
                return;
            }
            
            const isCorrect = parseInt(selectedAnswer.value) === correctAnswer;
            if (isCorrect) {
                e.target.textContent = 'Correct! ✓';
                e.target.style.backgroundColor = 'green';
                e.target.disabled = true;
            } else {
                e.target.textContent = 'Try again';
                e.target.style.backgroundColor = 'red';
            }
        });
    });
    
    // Complete module
    const completeBtn = modal.querySelector('.complete-module-btn');
    completeBtn.addEventListener('click', async () => {
        // Check if all quizzes are completed
        const allQuizzes = modal.querySelectorAll('.check-answer');
        const completedQuizzes = modal.querySelectorAll('.check-answer:disabled');
        
        if (completedQuizzes.length === allQuizzes.length) {
            // All quizzes completed - actually complete the module
            const moduleTitle = modal.querySelector('[data-module]').dataset.module;
            const moduleId = getModuleIdFromTitle(moduleTitle);
            const score = Math.floor(Math.random() * 20) + 80; // Random score 80-100
            console.log('Completing module:', moduleTitle, '->', moduleId, 'with score:', score);
            
            await completeModule(moduleId, score);
            showMessage(`Module completed with ${score}% score!`, 'success');
            modal.remove();
        } else {
            alert('Please complete all quizzes before finishing the module');
        }
    });
}

function getModuleIdFromTitle(title) {
    if (title.includes('Foundation')) return 'foundation';
    if (title.includes('Advanced')) return 'advanced-patterns';
    if (title.includes('AI Integration')) return 'ai-integration';
    return 'foundation';
}

// Initialize section visibility on load
document.querySelectorAll('section').forEach(section => {
    if (section.id !== 'home') {
        section.classList.add('hidden');
    }
});