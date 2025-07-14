/**
 * SPARC Evolution Platform - Main JavaScript
 * Interactive functionality for the educational platform
 */

// Global state
const state = {
    currentSection: 'home',
    playgroundSession: null,
    assessmentSession: null,
    user: null
};

// API Configuration
const API_BASE = '/api';

// DOM Elements
const elements = {};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
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
    // Don't load examples immediately to prevent loading popup
    // loadExamples();
    
    console.log('Initialization complete');
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
    
    // Certification buttons
    elements.certBtns.forEach(btn => {
        btn.addEventListener('click', () => startAssessment(btn.dataset.level));
    });
    
    // Module buttons
    document.querySelectorAll('.module-btn').forEach(btn => {
        btn.addEventListener('click', handleModuleStart);
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
    // Update active nav link
    elements.navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
    });
    
    // Show/hide sections
    elements.sections.forEach(section => {
        section.classList.toggle('hidden', section.id !== sectionId);
    });
    
    // Update state
    state.currentSection = sectionId;
    window.location.hash = sectionId;
    
    // Initialize section-specific features
    if (sectionId === 'playground' && !state.playgroundSession) {
        initializePlayground();
        // Load examples when playground is accessed
        loadExamples();
    }
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
    if (level !== 'practitioner' && !state.user) {
        showMessage('Please login to access advanced certifications', 'warning');
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/assessment/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: state.user?.id || 'guest_' + Date.now(),
                level
            })
        });
        
        const data = await response.json();
        state.assessmentSession = data.assessmentId;
        
        // Start the assessment
        const startResponse = await fetch(`${API_BASE}/assessment/start/${data.assessmentId}`, {
            method: 'POST'
        });
        
        const assessmentData = await startResponse.json();
        showAssessmentModal(assessmentData);
    } catch (error) {
        console.error('Error starting assessment:', error);
        showMessage('Failed to start assessment', 'error');
    } finally {
        hideLoading();
    }
}

function showAssessmentModal(assessmentData) {
    // In a real implementation, this would show a modal with assessment questions
    showMessage(`Assessment started: ${assessmentData.questions.length} questions, ${assessmentData.practicalTasks.length} practical tasks`, 'info');
}

// Module handling
function handleModuleStart(e) {
    const btn = e.target;
    if (btn.disabled) return;
    
    const moduleCard = btn.closest('.module-card');
    const moduleTitle = moduleCard.querySelector('h3').textContent;
    
    showMessage(`Starting ${moduleTitle}...`, 'info');
    // In a real implementation, this would navigate to the module content
}

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

// Initialize section visibility on load
document.querySelectorAll('section').forEach(section => {
    if (section.id !== 'home') {
        section.classList.add('hidden');
    }
});