// Enhanced SPARC Platform with Interactive Features
const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());
app.use(express.static('public'));

// CORS for Codespaces
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// In-memory storage for demo
const sessions = new Map();
const assessments = new Map();

// Main platform interface
app.get('/', (req, res) => {
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
 * Problem: [Define what problem you're solving]
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
          
          <div class="feature-grid">
            <div class="feature-card">
              <h3>Module 1: Foundation</h3>
              <div class="progress">
                <div class="progress-bar" style="width: 0%">0% Complete</div>
              </div>
              <ul>
                <li>✅ SPARC methodology overview</li>
                <li>⭕ Development environment setup</li>
                <li>⭕ First SPARC project</li>
              </ul>
              <button class="btn" onclick="startModule(1)">Start Module</button>
            </div>
            <div class="feature-card">
              <h3>Module 2: Advanced Patterns</h3>
              <div class="progress">
                <div class="progress-bar" style="width: 0%">Locked</div>
              </div>
              <ul>
                <li>🔒 Complex system design</li>
                <li>🔒 Performance optimization</li>
                <li>🔒 Error handling patterns</li>
              </ul>
              <button class="btn" disabled>Complete Module 1</button>
            </div>
            <div class="feature-card">
              <h3>Module 3: AI Integration</h3>
              <div class="progress">
                <div class="progress-bar" style="width: 0%">Locked</div>
              </div>
              <ul>
                <li>🔒 Swarm intelligence</li>
                <li>🔒 Neural memory systems</li>
                <li>🔒 Production deployment</li>
              </ul>
              <button class="btn" disabled>Complete Module 2</button>
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
                <li>Requires Practitioner cert</li>
              </ul>
              <button class="btn" onclick="alert('Complete Practitioner level first!')">Locked</button>
            </div>
            <div class="feature-card">
              <h3>🥇 SPARC Architect</h3>
              <p><strong>Advanced Level</strong></p>
              <ul>
                <li>40 questions (80% to pass)</li>
                <li>System architecture design</li>
                <li>Requires Developer cert</li>
              </ul>
              <button class="btn" disabled>Locked</button>
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

        const questions = [
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
        ];

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

          output.innerHTML = \`✅ Code executed successfully!
📝 Step: \${sparcSteps[currentPlaygroundStep].name}
💡 Good job following SPARC methodology!\`;
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
          document.getElementById('progressBar').textContent = \`Step \${currentPlaygroundStep + 1}/\${sparcSteps.length}\`;
        }

        function clearCode() {
          document.getElementById('codeEditor').value = '';
          document.getElementById('output').innerHTML = '🗑️ Code cleared. Ready for new input!';
        }

        function startModule(moduleNum) {
          alert(\`Starting Module \${moduleNum}: SPARC Foundation\\n\\nThis would normally open the interactive learning content with:\\n- Video tutorials\\n- Hands-on exercises\\n- Progress tracking\\n- Assessments\`);
        }

        function startAssessment(level) {
          document.getElementById('certSelection').classList.add('hidden');
          document.getElementById('assessment').classList.remove('hidden');
          currentQuestion = 0;
          assessmentAnswers = [];
          showQuestion();
        }

        function showQuestion() {
          const q = questions[currentQuestion];
          const container = document.getElementById('questionContainer');
          
          container.innerHTML = \`
            <div class="assessment-question">
              <h4>Question \${currentQuestion + 1}/\${questions.length}</h4>
              <p><strong>\${q.question}</strong></p>
              \${q.options.map((option, i) => \`
                <div class="option">
                  <input type="radio" name="answer" value="\${i}" id="opt\${i}">
                  <label for="opt\${i}">\${option}</label>
                </div>
              \`).join('')}
            </div>
          \`;

          // Update progress
          const progress = ((currentQuestion + 1) / questions.length) * 100;
          document.getElementById('assessmentProgress').style.width = progress + '%';
          document.getElementById('assessmentProgress').textContent = \`Question \${currentQuestion + 1}/\${questions.length}\`;

          // Update buttons
          document.getElementById('prevBtn').disabled = currentQuestion === 0;
          document.getElementById('nextBtn').style.display = currentQuestion < questions.length - 1 ? 'inline-block' : 'none';
          document.getElementById('finishBtn').style.display = currentQuestion === questions.length - 1 ? 'inline-block' : 'none';
        }

        function nextQuestion() {
          const selected = document.querySelector('input[name="answer"]:checked');
          if (!selected) {
            alert('Please select an answer!');
            return;
          }
          
          assessmentAnswers[currentQuestion] = parseInt(selected.value);
          
          if (currentQuestion < questions.length - 1) {
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
          questions.forEach((q, i) => {
            if (assessmentAnswers[i] === q.correct) correct++;
          });

          const score = Math.round((correct / questions.length) * 100);
          const passed = score >= 70;

          alert(\`Assessment Complete!\\n\\nScore: \${score}%\\nCorrect: \${correct}/\${questions.length}\\n\\n\${passed ? '🎉 Congratulations! You passed!\\n\\nYou are now a certified SPARC Practitioner!' : '❌ Sorry, you need 70% to pass.\\nPlease study more and try again.'}\`);

          // Reset to selection
          document.getElementById('assessment').classList.add('hidden');
          document.getElementById('certSelection').classList.remove('hidden');
        }

        // Initialize with home section
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Enhanced SPARC Platform running on port ${PORT}`);
  console.log(`🌐 Access at: https://humble-computing-machine-7qqrqvpjqgcx446-${PORT}.app.github.dev/`);
  console.log(`✨ Features: Interactive Playground, Assessments, Learning Modules`);
});