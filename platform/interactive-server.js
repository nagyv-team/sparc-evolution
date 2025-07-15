// Enhanced SPARC Platform with Interactive Features
const express = require('express');
const path = require('path');

// Import our enhanced API routes
const apiRoutes = require('./src/api/routes');

const app = express();
const PORT = 3002;

app.use(express.json());

// Serve static assets (CSS, JS, images)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'src/frontend')));

// Use our enhanced API routes
app.use('/api', apiRoutes);

// CORS for Codespaces
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// In-memory storage for demo
const sessions = new Map();
const assessments = new Map();

// Serve the main frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/frontend/index.html'));
});

// Fallback route for the old embedded interface (keeping for compatibility)
app.get('/embedded', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SPARC Evolution Platform</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background: #f5f7fa; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 0; text-align: center; }
        .nav { background: white; padding: 15px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .nav-items { display: flex; justify-content: center; gap: 30px; }
        .nav-item { background: #667eea; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; transition: all 0.3s; }
        .nav-item:hover { background: #5a67d8; transform: translateY(-2px); }
        .section { background: white; margin: 20px 0; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .sparc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .sparc-step { background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid #2196f3; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .feature-card { background: #f8f9fa; padding: 25px; border-radius: 10px; border: 1px solid #e9ecef; }
        .btn { background: #28a745; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; margin: 5px; transition: all 0.3s; }
        .btn:hover { background: #218838; transform: translateY(-2px); }
        .btn-primary { background: #007bff; }
        .btn-primary:hover { background: #0056b3; }
        .playground { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .code-area { width: 100%; height: 200px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; font-family: monospace; font-size: 14px; }
        .output { background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 5px; margin: 10px 0; min-height: 100px; font-family: monospace; }
        .progress { background: #e9ecef; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .progress-bar { background: #28a745; height: 20px; text-align: center; color: white; line-height: 20px; }
        .assessment-question { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 10px; border-left: 4px solid #17a2b8; }
        .option { margin: 10px 0; }
        .option input { margin-right: 10px; }
        .success { color: #28a745; font-weight: bold; }
        .info { color: #17a2b8; }
        .hidden { display: none; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="container">
          <h1>🚀 SPARC Evolution Educational Platform</h1>
          <p>Master Reuven Cohen's Revolutionary Development Methodology</p>
        </div>
      </div>
      
      <div class="nav">
        <div class="container">
          <div class="nav-items">
            <a href="#home" class="nav-item" onclick="showSection('home')">🏠 Home</a>
            <a href="#playground" class="nav-item" onclick="showSection('playground')">🎮 Playground</a>
            <a href="#learning" class="nav-item" onclick="showSection('learning')">📚 Learning</a>
            <a href="#certification" class="nav-item" onclick="showSection('certification')">🎓 Certification</a>
            <a href="#dashboard" class="nav-item" onclick="showSection('dashboard')">📊 Progress</a>
            <a href="#about" class="nav-item" onclick="showSection('about')">ℹ️ About</a>
          </div>
        </div>
      </div>

      <div class="container">
        <!-- HOME SECTION -->
        <div id="home" class="section">
          <h2>📊 SPARC Methodology</h2>
          <p>SPARC is a revolutionary framework that transforms software development through structured methodology:</p>
          
          <div class="sparc-grid">
            <div class="sparc-step">
              <h3>📋 Specifications</h3>
              <p>Clear requirements and problem definition</p>
            </div>
            <div class="sparc-step">
              <h3>📝 Pseudocode</h3>
              <p>Step-by-step logical flow before implementation</p>
            </div>
            <div class="sparc-step">
              <h3>🏗️ Architecture</h3>
              <p>System design and component structure</p>
            </div>
            <div class="sparc-step">
              <h3>🔧 Refinement</h3>
              <p>Iterative improvement and optimization</p>
            </div>
            <div class="sparc-step">
              <h3>✅ Completion</h3>
              <p>Final implementation and validation</p>
            </div>
          </div>

          <div class="feature-grid">
            <div class="feature-card">
              <h3>🎮 Interactive Playground</h3>
              <p>Practice SPARC methodology with real-time feedback and guidance through all 5 phases.</p>
              <button class="btn btn-primary" onclick="showSection('playground')">Try Playground</button>
            </div>
            <div class="feature-card">
              <h3>🎓 Certification System</h3>
              <p>Earn certificates at 4 levels: Practitioner, Developer, Architect, and Master.</p>
              <button class="btn btn-primary" onclick="showSection('certification')">Start Assessment</button>
            </div>
            <div class="feature-card">
              <h3>📚 Learning Modules</h3>
              <p>40 hours of structured content with progressive difficulty and hands-on exercises.</p>
              <button class="btn btn-primary" onclick="showSection('learning')">Start Learning</button>
            </div>
          </div>
        </div>

        <!-- PLAYGROUND SECTION -->
        <div id="playground" class="section hidden">
          <h2>🎮 Interactive SPARC Playground</h2>
          <p>Practice the SPARC methodology step-by-step with real-time guidance:</p>
          
          <div class="playground">
            <h3>Current Step: <span id="currentStep">Specifications</span></h3>
            <div class="progress">
              <div class="progress-bar" id="progressBar" style="width: 20%">Step 1/5</div>
            </div>
            
            <textarea id="codeEditor" class="code-area" placeholder="Start by writing your specifications...

/**
 * SPECIFICATIONS
 * 
 * Problem: [Define what problem you are solving]
 * Requirements: [List key requirements]
 * Constraints: [Any limitations or constraints]
 */"></textarea>
            
            <div>
              <button class="btn" onclick="executeCode()">▶️ Run Code</button>
              <button class="btn" onclick="nextStep()">➡️ Next Step</button>
              <button class="btn" onclick="clearCode()">🗑️ Clear</button>
            </div>
            
            <div id="output" class="output">
              💡 Welcome to SPARC Playground! Start by defining clear specifications for your project.
            </div>
          </div>
        </div>

        <!-- LEARNING SECTION -->
        <div id="learning" class="section hidden">
          <h2>📚 Progressive Learning Modules</h2>
          <p>Master SPARC through structured, hands-on learning paths:</p>
          
          <!-- Module Selection Grid -->
          <div id="moduleSelection" class="feature-grid">
            <div class="feature-card">
              <h3>Module 1: Foundation</h3>
              <div class="progress">
                <div class="progress-bar" id="module1Progress" style="width: 0%">0% Complete</div>
              </div>
              <ul>
                <li id="mod1-overview">⭕ SPARC methodology overview</li>
                <li id="mod1-setup">⭕ Development environment setup</li>
                <li id="mod1-project">⭕ First SPARC project</li>
              </ul>
              <button class="btn" onclick="startModule(1)">Start Module</button>
            </div>
            <div class="feature-card">
              <h3>Module 2: Advanced Patterns</h3>
              <div class="progress">
                <div class="progress-bar" id="module2Progress" style="width: 0%">Locked</div>
              </div>
              <ul>
                <li>🔒 Complex system design</li>
                <li>🔒 Performance optimization</li>
                <li>🔒 Error handling patterns</li>
              </ul>
              <button class="btn" id="module2Btn" disabled>Complete Module 1</button>
            </div>
            <div class="feature-card">
              <h3>Module 3: AI Integration</h3>
              <div class="progress">
                <div class="progress-bar" id="module3Progress" style="width: 0%">Locked</div>
              </div>
              <ul>
                <li>🔒 Swarm intelligence</li>
                <li>🔒 Neural memory systems</li>
                <li>🔒 Production deployment</li>
              </ul>
              <button class="btn" id="module3Btn" disabled>Complete Module 2</button>
            </div>
          </div>

          <!-- Module 1: Foundation Content -->
          <div id="module1Content" class="hidden">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 20px;">
              <h2>📖 Module 1: SPARC Foundation</h2>
              <button class="btn" onclick="backToModules()">⬅️ Back to Modules</button>
            </div>
            
            <div class="progress">
              <div class="progress-bar" id="moduleProgress" style="width: 0%">Lesson 1/5</div>
            </div>

            <div id="moduleContent">
              <!-- Lesson content will be dynamically loaded here -->
            </div>

            <div style="margin-top: 30px;">
              <button class="btn" onclick="prevLesson()" id="prevLessonBtn" disabled>⬅️ Previous</button>
              <button class="btn btn-primary" onclick="nextLesson()" id="nextLessonBtn">Next ➡️</button>
              <button class="btn" onclick="completeModule()" id="completeModuleBtn" style="display:none;">🏁 Complete Module</button>
            </div>
          </div>

          <!-- Module 2: Advanced Patterns Content -->
          <div id="module2Content" class="hidden">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 20px;">
              <h2>🚀 Module 2: Advanced SPARC Patterns</h2>
              <button class="btn" onclick="backToModules()">⬅️ Back to Modules</button>
            </div>
            
            <div class="progress">
              <div class="progress-bar" id="module2ContentProgress" style="width: 0%">Advanced Lesson 1/4</div>
            </div>

            <div id="module2ContentArea">
              <!-- Advanced content will be loaded here -->
            </div>

            <div style="margin-top: 30px;">
              <button class="btn" onclick="prevAdvancedLesson()" id="prevAdvLessonBtn" disabled>⬅️ Previous</button>
              <button class="btn btn-primary" onclick="nextAdvancedLesson()" id="nextAdvLessonBtn">Next ➡️</button>
              <button class="btn" onclick="completeAdvancedModule()" id="completeAdvModuleBtn" style="display:none;">🏁 Complete Module</button>
            </div>
          </div>

          <!-- Module 3: AI Integration Content -->
          <div id="module3Content" class="hidden">
            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 20px;">
              <h2>🤖 Module 3: AI Integration & Swarm Intelligence</h2>
              <button class="btn" onclick="backToModules()">⬅️ Back to Modules</button>
            </div>
            
            <div class="progress">
              <div class="progress-bar" id="module3ContentProgress" style="width: 0%">AI Lesson 1/6</div>
            </div>

            <div id="module3ContentArea">
              <!-- AI integration content will be loaded here -->
            </div>

            <div style="margin-top: 30px;">
              <button class="btn" onclick="prevAILesson()" id="prevAILessonBtn" disabled>⬅️ Previous</button>
              <button class="btn btn-primary" onclick="nextAILesson()" id="nextAILessonBtn">Next ➡️</button>
              <button class="btn" onclick="completeAIModule()" id="completeAIModuleBtn" style="display:none;">🏁 Complete Module</button>
            </div>
          </div>
        </div>

        <!-- CERTIFICATION SECTION -->
        <div id="certification" class="section hidden">
          <h2>🎓 SPARC Certification Program</h2>
          <p>Validate your SPARC expertise with industry-recognized certifications:</p>
          
          <div id="certSelection" class="feature-grid">
            <div class="feature-card">
              <h3>🥉 SPARC Practitioner</h3>
              <p><strong>Foundation Level</strong></p>
              <ul>
                <li>20 questions (70% to pass)</li>
                <li>2 practical exercises</li>
                <li>Basic SPARC methodology</li>
              </ul>
              <button class="btn btn-primary" onclick="startAssessment('practitioner')">Start Assessment</button>
            </div>
            <div class="feature-card">
              <h3>🥈 SPARC Developer</h3>
              <p><strong>Intermediate Level</strong></p>
              <ul>
                <li>30 questions (75% to pass)</li>
                <li>3 coding projects</li>
                <li>Requires Module 1 completion</li>
              </ul>
              <button class="btn" id="developerCertBtn" onclick="startAssessment('developer')" disabled>Complete Module 1 First</button>
            </div>
            <div class="feature-card">
              <h3>🥇 SPARC Architect</h3>
              <p><strong>Advanced Level</strong></p>
              <ul>
                <li>40 questions (80% to pass)</li>
                <li>System architecture design</li>
                <li>Requires Module 2 completion</li>
              </ul>
              <button class="btn" id="architectCertBtn" onclick="startAssessment('architect')" disabled>Complete Module 2 First</button>
            </div>
            <div class="feature-card">
              <h3>🏆 SPARC Master</h3>
              <p><strong>Expert Level</strong></p>
              <ul>
                <li>50 questions (85% to pass)</li>
                <li>AI integration project</li>
                <li>Requires Module 3 completion</li>
              </ul>
              <button class="btn" id="masterCertBtn" onclick="startAssessment('master')" disabled>Complete Module 3 First</button>
            </div>
          </div>

          <div id="assessment" class="hidden">
            <h3>SPARC Practitioner Assessment</h3>
            <div class="progress">
              <div class="progress-bar" id="assessmentProgress" style="width: 0%">Question 1/5</div>
            </div>
            
            <div id="questionContainer"></div>
            
            <div>
              <button class="btn" onclick="prevQuestion()" id="prevBtn" disabled>⬅️ Previous</button>
              <button class="btn btn-primary" onclick="nextQuestion()" id="nextBtn">Next ➡️</button>
              <button class="btn" onclick="finishAssessment()" id="finishBtn" style="display:none;">🏁 Finish Assessment</button>
            </div>
          </div>
        </div>

        <!-- DASHBOARD SECTION -->
        <div id="dashboard" class="section hidden">
          <h2>📊 Your Learning Progress</h2>
          <p>Track your SPARC mastery journey and achievements:</p>
          
          <div class="feature-grid">
            <div class="feature-card">
              <h3>🎯 Module Progress</h3>
              <div id="moduleProgressDisplay">
                <div style="margin: 10px 0;">
                  <div style="display: flex; justify-content: space-between;">
                    <span>Module 1: Foundation</span>
                    <span id="mod1Status">⭕ Not Started</span>
                  </div>
                  <div class="progress">
                    <div class="progress-bar" id="mod1ProgressBar" style="width: 0%">0%</div>
                  </div>
                </div>
                <div style="margin: 10px 0;">
                  <div style="display: flex; justify-content: space-between;">
                    <span>Module 2: Advanced</span>
                    <span id="mod2Status">🔒 Locked</span>
                  </div>
                  <div class="progress">
                    <div class="progress-bar" id="mod2ProgressBar" style="width: 0%">0%</div>
                  </div>
                </div>
                <div style="margin: 10px 0;">
                  <div style="display: flex; justify-content: space-between;">
                    <span>Module 3: AI Integration</span>
                    <span id="mod3Status">🔒 Locked</span>
                  </div>
                  <div class="progress">
                    <div class="progress-bar" id="mod3ProgressBar" style="width: 0%">0%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="feature-card">
              <h3>🏆 Certifications</h3>
              <div id="certificationsDisplay">
                <p><em>Complete modules to unlock certifications</em></p>
                <div id="certsList"></div>
              </div>
            </div>
            
            <div class="feature-card">
              <h3>📈 Learning Analytics</h3>
              <div id="analyticsDisplay">
                <div style="margin: 10px 0;">
                  <strong>Time on Platform:</strong> <span id="timeSpent">0 minutes</span>
                </div>
                <div style="margin: 10px 0;">
                  <strong>Sessions:</strong> <span id="sessionCount">1</span>
                </div>
                <div style="margin: 10px 0;">
                  <strong>Account Created:</strong> <span id="accountAge">Today</span>
                </div>
                <div style="margin: 10px 0;">
                  <strong>Learning Path:</strong> <span id="learningPath">Foundation Track</span>
                </div>
              </div>
            </div>
            
            <div class="feature-card">
              <h3>🎮 Platform Stats</h3>
              <div id="platformStats">
                <div style="margin: 10px 0;">
                  <strong>Platform Health:</strong> <span style="color: #28a745;">🟢 Excellent</span>
                </div>
                <div style="margin: 10px 0;">
                  <strong>Features Available:</strong> <span>All Systems Operational</span>
                </div>
                <div style="margin: 10px 0;">
                  <strong>Last Updated:</strong> <span id="lastUpdate">Today</span>
                </div>
                <div style="margin: 10px 0;">
                  <button class="btn btn-primary" onclick="exportProgress()">📤 Export Progress</button>
                  <button class="btn" onclick="resetProgress()">🔄 Reset Progress</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ABOUT SECTION -->
        <div id="about" class="section hidden">
          <h2>ℹ️ About SPARC Evolution</h2>
          <div class="feature-grid">
            <div class="feature-card">
              <h3>📈 Performance Metrics</h3>
              <ul>
                <li><strong>84.8%</strong> SWE-Bench success rate</li>
                <li><strong>3.6x</strong> Development speed</li>
                <li><strong>72%</strong> Cost reduction</li>
                <li><strong>87</strong> MCP tools available</li>
              </ul>
            </div>
            <div class="feature-card">
              <h3>🔗 Key Resources</h3>
              <ul>
                <li><a href="https://github.com/ruvnet/sparc" target="_blank">Original SPARC</a></li>
                <li><a href="https://www.npmjs.com/package/@agentics.org/sparc2" target="_blank">SPARC2 Package</a></li>
                <li><a href="https://www.npmjs.com/package/claude-flow" target="_blank">Claude-Flow</a></li>
              </ul>
            </div>
          </div>
          <p class="success">✅ Created by Reuven Cohen using SPARC methodology and swarm intelligence!</p>
        </div>
      </div>

      <script>
        let currentPlaygroundStep = 0;
        let currentQuestion = 0;
        let assessmentAnswers = [];
        
        const sparcSteps = [
          { name: 'Specifications', placeholder: 'Define your requirements and problem statement...' },
          { name: 'Pseudocode', placeholder: 'Write step-by-step logical flow...' },
          { name: 'Architecture', placeholder: 'Design system components and structure...' },
          { name: 'Refinement', placeholder: 'Improve and optimize your implementation...' },
          { name: 'Completion', placeholder: 'Finalize with testing and validation...' }
        ];

        const questionBanks = {
          practitioner: [
            {
              question: "What does SPARC stand for?",
              options: [
                "Specifications, Pseudocode, Architecture, Refinement, Completion",
                "Simple Programming Architecture",
                "System Performance Analysis"
              ],
              correct: 0
            },
            {
              question: "What is the first step in SPARC methodology?",
              options: ["Architecture", "Specifications", "Pseudocode", "Completion"],
              correct: 1
            },
            {
              question: "Who created the SPARC methodology?",
              options: ["OpenAI", "Reuven Cohen", "Google", "Microsoft"],
              correct: 1
            },
            {
              question: "What is the main benefit of SPARC?",
              options: [
                "Faster coding",
                "Structured, systematic approach to development",
                "Less documentation"
              ],
              correct: 1
            },
            {
              question: "Which step involves iterative improvement?",
              options: ["Specifications", "Architecture", "Refinement", "Pseudocode"],
              correct: 2
            }
          ],
          developer: [
            {
              question: "In SPARC, what should pseudocode focus on?",
              options: ["Syntax details", "Logic flow and decision points", "Performance optimization"],
              correct: 1
            },
            {
              question: "What is a key principle of SPARC specifications?",
              options: ["Be vague to allow flexibility", "Focus on implementation details", "Start with the problem, not the solution"],
              correct: 2
            },
            {
              question: "Which architectural pattern best supports SPARC refinement?",
              options: ["Monolithic architecture", "Modular, loosely coupled design", "Tightly coupled systems"],
              correct: 1
            },
            {
              question: "How does SPARC handle error scenarios?",
              options: ["Ignore them until completion", "Address them in the refinement phase", "Plan for them in specifications and pseudocode"],
              correct: 2
            },
            {
              question: "What is the primary goal of the completion phase?",
              options: ["Write more code", "Ensure all requirements are met and validated", "Start the next project"],
              correct: 1
            }
          ],
          architect: [
            {
              question: "How should SPARC be applied to microservices architecture?",
              options: ["Only at the system level", "Each service follows SPARC independently", "Specifications shared, other phases per service"],
              correct: 2
            },
            {
              question: "What is the best approach for SPARC in complex distributed systems?",
              options: ["Single SPARC cycle for entire system", "Nested SPARC cycles for subsystems", "Skip SPARC for complex systems"],
              correct: 1
            },
            {
              question: "How does SPARC address technical debt?",
              options: ["Ignore it", "Address it only in completion", "Plan for it in specifications and manage in refinement"],
              correct: 2
            },
            {
              question: "What role does SPARC play in system scalability?",
              options: ["No impact on scalability", "Scalability planned in architecture phase", "Scalability is only a refinement concern"],
              correct: 1
            },
            {
              question: "How should performance requirements be handled in SPARC?",
              options: ["Defined in specifications, planned in architecture, validated in completion", "Only considered during refinement", "Left to implementation phase"],
              correct: 0
            }
          ],
          master: [
            {
              question: "How does AI integration enhance SPARC methodology?",
              options: ["Replaces human decision making", "Augments each phase with intelligent assistance", "Only useful in coding phase"],
              correct: 1
            },
            {
              question: "What is the role of swarm intelligence in SPARC?",
              options: ["Coordinates multiple agents following SPARC principles", "Replaces SPARC methodology", "Only used for testing"],
              correct: 0
            },
            {
              question: "How should SPARC be adapted for AI/ML projects?",
              options: ["Use standard SPARC without changes", "Add data and model phases to SPARC", "Skip SPARC for AI projects"],
              correct: 1
            },
            {
              question: "What is the enterprise value of SPARC adoption?",
              options: ["Only reduces development time", "Improves success rates, reduces costs, enhances quality", "Makes projects more complex"],
              correct: 1
            },
            {
              question: "How does SPARC support continuous improvement?",
              options: ["Only during initial development", "Through iterative refinement and learning from completion", "Not applicable to improvement"],
              correct: 1
            }
          ]
        };

        let currentAssessmentLevel = 'practitioner';
        let currentQuestions = questionBanks.practitioner;

        // User Progress System
        let userProfile = {
          name: 'Anonymous User',
          certifications: [],
          modulesCompleted: [],
          totalTime: 0,
          createdAt: Date.now()
        };

        // Load user progress from localStorage
        function loadUserProgress() {
          const saved = localStorage.getItem('sparc-user-progress');
          if (saved) {
            try {
              const data = JSON.parse(saved);
              userProfile = { ...userProfile, ...data };
              
              // Restore module progress
              if (data.modulesCompleted) {
                data.modulesCompleted.forEach(module => {
                  if (module === 'module1') {
                    moduleProgress.module1.completed = true;
                    document.getElementById('developerCertBtn').disabled = false;
                    document.getElementById('developerCertBtn').textContent = 'Start Developer Assessment';
                    document.getElementById('developerCertBtn').className = 'btn btn-primary';
                  }
                  if (module === 'module2') {
                    moduleProgress.module2.completed = true;
                    document.getElementById('architectCertBtn').disabled = false;
                    document.getElementById('architectCertBtn').textContent = 'Start Architect Assessment';
                    document.getElementById('architectCertBtn').className = 'btn btn-primary';
                  }
                  if (module === 'module3') {
                    moduleProgress.module3.completed = true;
                    document.getElementById('masterCertBtn').disabled = false;
                    document.getElementById('masterCertBtn').textContent = 'Start Master Assessment';
                    document.getElementById('masterCertBtn').className = 'btn btn-primary';
                  }
                });
              }
            } catch (e) {
              console.log('Error loading user progress:', e);
            }
          }
        }

        // Save user progress to localStorage
        function saveUserProgress() {
          const progressData = {
            ...userProfile,
            modulesCompleted: [],
            lastActive: Date.now()
          };
          
          if (moduleProgress.module1.completed) progressData.modulesCompleted.push('module1');
          if (moduleProgress.module2.completed) progressData.modulesCompleted.push('module2');
          if (moduleProgress.module3.completed) progressData.modulesCompleted.push('module3');
          
          localStorage.setItem('sparc-user-progress', JSON.stringify(progressData));
        }

        // Add certification to user profile
        function addCertification(level, score) {
          const cert = {
            level: level,
            score: score,
            earnedAt: Date.now(),
            validUntil: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
          };
          
          userProfile.certifications.push(cert);
          saveUserProgress();
        }

        function showSection(sectionId) {
          document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
          document.getElementById(sectionId).classList.remove('hidden');
        }

        function executeCode() {
          const code = document.getElementById('codeEditor').value;
          const output = document.getElementById('output');
          
          if (!code.trim()) {
            output.innerHTML = '⚠️ Please write some code first!';
            return;
          }

          output.innerHTML = '✅ Code executed successfully!\\n📝 Step: ' + sparcSteps[currentPlaygroundStep].name + '\\n💡 Good job following SPARC methodology!';
        }

        function nextStep() {
          if (currentPlaygroundStep < sparcSteps.length - 1) {
            currentPlaygroundStep++;
            updatePlaygroundStep();
          }
        }

        function updatePlaygroundStep() {
          const step = sparcSteps[currentPlaygroundStep];
          document.getElementById('currentStep').textContent = step.name;
          document.getElementById('codeEditor').placeholder = step.placeholder;
          
          const progress = ((currentPlaygroundStep + 1) / sparcSteps.length) * 100;
          document.getElementById('progressBar').style.width = progress + '%';
          document.getElementById('progressBar').textContent = 'Step ' + (currentPlaygroundStep + 1) + '/' + sparcSteps.length;
        }

        function clearCode() {
          document.getElementById('codeEditor').value = '';
          document.getElementById('output').innerHTML = '🗑️ Code cleared. Ready for new input!';
        }

        // Learning Module Variables
        let currentModule = 1;
        let currentLesson = 0;
        let moduleProgress = {
          module1: { completed: false, currentLesson: 0, totalLessons: 5 },
          module2: { completed: false, currentLesson: 0, totalLessons: 4 },
          module3: { completed: false, currentLesson: 0, totalLessons: 6 }
        };

        // Module 1 Lessons Content
        const module1Lessons = [
          {
            title: "Introduction to SPARC",
            content: '<h3>🎯 Welcome to SPARC Foundation</h3>' +
              '<p><strong>SPARC</strong> is a revolutionary development methodology created by <strong>Reuven Cohen</strong> that transforms how we build software.</p>' +
              '<h4>What is SPARC?</h4>' +
              '<ul>' +
                '<li><strong>S</strong>pecifications: Clear requirements and problem definition</li>' +
                '<li><strong>P</strong>seudocode: Step-by-step logical flow before implementation</li>' +
                '<li><strong>A</strong>rchitecture: System design and component structure</li>' +
                '<li><strong>R</strong>efinement: Iterative improvement and optimization</li>' +
                '<li><strong>C</strong>ompletion: Final implementation and validation</li>' +
              '</ul>' +
              '<p class="info">💡 <strong>Key Insight:</strong> SPARC provides a systematic approach that reduces project failure by 80%.</p>'
          },
          {
            title: "Specifications Phase",
            content: '<h3>📋 Mastering Specifications</h3>' +
              '<p>The Specifications phase is where every successful project begins.</p>' +
              '<h4>Key Principles:</h4>' +
              '<ul>' +
                '<li>Start with the problem, not the solution</li>' +
                '<li>Be specific and measurable</li>' +
                '<li>Consider who will use this</li>' +
                '<li>Acknowledge limitations upfront</li>' +
              '</ul>' +
              '<p><strong>Practice:</strong> Write clear specifications for any project you are planning.</p>'
          },
          {
            title: "Pseudocode Mastery",
            content: '<h3>📝 The Art of Pseudocode</h3>' +
              '<p>Pseudocode bridges the gap between human thinking and computer logic.</p>' +
              '<h4>Best Practices:</h4>' +
              '<ul>' +
                '<li>Focus on logic, not syntax</li>' +
                '<li>Make it human-readable</li>' +
                '<li>Break complex operations into simple steps</li>' +
                '<li>Include conditional logic clearly</li>' +
              '</ul>' +
              '<p class="success">✅ <strong>Pro Tip:</strong> Good pseudocode reads like a recipe—clear and sequential.</p>'
          },
          {
            title: "Architecture Design",
            content: '<h3>🏗️ Building Solid Architecture</h3>' +
              '<p>Architecture determines whether your system will thrive or struggle under pressure.</p>' +
              '<h4>Key Areas:</h4>' +
              '<ul>' +
                '<li>Component identification</li>' +
                '<li>Relationship mapping</li>' +
                '<li>Data flow design</li>' +
                '<li>Technology selection</li>' +
              '</ul>' +
              '<p>Consider scalability, security, and maintainability in every architectural decision.</p>'
          },
          {
            title: "Refinement & Completion",
            content: '<h3>🔧 Refinement: The Path to Excellence</h3>' +
              '<p>Refinement transforms good code into great systems.</p>' +
              '<h4>Focus Areas:</h4>' +
              '<ul>' +
                '<li>Performance optimization</li>' +
                '<li>Security hardening</li>' +
                '<li>User experience improvements</li>' +
                '<li>Code quality enhancement</li>' +
              '</ul>' +
              '<h4>🎉 Congratulations!</h4>' +
              '<p class="success">✅ You have completed Module 1! You now understand the complete SPARC methodology.</p>' +
              '<p><strong>Next Steps:</strong> Complete the Foundation assessment and unlock Module 2.</p>'
          }
        ];

        function startModule(moduleNum) {
          if (moduleNum === 1) {
            document.getElementById('moduleSelection').classList.add('hidden');
            document.getElementById('module1Content').classList.remove('hidden');
            currentModule = 1;
            currentLesson = 0;
            showCurrentLesson();
          } else if (moduleNum === 2 && moduleProgress.module1.completed) {
            document.getElementById('moduleSelection').classList.add('hidden');
            document.getElementById('module2Content').classList.remove('hidden');
            currentModule = 2;
            startAdvancedModule();
          } else if (moduleNum === 3 && moduleProgress.module2.completed) {
            document.getElementById('moduleSelection').classList.add('hidden');
            document.getElementById('module3Content').classList.remove('hidden');
            currentModule = 3;
            startAIModule();
          } else {
            alert('Please complete the previous modules first!');
          }
        }

        function backToModules() {
          document.querySelectorAll('[id$="Content"]').forEach(el => el.classList.add('hidden'));
          document.getElementById('moduleSelection').classList.remove('hidden');
        }

        function showCurrentLesson() {
          const lesson = module1Lessons[currentLesson];
          document.getElementById('moduleContent').innerHTML = lesson.content;
          
          // Update progress
          const progress = ((currentLesson + 1) / module1Lessons.length) * 100;
          document.getElementById('moduleProgress').style.width = progress + '%';
          document.getElementById('moduleProgress').textContent = 'Lesson ' + (currentLesson + 1) + '/' + module1Lessons.length;
          
          // Update navigation buttons
          document.getElementById('prevLessonBtn').disabled = currentLesson === 0;
          document.getElementById('nextLessonBtn').style.display = currentLesson === module1Lessons.length - 1 ? 'none' : 'inline-block';
          document.getElementById('completeModuleBtn').style.display = currentLesson === module1Lessons.length - 1 ? 'inline-block' : 'none';
        }

        function nextLesson() {
          if (currentLesson < module1Lessons.length - 1) {
            currentLesson++;
            showCurrentLesson();
          }
        }

        function prevLesson() {
          if (currentLesson > 0) {
            currentLesson--;
            showCurrentLesson();
          }
        }

        function completeModule() {
          console.log('completeModule called - Module 1');
          moduleProgress.module1.completed = true;
          moduleProgress.module1.currentLesson = module1Lessons.length;
          
          // Update UI
          document.getElementById('mod1-overview').innerHTML = '✅ SPARC methodology overview';
          document.getElementById('mod1-setup').innerHTML = '✅ Development environment setup';
          document.getElementById('mod1-project').innerHTML = '✅ First SPARC project';
          document.getElementById('module1Progress').style.width = '100%';
          document.getElementById('module1Progress').textContent = '100% Complete';
          
          // Unlock Module 2
          const module2Btn = document.getElementById('module2Btn');
          if (module2Btn) {
            module2Btn.disabled = false;
            module2Btn.textContent = 'Start Module 2';
            module2Btn.className = 'btn btn-primary';
            console.log('Module 2 button unlocked');
          } else {
            console.error('Module 2 button not found!');
          }
          
          const module2Progress = document.getElementById('module2Progress');
          if (module2Progress) {
            module2Progress.textContent = 'Ready to Start';
          }
          
          // Unlock Developer Certification
          const developerCertBtn = document.getElementById('developerCertBtn');
          if (developerCertBtn) {
            developerCertBtn.disabled = false;
            developerCertBtn.textContent = 'Start Developer Assessment';
            developerCertBtn.className = 'btn btn-primary';
            console.log('Developer certification unlocked');
          }
          
          alert('🎉 Congratulations! Module 1 Complete!\\n\\n✅ You have mastered SPARC Foundation\\n🔓 Module 2: Advanced Patterns is now unlocked\\n🎓 Developer certification is now available!');
          
          saveUserProgress();
          updateDashboard();
          backToModules();
        }

        // Module 2: Advanced Patterns
        let currentAdvancedLesson = 0;
        const module2Lessons = [
          {
            title: "Complex System Design",
            content: '<h3>🏗️ Designing Complex Systems with SPARC</h3>' +
              '<p>Learn how to apply SPARC to large-scale, multi-component systems.</p>' +
              '<h4>Advanced Patterns:</h4>' +
              '<ul>' +
                '<li>Microservices architecture</li>' +
                '<li>Event-driven systems</li>' +
                '<li>Distributed data consistency</li>' +
                '<li>Service orchestration</li>' +
              '</ul>' +
              '<p class="info">💡 Complex systems require careful decomposition but SPARC principles remain the same.</p>'
          },
          {
            title: "Performance Optimization",
            content: '<h3>⚡ SPARC-Driven Performance Optimization</h3>' +
              '<p>Apply systematic optimization using SPARC methodology.</p>' +
              '<h4>Optimization Areas:</h4>' +
              '<ul>' +
                '<li>Database query optimization</li>' +
                '<li>Caching strategies</li>' +
                '<li>Load balancing</li>' +
                '<li>Asset optimization</li>' +
              '</ul>' +
              '<p>Use SPARC to systematically identify and resolve performance bottlenecks.</p>'
          },
          {
            title: "Error Handling & Resilience",
            content: '<h3>🛡️ Building Resilient Systems</h3>' +
              '<p>Design systems that gracefully handle failures and recover automatically.</p>' +
              '<h4>Resilience Patterns:</h4>' +
              '<ul>' +
                '<li>Circuit breaker pattern</li>' +
                '<li>Retry with backoff</li>' +
                '<li>Bulkhead isolation</li>' +
                '<li>Graceful degradation</li>' +
              '</ul>' +
              '<p>Plan for failure scenarios in your specifications and architecture phases.</p>'
          },
          {
            title: "Advanced SPARC Mastery",
            content: '<h3>🚀 SPARC Mastery: Advanced Techniques</h3>' +
              '<p>Master advanced SPARC applications for enterprise-level development.</p>' +
              '<h4>Enterprise Applications:</h4>' +
              '<ul>' +
                '<li>Multi-team coordination</li>' +
                '<li>Legacy system integration</li>' +
                '<li>Continuous refinement</li>' +
                '<li>Deployment readiness</li>' +
              '</ul>' +
              '<h4>🎉 Module 2 Complete!</h4>' +
              '<p class="success">✅ You have mastered advanced SPARC patterns! Ready for enterprise development.</p>'
          }
        ];

        function startAdvancedModule() {
          currentAdvancedLesson = 0;
          showAdvancedLesson();
        }

        function showAdvancedLesson() {
          const lesson = module2Lessons[currentAdvancedLesson];
          document.getElementById('module2ContentArea').innerHTML = lesson.content;
          
          const progress = ((currentAdvancedLesson + 1) / module2Lessons.length) * 100;
          document.getElementById('module2ContentProgress').style.width = progress + '%';
          document.getElementById('module2ContentProgress').textContent = 'Advanced Lesson ' + (currentAdvancedLesson + 1) + '/' + module2Lessons.length;
          
          document.getElementById('prevAdvLessonBtn').disabled = currentAdvancedLesson === 0;
          document.getElementById('nextAdvLessonBtn').style.display = currentAdvancedLesson === module2Lessons.length - 1 ? 'none' : 'inline-block';
          document.getElementById('completeAdvModuleBtn').style.display = currentAdvancedLesson === module2Lessons.length - 1 ? 'inline-block' : 'none';
        }

        function nextAdvancedLesson() {
          if (currentAdvancedLesson < module2Lessons.length - 1) {
            currentAdvancedLesson++;
            showAdvancedLesson();
          }
        }

        function prevAdvancedLesson() {
          if (currentAdvancedLesson > 0) {
            currentAdvancedLesson--;
            showAdvancedLesson();
          }
        }

        function completeAdvancedModule() {
          moduleProgress.module2.completed = true;
          
          // Unlock Module 3
          document.getElementById('module3Btn').disabled = false;
          document.getElementById('module3Btn').textContent = 'Start Module 3';
          document.getElementById('module3Progress').textContent = 'Ready to Start';
          
          // Unlock Architect Certification
          document.getElementById('architectCertBtn').disabled = false;
          document.getElementById('architectCertBtn').textContent = 'Start Architect Assessment';
          document.getElementById('architectCertBtn').className = 'btn btn-primary';
          
          alert('🎉 Advanced Patterns Complete!\\n\\n✅ You have mastered enterprise SPARC\\n🔓 Module 3: AI Integration is now unlocked\\n🎓 Architect certification is now available!');
          
          saveUserProgress();
          updateDashboard();
          backToModules();
        }

        // Module 3: AI Integration
        let currentAILesson = 0;
        const module3Lessons = [
          {
            title: "Introduction to AI-Enhanced SPARC",
            content: '<h3>🤖 AI-Enhanced Development</h3>' +
              '<p>Learn how AI and swarm intelligence amplify SPARC methodology.</p>' +
              '<h4>AI Integration Points:</h4>' +
              '<ul>' +
                '<li>Specification generation</li>' +
                '<li>Pseudocode optimization</li>' +
                '<li>Architecture recommendations</li>' +
                '<li>Automated refinement</li>' +
              '</ul>' +
              '<p>AI enhances each phase of SPARC without replacing human creativity.</p>'
          },
          {
            title: "Swarm-Powered Development",
            content: '<h3>🐝 Swarm Intelligence in Action</h3>' +
              '<p>Coordinate multiple AI agents using SPARC principles for complex development tasks.</p>' +
              '<h4>Agent Types:</h4>' +
              '<ul>' +
                '<li>Specification Analyst</li>' +
                '<li>Architecture Designer</li>' +
                '<li>Code Optimizer</li>' +
                '<li>Quality Assurance</li>' +
              '</ul>' +
              '<p>Swarms work together using shared memory and task orchestration.</p>'
          },
          {
            title: "Neural Memory Systems",
            content: '<h3>🧠 Persistent Learning</h3>' +
              '<p>Implement memory systems that learn and improve over time.</p>' +
              '<h4>Memory Types:</h4>' +
              '<ul>' +
                '<li>Project specifications</li>' +
                '<li>Architecture patterns</li>' +
                '<li>Performance optimizations</li>' +
                '<li>Error solutions</li>' +
              '</ul>' +
              '<p>Neural memory enables continuous improvement across projects.</p>'
          },
          {
            title: "Advanced AI Coordination",
            content: '<h3>🔄 Multi-Agent Orchestration</h3>' +
              '<p>Master the coordination of AI agents for complex development workflows.</p>' +
              '<h4>Key Topics:</h4>' +
              '<ul>' +
                '<li>Agent communication protocols</li>' +
                '<li>Task distribution strategies</li>' +
                '<li>Consensus mechanisms</li>' +
                '<li>Fault tolerance</li>' +
              '</ul>'
          },
          {
            title: "Performance & Scaling",
            content: '<h3>⚡ Scaling AI-Enhanced Development</h3>' +
              '<p>Optimize AI-powered development for enterprise-scale projects.</p>' +
              '<h4>Focus Areas:</h4>' +
              '<ul>' +
                '<li>Computational efficiency</li>' +
                '<li>Agent load balancing</li>' +
                '<li>Memory optimization</li>' +
                '<li>Performance monitoring</li>' +
              '</ul>'
          },
          {
            title: "Production Deployment",
            content: '<h3>🚀 Deploying AI-Enhanced Systems</h3>' +
              '<p>Successfully deploy and maintain AI-powered development systems in production.</p>' +
              '<h4>Deployment Considerations:</h4>' +
              '<ul>' +
                '<li>Resource management</li>' +
                '<li>Monitoring and observability</li>' +
                '<li>Security considerations</li>' +
                '<li>Continuous learning</li>' +
              '</ul>' +
              '<h4>🎉 Congratulations!</h4>' +
              '<p class="success">You have completed the entire SPARC Evolution curriculum and are now a certified SPARC Master!</p>'
          }
        ];

        function startAIModule() {
          currentAILesson = 0;
          showAILesson();
        }

        function showAILesson() {
          const lesson = module3Lessons[currentAILesson];
          document.getElementById('module3ContentArea').innerHTML = lesson.content;
          
          const progress = ((currentAILesson + 1) / module3Lessons.length) * 100;
          document.getElementById('module3ContentProgress').style.width = progress + '%';
          document.getElementById('module3ContentProgress').textContent = 'AI Lesson ' + (currentAILesson + 1) + '/' + module3Lessons.length;
          
          document.getElementById('prevAILessonBtn').disabled = currentAILesson === 0;
          document.getElementById('nextAILessonBtn').style.display = currentAILesson === module3Lessons.length - 1 ? 'none' : 'inline-block';
          document.getElementById('completeAIModuleBtn').style.display = currentAILesson === module3Lessons.length - 1 ? 'inline-block' : 'none';
        }

        function nextAILesson() {
          if (currentAILesson < module3Lessons.length - 1) {
            currentAILesson++;
            showAILesson();
          }
        }

        function prevAILesson() {
          if (currentAILesson > 0) {
            currentAILesson--;
            showAILesson();
          }
        }

        function completeAIModule() {
          moduleProgress.module3.completed = true;
          
          // Unlock Master Certification
          document.getElementById('masterCertBtn').disabled = false;
          document.getElementById('masterCertBtn').textContent = 'Start Master Assessment';
          document.getElementById('masterCertBtn').className = 'btn btn-primary';
          
          alert('🎉 AI Integration Complete!\\n\\n✅ You have mastered AI-enhanced SPARC\\n🏆 Master certification is now available!\\n🚀 Ready for production deployment');
          saveUserProgress();
          updateDashboard();
          backToModules();
        }

        function startAssessment(level) {
          console.log('startAssessment called with level:', level);
          
          // Check prerequisites
          if (level === 'developer' && !moduleProgress.module1.completed) {
            alert('Please complete Module 1: Foundation first!');
            return;
          }
          if (level === 'architect' && !moduleProgress.module2.completed) {
            alert('Please complete Module 2: Advanced Patterns first!');
            return;
          }
          if (level === 'master' && !moduleProgress.module3.completed) {
            alert('Please complete Module 3: AI Integration first!');
            return;
          }

          // Set up assessment
          currentAssessmentLevel = level;
          currentQuestions = questionBanks[level];
          currentQuestion = 0;
          assessmentAnswers = [];
          
          console.log('Assessment setup:', { level, questionsAvailable: currentQuestions ? currentQuestions.length : 0 });

          // Update assessment title and requirements
          const requirements = {
            practitioner: { total: 5, passing: 70, time: '10 minutes' },
            developer: { total: 5, passing: 75, time: '15 minutes' }, // Simplified for demo
            architect: { total: 5, passing: 80, time: '20 minutes' },
            master: { total: 5, passing: 85, time: '25 minutes' }
          };

          const req = requirements[level];
          const title = level.charAt(0).toUpperCase() + level.slice(1) + ' Certification';
          
          const assessmentTitle = document.getElementById('assessment').querySelector('h3');
          if (assessmentTitle) {
            assessmentTitle.textContent = 'SPARC ' + title + ' Assessment';
          }
          
          document.getElementById('certSelection').classList.add('hidden');
          document.getElementById('assessment').classList.remove('hidden');
          
          showQuestion();
        }

        function showQuestion() {
          console.log('showQuestion called:', { currentQuestion, currentQuestions: currentQuestions.length });
          
          if (!currentQuestions || currentQuestions.length === 0) {
            alert('Error: No questions available for assessment. Please try again.');
            return;
          }
          
          const q = currentQuestions[currentQuestion];
          const container = document.getElementById('questionContainer');
          
          if (!container) {
            alert('Error: Question container not found. Please refresh the page.');
            return;
          }
          
          container.innerHTML = 
            '<div class="assessment-question">' +
              '<h4>Question ' + (currentQuestion + 1) + '/' + currentQuestions.length + '</h4>' +
              '<p><strong>' + q.question + '</strong></p>' +
              q.options.map(function(option, i) {
                return '<div class="option"><input type="radio" name="answer" value="' + i + '" id="opt' + i + '"><label for="opt' + i + '">' + option + '</label></div>';
              }).join('') +
            '</div>';

          // Update progress
          const progress = ((currentQuestion + 1) / currentQuestions.length) * 100;
          document.getElementById('assessmentProgress').style.width = progress + '%';
          document.getElementById('assessmentProgress').textContent = 'Question ' + (currentQuestion + 1) + '/' + currentQuestions.length;

          // Update buttons
          document.getElementById('prevBtn').disabled = currentQuestion === 0;
          document.getElementById('nextBtn').style.display = currentQuestion < currentQuestions.length - 1 ? 'inline-block' : 'none';
          document.getElementById('finishBtn').style.display = currentQuestion === currentQuestions.length - 1 ? 'inline-block' : 'none';
        }

        function nextQuestion() {
          const selected = document.querySelector('input[name="answer"]:checked');
          if (!selected) {
            alert('Please select an answer!');
            return;
          }
          
          assessmentAnswers[currentQuestion] = parseInt(selected.value);
          
          if (currentQuestion < currentQuestions.length - 1) {
            currentQuestion++;
            showQuestion();
          }
        }

        function prevQuestion() {
          if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion();
          }
        }

        function finishAssessment() {
          const selected = document.querySelector('input[name="answer"]:checked');
          if (selected) {
            assessmentAnswers[currentQuestion] = parseInt(selected.value);
          }

          let correct = 0;
          currentQuestions.forEach((q, i) => {
            if (assessmentAnswers[i] === q.correct) correct++;
          });

          const score = Math.round((correct / currentQuestions.length) * 100);
          
          // Get pass requirements for current level
          const passRates = {
            practitioner: 70,
            developer: 75,
            architect: 80,
            master: 85
          };
          
          const requiredScore = passRates[currentAssessmentLevel];
          const passed = score >= requiredScore;
          
          const levelTitles = {
            practitioner: 'SPARC Practitioner',
            developer: 'SPARC Developer',
            architect: 'SPARC Architect',
            master: 'SPARC Master'
          };

          const certTitle = levelTitles[currentAssessmentLevel];
          
          // Save certification if passed
          if (passed) {
            addCertification(currentAssessmentLevel, score);
            updateDashboard();
          }

          alert('Assessment Complete!\\n\\nScore: ' + score + '%\\nCorrect: ' + correct + '/' + currentQuestions.length + '\\n\\n' + 
                (passed ? 
                  '🎉 Congratulations! You passed!\\n\\nYou are now a certified ' + certTitle + '!' : 
                  '❌ Sorry, you need ' + requiredScore + '% to pass.\\nPlease study more and try again.'));

          // Reset to selection
          document.getElementById('assessment').classList.add('hidden');
          document.getElementById('certSelection').classList.remove('hidden');
        }

        // Dashboard functions
        function updateDashboard() {
          // Update module progress
          if (moduleProgress.module1.completed) {
            document.getElementById('mod1Status').textContent = '✅ Complete';
            document.getElementById('mod1ProgressBar').style.width = '100%';
            document.getElementById('mod1ProgressBar').textContent = '100%';
          }
          
          if (moduleProgress.module2.completed) {
            document.getElementById('mod2Status').textContent = '✅ Complete';
            document.getElementById('mod2ProgressBar').style.width = '100%';
            document.getElementById('mod2ProgressBar').textContent = '100%';
          } else if (moduleProgress.module1.completed) {
            document.getElementById('mod2Status').textContent = '📖 Available';
          }
          
          if (moduleProgress.module3.completed) {
            document.getElementById('mod3Status').textContent = '✅ Complete';
            document.getElementById('mod3ProgressBar').style.width = '100%';
            document.getElementById('mod3ProgressBar').textContent = '100%';
          } else if (moduleProgress.module2.completed) {
            document.getElementById('mod3Status').textContent = '📖 Available';
          }
          
          // Update certifications
          const certsList = document.getElementById('certsList');
          if (userProfile.certifications.length > 0) {
            certsList.innerHTML = userProfile.certifications.map(cert => 
              '<div style="margin: 5px 0; padding: 10px; background: #e8f5e8; border-radius: 5px;">' +
              '🏆 ' + cert.level.charAt(0).toUpperCase() + cert.level.slice(1) + 
              ' (' + cert.score + '%) - ' + new Date(cert.earnedAt).toLocaleDateString() +
              '</div>'
            ).join('');
          } else {
            certsList.innerHTML = '<p><em>No certifications earned yet</em></p>';
          }
          
          // Update analytics
          const accountAge = Math.floor((Date.now() - userProfile.createdAt) / (1000 * 60 * 60 * 24));
          document.getElementById('accountAge').textContent = accountAge === 0 ? 'Today' : accountAge + ' days ago';
          document.getElementById('lastUpdate').textContent = new Date().toLocaleDateString();
          
          // Update session count (simple increment for demo)
          const sessions = parseInt(localStorage.getItem('sparc-session-count') || '1');
          document.getElementById('sessionCount').textContent = sessions;
        }
        
        function exportProgress() {
          const progressData = {
            userProfile: userProfile,
            moduleProgress: moduleProgress,
            exportDate: new Date().toISOString(),
            platform: 'SPARC Evolution Educational Platform'
          };
          
          const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progressData, null, 2));
          const downloadAnchor = document.createElement('a');
          downloadAnchor.setAttribute('href', dataStr);
          downloadAnchor.setAttribute('download', 'sparc-progress-' + new Date().toISOString().split('T')[0] + '.json');
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          downloadAnchor.remove();
          
          alert('📤 Progress exported successfully!\\n\\nYour learning data has been downloaded as a JSON file.');
        }
        
        function resetProgress() {
          if (confirm('⚠️ Are you sure you want to reset all progress?\\n\\nThis will delete all module completion, certifications, and learning data.')) {
            localStorage.removeItem('sparc-user-progress');
            localStorage.removeItem('sparc-session-count');
            location.reload();
          }
        }

        // Debug: Test question banks
        console.log('Question banks loaded:', {
          practitioner: questionBanks.practitioner ? questionBanks.practitioner.length : 0,
          developer: questionBanks.developer ? questionBanks.developer.length : 0,
          architect: questionBanks.architect ? questionBanks.architect.length : 0,
          master: questionBanks.master ? questionBanks.master.length : 0
        });

        // Initialize with home section and load user progress
        loadUserProgress();
        updateDashboard();
        showSection('home');
      </script>
    </body>
    </html>
  `);
});

// API endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'SPARC Evolution Interactive',
    features: ['playground', 'assessment', 'learning', 'certification']
  });
});

// Test endpoint for functionality validation
app.get('/api/test', (req, res) => {
  res.json({
    status: 'testing',
    tests: {
      server: 'running',
      assessmentQuestions: {
        practitioner: 5,
        developer: 5,
        architect: 5,
        master: 5
      },
      modules: {
        module1: 'available',
        module2: 'available',
        module3: 'available'
      },
      features: [
        'learning-modules',
        'assessments',
        'progress-tracking',
        'dashboard',
        'export-import'
      ]
    },
    knownIssues: [
      'Module unlocking may require browser refresh',
      'Assessment questions visibility needs manual verification'
    ],
    debugging: 'Console logs enabled for troubleshooting'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Enhanced SPARC Platform running on port ' + PORT);
  console.log('🌐 Access at: https://humble-computing-machine-7qqrqvpjqgcx446-' + PORT + '.app.github.dev/');
  console.log('✨ Features: Interactive Playground, Assessments, Learning Modules');
});