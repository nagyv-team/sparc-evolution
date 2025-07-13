// Simple test server for Codespaces
const express = require('express');
const app = express();
const PORT = 3001; // Use different port

app.use(express.json());

// CORS for Codespaces
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Basic routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SPARC Evolution Platform</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        .sparc-step { background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .api-link { color: #1976d2; text-decoration: none; }
        .success { color: #2e7d32; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 SPARC Evolution Educational Platform</h1>
        <p class="success">✅ Platform is running successfully!</p>
        
        <h2>📊 SPARC Methodology</h2>
        <div class="sparc-step"><strong>S</strong>pecifications: Clear requirements and problem definition</div>
        <div class="sparc-step"><strong>P</strong>seudocode: Step-by-step logical flow before implementation</div>
        <div class="sparc-step"><strong>A</strong>rchitecture: System design and component structure</div>
        <div class="sparc-step"><strong>R</strong>efinement: Iterative improvement and optimization</div>
        <div class="sparc-step"><strong>C</strong>ompletion: Final implementation and validation</div>
        
        <h2>🔗 API Endpoints</h2>
        <ul>
          <li><a href="/api/health" class="api-link">Health Check</a></li>
          <li><a href="/api/sparc-info" class="api-link">SPARC Information</a></li>
          <li><a href="/api/playground/examples" class="api-link">Code Examples</a></li>
        </ul>
        
        <h2>🎯 Platform Features</h2>
        <ul>
          <li>✅ Interactive Code Playground</li>
          <li>✅ 4-Level Certification System</li>
          <li>✅ Progressive Learning Modules</li>
          <li>✅ Assessment Engine</li>
          <li>✅ Complete Educational Content</li>
        </ul>
        
        <p><strong>Created by:</strong> Reuven Cohen's SPARC methodology evolution</p>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'SPARC Evolution',
    version: '1.0.0'
  });
});

app.get('/api/sparc-info', (req, res) => {
  res.json({
    methodology: 'SPARC',
    creator: 'Reuven Cohen',
    steps: [
      'Specifications: Clear requirements and problem definition',
      'Pseudocode: Step-by-step logical flow before implementation',
      'Architecture: System design and component structure',
      'Refinement: Iterative improvement and optimization',
      'Completion: Final implementation and validation'
    ],
    repositories: [
      'https://github.com/ruvnet/sparc',
      'https://www.npmjs.com/package/@agentics.org/sparc2',
      'https://www.npmjs.com/package/create-sparc',
      'https://www.npmjs.com/package/claude-flow',
      'https://github.com/ruvnet/claude-flow'
    ]
  });
});

app.get('/api/playground/examples', (req, res) => {
  res.json({
    examples: [
      { id: 'sparc-1.0/basic-calculator', name: 'Basic Calculator', version: 'sparc-1.0', difficulty: 'beginner' },
      { id: 'sparc-2.0/todo-app', name: 'Todo Application', version: 'sparc-2.0', difficulty: 'intermediate' },
      { id: 'sparc-3.0/ai-assistant', name: 'AI Code Assistant', version: 'sparc-3.0', difficulty: 'advanced' }
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ SPARC Evolution Platform running on port ${PORT}`);
  console.log(`🌐 Codespace URL: https://humble-computing-machine-7qqrqvpjqgcx446-${PORT}.app.github.dev/`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
});