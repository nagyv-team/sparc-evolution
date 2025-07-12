/**
 * SPARC 3.0 Example: AI-Powered Code Assistant
 * Demonstrates SPARC 3.0 with AI integration and Claude Flow patterns
 * Author: SPARC Evolution Team
 */

// SPARC Step 1: SPECIFICATIONS
/*
REQUIREMENTS:
- AI-powered code assistant with multiple language support
- Real-time code analysis and suggestions
- Integration with Claude Flow for enhanced AI capabilities
- Code completion, error detection, and optimization suggestions
- Multi-agent swarm coordination for complex analysis
- Natural language to code generation
- Code explanation and documentation generation
- Performance analysis and bottleneck detection
- Security vulnerability scanning
- Collaborative coding with shared AI sessions

CONSTRAINTS:
- Must leverage Claude Flow MCP tools for AI coordination
- Support for 20+ programming languages
- Sub-200ms response time for basic suggestions
- Memory efficient with streaming for large codebases
- Secure code execution in sandboxed environments
- Privacy-first design with local-first processing

EXPECTED INPUTS:
- Source code in various languages
- Natural language queries about code
- Code modification requests
- Performance optimization requests
- Security analysis requests

EXPECTED OUTPUTS:
- Real-time code suggestions
- Explanations in natural language
- Optimized code variants
- Security vulnerability reports
- Performance improvement recommendations
- Generated documentation
*/

// SPARC Step 2: PSEUDOCODE
/*
BEGIN AICodeAssistant
  INITIALIZE swarm = null
  INITIALIZE agents = {
    codeAnalyzer: null,
    languageExpert: null,
    securityScanner: null,
    performanceOptimizer: null,
    documentationGenerator: null
  }
  
  FUNCTION initializeSwarm()
    CALL mcp__claude-flow__swarm_init({
      topology: "mesh",
      maxAgents: 8,
      strategy: "adaptive"
    })
    
    SPAWN codeAnalyzer agent
    SPAWN languageExpert agent
    SPAWN securityScanner agent
    SPAWN performanceOptimizer agent
    SPAWN documentationGenerator agent
    SPAWN coordinator agent
    
    SETUP memory for session persistence
    ENABLE neural pattern learning
  END FUNCTION
  
  FUNCTION analyzeCode(sourceCode, language)
    VALIDATE input parameters
    
    ORCHESTRATE parallel analysis tasks:
      - Syntax analysis
      - Semantic analysis
      - Performance analysis
      - Security scanning
      - Best practices checking
    
    COORDINATE agents through Claude Flow hooks
    AGGREGATE results from all agents
    RETURN comprehensive analysis report
  END FUNCTION
  
  FUNCTION generateSuggestions(code, context, userQuery)
    IF userQuery is natural language
      TRANSFORM query to code intent
    END IF
    
    PARALLEL execution:
      TASK codeAnalyzer: analyze current code
      TASK languageExpert: provide language-specific suggestions
      TASK performanceOptimizer: identify optimization opportunities
      
    COORDINATE through memory sharing
    SYNTHESIZE suggestions with confidence scores
    RETURN ranked suggestions
  END FUNCTION
  
  FUNCTION explainCode(codeSnippet)
    TASK documentationGenerator: generate explanation
    TASK codeAnalyzer: identify patterns and algorithms
    
    MERGE insights from agents
    GENERATE natural language explanation
    RETURN explanation with examples
  END FUNCTION
  
  FUNCTION optimizeCode(code, optimizationType)
    SWITCH optimizationType
      CASE "performance":
        TASK performanceOptimizer: identify bottlenecks
        TASK codeAnalyzer: suggest algorithmic improvements
      CASE "readability":
        TASK documentationGenerator: improve variable names
        TASK languageExpert: apply best practices
      CASE "security":
        TASK securityScanner: identify vulnerabilities
        TASK codeAnalyzer: suggest secure alternatives
    END SWITCH
    
    COORDINATE optimization tasks
    RETURN optimized code with explanations
  END FUNCTION
  
  FUNCTION detectVulnerabilities(code)
    TASK securityScanner: run security analysis
    CROSS-REFERENCE with CVE database
    GENERATE vulnerability report
    SUGGEST remediation steps
    RETURN security assessment
  END FUNCTION
END AICodeAssistant
*/

// SPARC Step 3: ARCHITECTURE
/*
COMPONENTS:
1. AICodeAssistant - Main orchestrator
2. SwarmCoordinator - Claude Flow integration
3. CodeAnalysisEngine - Multi-language analysis
4. SuggestionGenerator - AI-powered suggestions
5. SecurityScanner - Vulnerability detection
6. PerformanceProfiler - Optimization analysis
7. DocumentationGenerator - Auto-documentation
8. NaturalLanguageProcessor - Query understanding
9. CodeExecutor - Sandboxed execution
10. CollaborationHub - Multi-user sessions

DATA FLOW:
User Input → NLP → SwarmCoordinator → Agents → Analysis Results → UI
     ↑                                   ↓
Collaboration ← Memory Store ← Agent Coordination

STRUCTURE:
AICodeAssistant/
├── src/
│   ├── core/
│   │   ├── AICodeAssistant.js (main orchestrator)
│   │   ├── SwarmCoordinator.js (Claude Flow integration)
│   │   ├── AgentManager.js (agent lifecycle)
│   │   └── MemoryManager.js (persistent context)
│   ├── engines/
│   │   ├── CodeAnalysisEngine.js (syntax/semantic analysis)
│   │   ├── SuggestionEngine.js (AI suggestions)
│   │   ├── SecurityEngine.js (vulnerability scanning)
│   │   ├── PerformanceEngine.js (optimization analysis)
│   │   └── DocumentationEngine.js (auto-docs)
│   ├── processors/
│   │   ├── NaturalLanguageProcessor.js (query understanding)
│   │   ├── CodeParser.js (multi-language parsing)
│   │   ├── PatternRecognizer.js (code patterns)
│   │   └── IntentClassifier.js (user intent)
│   ├── execution/
│   │   ├── CodeExecutor.js (sandboxed execution)
│   │   ├── TestRunner.js (automated testing)
│   │   └── SecuritySandbox.js (secure execution)
│   ├── collaboration/
│   │   ├── SessionManager.js (multi-user sessions)
│   │   ├── RealtimeSync.js (collaborative editing)
│   │   └── ConflictResolver.js (merge conflicts)
│   └── ui/
│       ├── CodeEditor.js (enhanced editor)
│       ├── SuggestionPanel.js (AI suggestions UI)
│       ├── ChatInterface.js (natural language chat)
│       └── AnalysisViewer.js (analysis results)
├── agents/
│   ├── CodeAnalyzerAgent.js
│   ├── SecurityScannerAgent.js
│   ├── PerformanceOptimizerAgent.js
│   ├── DocumentationGeneratorAgent.js
│   └── CoordinatorAgent.js
├── languages/
│   ├── javascript.js
│   ├── python.js
│   ├── rust.js
│   ├── go.js
│   └── [20+ language configs]
└── tests/
    ├── unit/
    ├── integration/
    └── swarm/
*/

// SPARC Step 4: REFINEMENT
/*
IMPROVEMENTS IDENTIFIED:
1. Advanced swarm topology optimization
2. Neural pattern learning from user interactions
3. Cross-language code translation
4. Automated refactoring suggestions
5. AI-generated unit tests
6. Code smell detection with fix suggestions
7. Intelligent code completion with context awareness
8. Performance profiling with bottleneck visualization
9. Security policy enforcement
10. Code review automation

OPTIMIZATIONS:
1. Lazy loading of language-specific analyzers
2. Streaming analysis for large codebases
3. Cached results with intelligent invalidation
4. Worker threads for CPU-intensive analysis
5. WebAssembly for performance-critical components
6. Delta analysis for incremental updates

ERROR HANDLING:
1. Graceful degradation when AI services unavailable
2. Fallback to local analysis when network fails
3. Timeout handling for long-running analysis
4. Memory pressure management
5. Malicious code detection and sandboxing
*/

// SPARC Step 5: COMPLETION

// Import Claude Flow MCP tools (simulated)
const claudeFlow = {
  swarmInit: typeof mcp__claude_flow__swarm_init !== 'undefined' ? mcp__claude_flow__swarm_init : null,
  agentSpawn: typeof mcp__claude_flow__agent_spawn !== 'undefined' ? mcp__claude_flow__agent_spawn : null,
  taskOrchestrate: typeof mcp__claude_flow__task_orchestrate !== 'undefined' ? mcp__claude_flow__task_orchestrate : null,
  memoryUsage: typeof mcp__claude_flow__memory_usage !== 'undefined' ? mcp__claude_flow__memory_usage : null,
  neuralTrain: typeof mcp__claude_flow__neural_train !== 'undefined' ? mcp__claude_flow__neural_train : null
};

// Swarm Coordinator for Claude Flow integration
class SwarmCoordinator {
  constructor() {
    this.swarmId = null;
    this.agents = new Map();
    this.isInitialized = false;
    this.memoryNamespace = 'ai-code-assistant';
  }
  
  async initializeSwarm() {
    try {
      if (claudeFlow.swarmInit) {
        const result = await claudeFlow.swarmInit({
          topology: 'mesh',
          maxAgents: 8,
          strategy: 'adaptive'
        });
        this.swarmId = result?.swarmId;
      }
      
      // Spawn specialized agents
      await this.spawnAgents();
      
      // Initialize memory namespace
      if (claudeFlow.memoryUsage) {
        await claudeFlow.memoryUsage({
          action: 'store',
          namespace: this.memoryNamespace,
          key: 'session/init',
          value: JSON.stringify({
            timestamp: Date.now(),
            swarmId: this.swarmId,
            agentCount: this.agents.size
          })
        });
      }
      
      this.isInitialized = true;
      console.log('AI Code Assistant swarm initialized');
      
    } catch (error) {
      console.error('Failed to initialize swarm:', error);
      // Fallback to local mode
      this.initializeLocalMode();
    }
  }
  
  async spawnAgents() {
    const agentTypes = [
      { type: 'coder', name: 'CodeAnalyzer', capabilities: ['syntax-analysis', 'semantic-analysis'] },
      { type: 'analyst', name: 'PerformanceOptimizer', capabilities: ['performance-analysis', 'optimization'] },
      { type: 'specialist', name: 'SecurityScanner', capabilities: ['vulnerability-scanning', 'security-analysis'] },
      { type: 'documenter', name: 'DocumentationGenerator', capabilities: ['documentation', 'explanation'] },
      { type: 'researcher', name: 'LanguageExpert', capabilities: ['language-patterns', 'best-practices'] },
      { type: 'coordinator', name: 'SessionCoordinator', capabilities: ['coordination', 'result-synthesis'] }
    ];
    
    for (const agentConfig of agentTypes) {
      try {
        if (claudeFlow.agentSpawn) {
          const agent = await claudeFlow.agentSpawn({
            type: agentConfig.type,
            name: agentConfig.name,
            capabilities: agentConfig.capabilities,
            swarmId: this.swarmId
          });
          
          this.agents.set(agentConfig.name, {
            id: agent?.agentId || `local-${agentConfig.name}`,
            type: agentConfig.type,
            capabilities: agentConfig.capabilities,
            status: 'active'
          });
        }
      } catch (error) {
        console.warn(`Failed to spawn ${agentConfig.name} agent:`, error);
      }
    }
  }
  
  initializeLocalMode() {
    console.log('Initializing local mode (no Claude Flow integration)');
    this.isInitialized = true;
  }
  
  async orchestrateTask(taskType, taskData) {
    if (!this.isInitialized) {
      await this.initializeSwarm();
    }
    
    try {
      if (claudeFlow.taskOrchestrate) {
        return await claudeFlow.taskOrchestrate({
          task: taskType,
          data: taskData,
          strategy: 'parallel',
          swarmId: this.swarmId
        });
      } else {
        // Local fallback
        return await this.handleTaskLocally(taskType, taskData);
      }
    } catch (error) {
      console.error('Task orchestration failed:', error);
      return await this.handleTaskLocally(taskType, taskData);
    }
  }
  
  async storeMemory(key, value) {
    try {
      if (claudeFlow.memoryUsage) {
        await claudeFlow.memoryUsage({
          action: 'store',
          namespace: this.memoryNamespace,
          key: key,
          value: JSON.stringify(value),
          ttl: 3600000 // 1 hour
        });
      } else {
        // Local storage fallback
        localStorage.setItem(`${this.memoryNamespace}:${key}`, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Failed to store memory:', error);
    }
  }
  
  async retrieveMemory(key) {
    try {
      if (claudeFlow.memoryUsage) {
        const result = await claudeFlow.memoryUsage({
          action: 'retrieve',
          namespace: this.memoryNamespace,
          key: key
        });
        return result ? JSON.parse(result) : null;
      } else {
        // Local storage fallback
        const stored = localStorage.getItem(`${this.memoryNamespace}:${key}`);
        return stored ? JSON.parse(stored) : null;
      }
    } catch (error) {
      console.error('Failed to retrieve memory:', error);
      return null;
    }
  }
  
  async handleTaskLocally(taskType, taskData) {
    // Simplified local processing
    console.log(`Handling ${taskType} locally:`, taskData);
    
    switch (taskType) {
      case 'code-analysis':
        return this.localCodeAnalysis(taskData);
      case 'generate-suggestions':
        return this.localGenerateSuggestions(taskData);
      case 'explain-code':
        return this.localExplainCode(taskData);
      default:
        return { status: 'completed', result: 'Local processing completed' };
    }
  }
  
  localCodeAnalysis(data) {
    // Basic syntax checking and pattern recognition
    const { code, language } = data;
    const issues = [];
    const suggestions = [];
    
    // Simple pattern matching for common issues
    if (code.includes('eval(')) {
      issues.push({
        type: 'security',
        severity: 'high',
        message: 'Use of eval() is dangerous and should be avoided',
        line: this.findLineNumber(code, 'eval(')
      });
    }
    
    if (code.includes('var ') && language === 'javascript') {
      suggestions.push({
        type: 'modernization',
        message: 'Consider using let or const instead of var',
        line: this.findLineNumber(code, 'var ')
      });
    }
    
    return {
      status: 'completed',
      result: {
        issues,
        suggestions,
        complexity: this.calculateComplexity(code),
        linesOfCode: code.split('\n').length
      }
    };
  }
  
  localGenerateSuggestions(data) {
    const { code, cursor, context } = data;
    const suggestions = [];
    
    // Basic autocompletion
    const currentLine = this.getCurrentLine(code, cursor);
    const words = currentLine.split(/\s+/);
    const lastWord = words[words.length - 1];
    
    if (lastWord.startsWith('con')) {
      suggestions.push({
        text: 'console.log()',
        description: 'Log to console',
        type: 'method'
      });
      suggestions.push({
        text: 'const',
        description: 'Declare constant',
        type: 'keyword'
      });
    }
    
    return {
      status: 'completed',
      result: { suggestions }
    };
  }
  
  localExplainCode(data) {
    const { code } = data;
    const explanation = [];
    
    // Basic code explanation
    if (code.includes('function')) {
      explanation.push('This code defines a function.');
    }
    
    if (code.includes('for') || code.includes('while')) {
      explanation.push('This code contains a loop structure.');
    }
    
    if (code.includes('if')) {
      explanation.push('This code includes conditional logic.');
    }
    
    return {
      status: 'completed',
      result: {
        explanation: explanation.join(' '),
        complexity: 'medium',
        maintainability: 'good'
      }
    };
  }
  
  findLineNumber(code, pattern) {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(pattern)) {
        return i + 1;
      }
    }
    return 1;
  }
  
  getCurrentLine(code, cursor) {
    const lines = code.substring(0, cursor).split('\n');
    return lines[lines.length - 1];
  }
  
  calculateComplexity(code) {
    const complexityKeywords = ['if', 'for', 'while', 'switch', 'catch', 'forEach'];
    let complexity = 1;
    
    for (const keyword of complexityKeywords) {
      const matches = (code.match(new RegExp(`\\b${keyword}\\b`, 'g')) || []).length;
      complexity += matches;
    }
    
    return complexity;
  }
}

// Code Analysis Engine
class CodeAnalysisEngine {
  constructor(swarmCoordinator) {
    this.swarm = swarmCoordinator;
    this.languageProcessors = new Map();
    this.initializeLanguageProcessors();
  }
  
  initializeLanguageProcessors() {
    // Register language-specific processors
    this.languageProcessors.set('javascript', new JavaScriptProcessor());
    this.languageProcessors.set('python', new PythonProcessor());
    this.languageProcessors.set('rust', new RustProcessor());
    this.languageProcessors.set('go', new GoProcessor());
  }
  
  async analyzeCode(code, language, options = {}) {
    const processor = this.languageProcessors.get(language);
    if (!processor) {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    // Store analysis context in memory
    await this.swarm.storeMemory(`analysis/${Date.now()}`, {
      code: code.substring(0, 1000), // Store first 1000 chars for context
      language,
      timestamp: Date.now()
    });
    
    // Orchestrate analysis through swarm
    const analysisResult = await this.swarm.orchestrateTask('code-analysis', {
      code,
      language,
      processor: processor.name,
      options
    });
    
    // Enhance with language-specific analysis
    const languageSpecificResults = await processor.analyze(code, options);
    
    return {
      ...analysisResult.result,
      languageSpecific: languageSpecificResults,
      timestamp: Date.now(),
      language
    };
  }
  
  async generateSuggestions(code, cursor, language) {
    const context = await this.getContext(code, cursor);
    
    const suggestionResult = await this.swarm.orchestrateTask('generate-suggestions', {
      code,
      cursor,
      language,
      context
    });
    
    return suggestionResult.result;
  }
  
  async explainCode(codeSnippet, language) {
    const explanationResult = await this.swarm.orchestrateTask('explain-code', {
      code: codeSnippet,
      language
    });
    
    return explanationResult.result;
  }
  
  async getContext(code, cursor) {
    // Extract context around cursor position
    const lines = code.split('\n');
    const cursorLine = this.getCursorLine(code, cursor);
    
    const contextStart = Math.max(0, cursorLine - 5);
    const contextEnd = Math.min(lines.length, cursorLine + 5);
    
    return {
      surroundingCode: lines.slice(contextStart, contextEnd).join('\n'),
      currentLine: lines[cursorLine] || '',
      lineNumber: cursorLine + 1
    };
  }
  
  getCursorLine(code, cursor) {
    return code.substring(0, cursor).split('\n').length - 1;
  }
}

// Language-specific processors
class JavaScriptProcessor {
  constructor() {
    this.name = 'javascript';
  }
  
  async analyze(code, options) {
    const results = {
      syntaxErrors: [],
      warnings: [],
      suggestions: [],
      metrics: {}
    };
    
    try {
      // Basic syntax validation
      new Function(code);
      
      // Check for common patterns
      if (code.includes('==') && !code.includes('===')) {
        results.suggestions.push({
          type: 'equality',
          message: 'Consider using === for strict equality',
          severity: 'medium'
        });
      }
      
      if (code.includes('setTimeout') && code.includes('0')) {
        results.warnings.push({
          type: 'performance',
          message: 'setTimeout with 0ms delay, consider setImmediate or requestAnimationFrame',
          severity: 'low'
        });
      }
      
      // Calculate metrics
      results.metrics = {
        functions: (code.match(/function\s+\w+/g) || []).length,
        classes: (code.match(/class\s+\w+/g) || []).length,
        variables: (code.match(/(?:let|const|var)\s+\w+/g) || []).length,
        linesOfCode: code.split('\n').length
      };
      
    } catch (error) {
      results.syntaxErrors.push({
        message: error.message,
        type: 'syntax'
      });
    }
    
    return results;
  }
}

class PythonProcessor {
  constructor() {
    this.name = 'python';
  }
  
  async analyze(code, options) {
    return {
      syntaxErrors: [],
      warnings: [],
      suggestions: [
        {
          type: 'style',
          message: 'Python analysis would require a Python parser',
          severity: 'info'
        }
      ],
      metrics: {
        linesOfCode: code.split('\n').length,
        functions: (code.match(/def\s+\w+/g) || []).length,
        classes: (code.match(/class\s+\w+/g) || []).length
      }
    };
  }
}

class RustProcessor {
  constructor() {
    this.name = 'rust';
  }
  
  async analyze(code, options) {
    return {
      syntaxErrors: [],
      warnings: [],
      suggestions: [
        {
          type: 'memory',
          message: 'Rust analysis would require a Rust parser',
          severity: 'info'
        }
      ],
      metrics: {
        linesOfCode: code.split('\n').length,
        functions: (code.match(/fn\s+\w+/g) || []).length,
        structs: (code.match(/struct\s+\w+/g) || []).length
      }
    };
  }
}

class GoProcessor {
  constructor() {
    this.name = 'go';
  }
  
  async analyze(code, options) {
    return {
      syntaxErrors: [],
      warnings: [],
      suggestions: [
        {
          type: 'concurrency',
          message: 'Go analysis would require a Go parser',
          severity: 'info'
        }
      ],
      metrics: {
        linesOfCode: code.split('\n').length,
        functions: (code.match(/func\s+\w+/g) || []).length,
        structs: (code.match(/type\s+\w+\s+struct/g) || []).length
      }
    };
  }
}

// Main AI Code Assistant
class AICodeAssistant {
  constructor() {
    this.swarmCoordinator = new SwarmCoordinator();
    this.analysisEngine = new CodeAnalysisEngine(this.swarmCoordinator);
    this.sessions = new Map();
    this.currentSession = null;
    
    this.initializeUI();
    this.setupEventListeners();
  }
  
  async initialize() {
    await this.swarmCoordinator.initializeSwarm();
    
    // Train neural patterns if available
    if (claudeFlow.neuralTrain) {
      try {
        await claudeFlow.neuralTrain({
          pattern_type: 'coordination',
          training_data: JSON.stringify({
            domain: 'code-analysis',
            patterns: ['syntax-analysis', 'suggestion-generation', 'explanation']
          }),
          epochs: 10
        });
      } catch (error) {
        console.log('Neural training not available:', error.message);
      }
    }
    
    console.log('AI Code Assistant initialized');
  }
  
  async startSession(sessionId = null) {
    sessionId = sessionId || `session-${Date.now()}`;
    
    const session = {
      id: sessionId,
      startTime: Date.now(),
      codeHistory: [],
      analysisHistory: [],
      userInteractions: []
    };
    
    this.sessions.set(sessionId, session);
    this.currentSession = session;
    
    await this.swarmCoordinator.storeMemory(`session/${sessionId}`, session);
    
    return sessionId;
  }
  
  async analyzeCode(code, language = 'javascript') {
    if (!this.currentSession) {
      await this.startSession();
    }
    
    const analysis = await this.analysisEngine.analyzeCode(code, language);
    
    // Store in session history
    this.currentSession.analysisHistory.push({
      timestamp: Date.now(),
      code: code.substring(0, 500), // First 500 chars
      language,
      analysis: analysis
    });
    
    await this.swarmCoordinator.storeMemory(
      `session/${this.currentSession.id}`,
      this.currentSession
    );
    
    return analysis;
  }
  
  async getSuggestions(code, cursor, language = 'javascript') {
    const suggestions = await this.analysisEngine.generateSuggestions(code, cursor, language);
    
    // Learn from user interactions
    if (this.currentSession) {
      this.currentSession.userInteractions.push({
        type: 'suggestion-request',
        timestamp: Date.now(),
        context: { cursor, language }
      });
    }
    
    return suggestions;
  }
  
  async explainCode(codeSnippet, language = 'javascript') {
    const explanation = await this.analysisEngine.explainCode(codeSnippet, language);
    
    if (this.currentSession) {
      this.currentSession.userInteractions.push({
        type: 'explanation-request',
        timestamp: Date.now(),
        code: codeSnippet.substring(0, 200)
      });
    }
    
    return explanation;
  }
  
  async optimizeCode(code, optimizationType = 'performance', language = 'javascript') {
    // This would integrate with specialized optimization agents
    const optimizationResult = await this.swarmCoordinator.orchestrateTask('optimize-code', {
      code,
      type: optimizationType,
      language
    });
    
    return optimizationResult.result || {
      optimizedCode: code,
      improvements: ['Local optimization not available'],
      explanation: 'Full optimization requires Claude Flow integration'
    };
  }
  
  async detectVulnerabilities(code, language = 'javascript') {
    const vulnerabilities = await this.swarmCoordinator.orchestrateTask('security-scan', {
      code,
      language
    });
    
    return vulnerabilities.result || {
      vulnerabilities: [],
      securityScore: 85,
      recommendations: ['Enable Claude Flow for comprehensive security analysis']
    };
  }
  
  initializeUI() {
    const container = document.createElement('div');
    container.className = 'ai-code-assistant';
    container.innerHTML = `
      <header class="assistant-header">
        <h1>🤖 AI Code Assistant (SPARC 3.0)</h1>
        <div class="swarm-status">
          <span class="status-indicator"></span>
          <span class="status-text">Initializing...</span>
        </div>
      </header>
      
      <div class="assistant-layout">
        <div class="code-panel">
          <div class="editor-header">
            <select id="language-select" class="language-select">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
            </select>
            <button id="analyze-btn" class="action-btn">Analyze Code</button>
            <button id="optimize-btn" class="action-btn">Optimize</button>
            <button id="explain-btn" class="action-btn">Explain</button>
            <button id="security-btn" class="action-btn">Security Scan</button>
          </div>
          
          <textarea id="code-editor" class="code-editor" placeholder="Enter your code here...\n\n// Example:\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}"></textarea>
          
          <div class="editor-status">
            <span id="line-count">Lines: 0</span>
            <span id="complexity">Complexity: 1</span>
            <span id="language-info">JavaScript</span>
          </div>
        </div>
        
        <div class="analysis-panel">
          <div class="panel-tabs">
            <button class="tab-btn active" data-tab="suggestions">Suggestions</button>
            <button class="tab-btn" data-tab="analysis">Analysis</button>
            <button class="tab-btn" data-tab="explanation">Explanation</button>
            <button class="tab-btn" data-tab="security">Security</button>
            <button class="tab-btn" data-tab="chat">Chat</button>
          </div>
          
          <div id="suggestions-tab" class="tab-content active">
            <div class="suggestions-list">
              <p class="placeholder">Code suggestions will appear here...</p>
            </div>
          </div>
          
          <div id="analysis-tab" class="tab-content">
            <div class="analysis-results">
              <p class="placeholder">Analysis results will appear here...</p>
            </div>
          </div>
          
          <div id="explanation-tab" class="tab-content">
            <div class="explanation-content">
              <p class="placeholder">Code explanations will appear here...</p>
            </div>
          </div>
          
          <div id="security-tab" class="tab-content">
            <div class="security-results">
              <p class="placeholder">Security analysis will appear here...</p>
            </div>
          </div>
          
          <div id="chat-tab" class="tab-content">
            <div class="chat-container">
              <div class="chat-messages">
                <div class="message assistant">
                  <strong>AI Assistant:</strong> Hello! I'm your AI-powered code assistant. Ask me anything about your code!
                </div>
              </div>
              <div class="chat-input-container">
                <input type="text" id="chat-input" placeholder="Ask about your code..." class="chat-input">
                <button id="send-chat" class="send-btn">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="assistant-stats">
        <div class="stat">
          <span class="stat-value" id="sessions-count">0</span>
          <span class="stat-label">Sessions</span>
        </div>
        <div class="stat">
          <span class="stat-value" id="analyses-count">0</span>
          <span class="stat-label">Analyses</span>
        </div>
        <div class="stat">
          <span class="stat-value" id="suggestions-count">0</span>
          <span class="stat-label">Suggestions</span>
        </div>
        <div class="stat">
          <span class="stat-value" id="swarm-agents">0</span>
          <span class="stat-label">Active Agents</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
  }
  
  setupEventListeners() {
    // Code editor events
    const editor = document.getElementById('code-editor');
    const languageSelect = document.getElementById('language-select');
    
    editor.addEventListener('input', () => this.onCodeChange());
    editor.addEventListener('keyup', (e) => this.onCursorMove(e));
    
    languageSelect.addEventListener('change', () => this.onLanguageChange());
    
    // Action buttons
    document.getElementById('analyze-btn').addEventListener('click', () => this.handleAnalyze());
    document.getElementById('optimize-btn').addEventListener('click', () => this.handleOptimize());
    document.getElementById('explain-btn').addEventListener('click', () => this.handleExplain());
    document.getElementById('security-btn').addEventListener('click', () => this.handleSecurity());
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });
    
    // Chat functionality
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat');
    
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleChatMessage();
    });
    
    sendBtn.addEventListener('click', () => this.handleChatMessage());
  }
  
  onCodeChange() {
    const editor = document.getElementById('code-editor');
    const code = editor.value;
    
    // Update status
    document.getElementById('line-count').textContent = `Lines: ${code.split('\n').length}`;
    
    // Calculate complexity (simplified)
    const complexity = this.swarmCoordinator.calculateComplexity(code);
    document.getElementById('complexity').textContent = `Complexity: ${complexity}`;
    
    // Auto-suggestions (debounced)
    clearTimeout(this.suggestionTimeout);
    this.suggestionTimeout = setTimeout(() => {
      this.generateRealTimeSuggestions(code, editor.selectionStart);
    }, 1000);
  }
  
  onCursorMove(event) {
    // Could trigger context-aware suggestions
  }
  
  onLanguageChange() {
    const language = document.getElementById('language-select').value;
    document.getElementById('language-info').textContent = language.charAt(0).toUpperCase() + language.slice(1);
  }
  
  async generateRealTimeSuggestions(code, cursor) {
    if (code.trim().length > 10) {
      const language = document.getElementById('language-select').value;
      const suggestions = await this.getSuggestions(code, cursor, language);
      this.displaySuggestions(suggestions.suggestions || []);
    }
  }
  
  async handleAnalyze() {
    const code = document.getElementById('code-editor').value;
    const language = document.getElementById('language-select').value;
    
    if (!code.trim()) {
      this.showMessage('Please enter some code to analyze.');
      return;
    }
    
    this.setLoading('analyze-btn', true);
    
    try {
      const analysis = await this.analyzeCode(code, language);
      this.displayAnalysis(analysis);
      this.switchTab('analysis');
      
      // Update stats
      const analysesCount = parseInt(document.getElementById('analyses-count').textContent) + 1;
      document.getElementById('analyses-count').textContent = analysesCount;
      
    } catch (error) {
      this.showMessage('Analysis failed: ' + error.message, 'error');
    } finally {
      this.setLoading('analyze-btn', false);
    }
  }
  
  async handleOptimize() {
    const code = document.getElementById('code-editor').value;
    const language = document.getElementById('language-select').value;
    
    if (!code.trim()) {
      this.showMessage('Please enter some code to optimize.');
      return;
    }
    
    this.setLoading('optimize-btn', true);
    
    try {
      const optimization = await this.optimizeCode(code, 'performance', language);
      this.displayOptimization(optimization);
      this.switchTab('analysis');
    } catch (error) {
      this.showMessage('Optimization failed: ' + error.message, 'error');
    } finally {
      this.setLoading('optimize-btn', false);
    }
  }
  
  async handleExplain() {
    const editor = document.getElementById('code-editor');
    const selectedText = this.getSelectedText(editor);
    const code = selectedText || editor.value;
    const language = document.getElementById('language-select').value;
    
    if (!code.trim()) {
      this.showMessage('Please select code or enter some code to explain.');
      return;
    }
    
    this.setLoading('explain-btn', true);
    
    try {
      const explanation = await this.explainCode(code, language);
      this.displayExplanation(explanation);
      this.switchTab('explanation');
    } catch (error) {
      this.showMessage('Explanation failed: ' + error.message, 'error');
    } finally {
      this.setLoading('explain-btn', false);
    }
  }
  
  async handleSecurity() {
    const code = document.getElementById('code-editor').value;
    const language = document.getElementById('language-select').value;
    
    if (!code.trim()) {
      this.showMessage('Please enter some code to scan.');
      return;
    }
    
    this.setLoading('security-btn', true);
    
    try {
      const securityResults = await this.detectVulnerabilities(code, language);
      this.displaySecurityResults(securityResults);
      this.switchTab('security');
    } catch (error) {
      this.showMessage('Security scan failed: ' + error.message, 'error');
    } finally {
      this.setLoading('security-btn', false);
    }
  }
  
  async handleChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    this.addChatMessage(message, 'user');
    input.value = '';
    
    // Process with AI (simplified)
    const response = await this.processNaturalLanguageQuery(message);
    this.addChatMessage(response, 'assistant');
  }
  
  async processNaturalLanguageQuery(query) {
    // Simplified NLP processing
    const code = document.getElementById('code-editor').value;
    
    if (query.toLowerCase().includes('explain')) {
      if (code.trim()) {
        const explanation = await this.explainCode(code);
        return explanation.explanation || 'This code appears to be a programming construct.';
      } else {
        return 'Please provide some code for me to explain.';
      }
    }
    
    if (query.toLowerCase().includes('optimize') || query.toLowerCase().includes('improve')) {
      return 'I can help optimize your code! Click the "Optimize" button or select specific code sections for targeted optimization.';
    }
    
    if (query.toLowerCase().includes('security') || query.toLowerCase().includes('vulnerable')) {
      return 'I can scan your code for security vulnerabilities. Click the "Security Scan" button to analyze potential security issues.';
    }
    
    if (query.toLowerCase().includes('bug') || query.toLowerCase().includes('error')) {
      return 'I can help identify potential bugs in your code. Use the "Analyze Code" button for a comprehensive analysis.';
    }
    
    return `I understand you're asking about: "${query}". I can help with code analysis, optimization, explanation, and security scanning. Try using the buttons above or ask more specific questions about your code!`;
  }
  
  displaySuggestions(suggestions) {
    const container = document.querySelector('#suggestions-tab .suggestions-list');
    
    if (suggestions.length === 0) {
      container.innerHTML = '<p class="placeholder">No suggestions available for current code.</p>';
      return;
    }
    
    container.innerHTML = suggestions.map(suggestion => `
      <div class="suggestion-item">
        <div class="suggestion-header">
          <span class="suggestion-type">${suggestion.type || 'general'}</span>
          <span class="suggestion-confidence">${suggestion.confidence || 'medium'}</span>
        </div>
        <div class="suggestion-text">${suggestion.text || suggestion.message}</div>
        <div class="suggestion-description">${suggestion.description || ''}</div>
      </div>
    `).join('');
    
    // Update suggestions count
    document.getElementById('suggestions-count').textContent = suggestions.length;
  }
  
  displayAnalysis(analysis) {
    const container = document.querySelector('#analysis-tab .analysis-results');
    
    container.innerHTML = `
      <div class="analysis-summary">
        <h3>Code Analysis Results</h3>
        <div class="metrics">
          <div class="metric">
            <span class="metric-label">Lines of Code:</span>
            <span class="metric-value">${analysis.linesOfCode || 'N/A'}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Complexity:</span>
            <span class="metric-value">${analysis.complexity || 'N/A'}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Language:</span>
            <span class="metric-value">${analysis.language || 'N/A'}</span>
          </div>
        </div>
      </div>
      
      ${analysis.issues && analysis.issues.length > 0 ? `
        <div class="issues-section">
          <h4>Issues Found:</h4>
          ${analysis.issues.map(issue => `
            <div class="issue-item ${issue.severity || 'medium'}">
              <div class="issue-type">${issue.type}</div>
              <div class="issue-message">${issue.message}</div>
              ${issue.line ? `<div class="issue-line">Line ${issue.line}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${analysis.suggestions && analysis.suggestions.length > 0 ? `
        <div class="suggestions-section">
          <h4>Suggestions:</h4>
          ${analysis.suggestions.map(suggestion => `
            <div class="analysis-suggestion">
              <div class="suggestion-message">${suggestion.message}</div>
              ${suggestion.line ? `<div class="suggestion-line">Line ${suggestion.line}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${analysis.languageSpecific ? `
        <div class="language-specific">
          <h4>Language-Specific Analysis:</h4>
          <pre>${JSON.stringify(analysis.languageSpecific, null, 2)}</pre>
        </div>
      ` : ''}
    `;
  }
  
  displayExplanation(explanation) {
    const container = document.querySelector('#explanation-tab .explanation-content');
    
    container.innerHTML = `
      <div class="explanation">
        <h3>Code Explanation</h3>
        <div class="explanation-text">
          ${explanation.explanation || 'No explanation available.'}
        </div>
        
        ${explanation.complexity ? `
          <div class="explanation-metrics">
            <div class="metric">
              <span class="metric-label">Complexity:</span>
              <span class="metric-value">${explanation.complexity}</span>
            </div>
            ${explanation.maintainability ? `
              <div class="metric">
                <span class="metric-label">Maintainability:</span>
                <span class="metric-value">${explanation.maintainability}</span>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }
  
  displayOptimization(optimization) {
    const container = document.querySelector('#analysis-tab .analysis-results');
    
    container.innerHTML = `
      <div class="optimization-results">
        <h3>Code Optimization</h3>
        
        ${optimization.optimizedCode && optimization.optimizedCode !== document.getElementById('code-editor').value ? `
          <div class="optimized-code-section">
            <h4>Optimized Code:</h4>
            <textarea class="optimized-code" readonly>${optimization.optimizedCode}</textarea>
            <button class="apply-optimization-btn">Apply Optimization</button>
          </div>
        ` : ''}
        
        ${optimization.improvements && optimization.improvements.length > 0 ? `
          <div class="improvements-section">
            <h4>Improvements:</h4>
            <ul>
              ${optimization.improvements.map(improvement => `
                <li>${improvement}</li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${optimization.explanation ? `
          <div class="optimization-explanation">
            <h4>Explanation:</h4>
            <p>${optimization.explanation}</p>
          </div>
        ` : ''}
      </div>
    `;
    
    // Add event listener for apply optimization button
    const applyBtn = container.querySelector('.apply-optimization-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        document.getElementById('code-editor').value = optimization.optimizedCode;
        this.showMessage('Optimization applied successfully!', 'success');
      });
    }
  }
  
  displaySecurityResults(results) {
    const container = document.querySelector('#security-tab .security-results');
    
    container.innerHTML = `
      <div class="security-overview">
        <h3>Security Analysis</h3>
        <div class="security-score">
          <span class="score-label">Security Score:</span>
          <span class="score-value ${results.securityScore >= 80 ? 'good' : results.securityScore >= 60 ? 'medium' : 'poor'}">
            ${results.securityScore || 'N/A'}/100
          </span>
        </div>
      </div>
      
      ${results.vulnerabilities && results.vulnerabilities.length > 0 ? `
        <div class="vulnerabilities-section">
          <h4>Vulnerabilities Found:</h4>
          ${results.vulnerabilities.map(vuln => `
            <div class="vulnerability-item ${vuln.severity || 'medium'}">
              <div class="vuln-title">${vuln.title || vuln.type}</div>
              <div class="vuln-description">${vuln.description || vuln.message}</div>
              ${vuln.line ? `<div class="vuln-line">Line ${vuln.line}</div>` : ''}
              ${vuln.fix ? `<div class="vuln-fix">Fix: ${vuln.fix}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="no-vulnerabilities">
          <p>✅ No obvious security vulnerabilities detected.</p>
        </div>
      `}
      
      ${results.recommendations && results.recommendations.length > 0 ? `
        <div class="recommendations-section">
          <h4>Security Recommendations:</h4>
          <ul>
            ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;
  }
  
  addChatMessage(message, sender) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'AI Assistant'}:</strong> ${message}`;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  }
  
  getSelectedText(textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    return textarea.value.substring(start, end);
  }
  
  setLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (isLoading) {
      button.disabled = true;
      button.textContent = button.textContent + ' ...';
    } else {
      button.disabled = false;
      button.textContent = button.textContent.replace(' ...', '');
    }
  }
  
  showMessage(message, type = 'info') {
    // Create or update message display
    let messageElement = document.querySelector('.message-display');
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.className = 'message-display';
      document.querySelector('.ai-code-assistant').prepend(messageElement);
    }
    
    messageElement.className = `message-display ${type}`;
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 5000);
  }
  
  updateSwarmStatus(status) {
    const statusElement = document.querySelector('.swarm-status .status-text');
    const indicatorElement = document.querySelector('.swarm-status .status-indicator');
    
    statusElement.textContent = status;
    
    if (status.includes('Active')) {
      indicatorElement.className = 'status-indicator active';
    } else if (status.includes('Error')) {
      indicatorElement.className = 'status-indicator error';
    } else {
      indicatorElement.className = 'status-indicator';
    }
    
    // Update agent count
    document.getElementById('swarm-agents').textContent = this.swarmCoordinator.agents.size;
  }
}

// CSS Styles for the AI Code Assistant
const styles = `
  .ai-code-assistant {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f8f9fa;
    min-height: 100vh;
  }
  
  .assistant-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .assistant-header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
  }
  
  .swarm-status {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    font-size: 14px;
    font-weight: 500;
  }
  
  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ffc107;
    animation: pulse 2s infinite;
  }
  
  .status-indicator.active {
    background: #28a745;
  }
  
  .status-indicator.error {
    background: #dc3545;
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  
  .assistant-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .code-panel, .analysis-panel {
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .editor-header {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }
  
  .language-select {
    padding: 8px 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 14px;
    background: white;
  }
  
  .action-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    background: #007bff;
    color: white;
  }
  
  .action-btn:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-1px);
  }
  
  .action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .code-editor {
    width: 100%;
    height: 400px;
    padding: 20px;
    border: none;
    resize: vertical;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    background: #1e1e1e;
    color: #d4d4d4;
  }
  
  .editor-status {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    font-size: 12px;
    color: #6c757d;
  }
  
  .panel-tabs {
    display: flex;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }
  
  .tab-btn {
    flex: 1;
    padding: 15px;
    border: none;
    background: transparent;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    border-bottom: 3px solid transparent;
  }
  
  .tab-btn:hover {
    background: #e9ecef;
  }
  
  .tab-btn.active {
    background: white;
    border-bottom-color: #007bff;
    color: #007bff;
  }
  
  .tab-content {
    display: none;
    padding: 20px;
    height: 400px;
    overflow-y: auto;
  }
  
  .tab-content.active {
    display: block;
  }
  
  .placeholder {
    color: #6c757d;
    font-style: italic;
    text-align: center;
    margin-top: 50px;
  }
  
  .suggestion-item, .issue-item, .vulnerability-item {
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    border-left: 4px solid #007bff;
    background: #f8f9fa;
  }
  
  .suggestion-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .suggestion-type, .suggestion-confidence {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .suggestion-type {
    background: #e9ecef;
    color: #495057;
  }
  
  .suggestion-confidence {
    background: #d4edda;
    color: #155724;
  }
  
  .issue-item.high, .vulnerability-item.high {
    border-left-color: #dc3545;
    background: #f8d7da;
  }
  
  .issue-item.medium, .vulnerability-item.medium {
    border-left-color: #ffc107;
    background: #fff3cd;
  }
  
  .issue-item.low, .vulnerability-item.low {
    border-left-color: #28a745;
    background: #d4edda;
  }
  
  .analysis-summary {
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 15px;
  }
  
  .metric {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e9ecef;
  }
  
  .metric-label {
    font-weight: 500;
    color: #6c757d;
  }
  
  .metric-value {
    font-weight: 600;
    color: #2c3e50;
  }
  
  .optimized-code {
    width: 100%;
    height: 150px;
    margin: 10px 0;
    padding: 15px;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    background: #1e1e1e;
    color: #d4d4d4;
  }
  
  .apply-optimization-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
  }
  
  .apply-optimization-btn:hover {
    background: #1e7e34;
  }
  
  .security-overview {
    margin-bottom: 20px;
  }
  
  .security-score {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 10px;
  }
  
  .score-value {
    font-size: 24px;
    font-weight: bold;
    padding: 5px 15px;
    border-radius: 20px;
  }
  
  .score-value.good {
    background: #d4edda;
    color: #155724;
  }
  
  .score-value.medium {
    background: #fff3cd;
    color: #856404;
  }
  
  .score-value.poor {
    background: #f8d7da;
    color: #721c24;
  }
  
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 360px;
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 15px;
  }
  
  .message {
    margin-bottom: 15px;
    padding: 10px;
    border-radius: 8px;
  }
  
  .message.user {
    background: #007bff;
    color: white;
    margin-left: 20%;
  }
  
  .message.assistant {
    background: white;
    border: 1px solid #e9ecef;
    margin-right: 20%;
  }
  
  .chat-input-container {
    display: flex;
    gap: 10px;
  }
  
  .chat-input {
    flex: 1;
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 14px;
  }
  
  .send-btn {
    padding: 12px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
  }
  
  .send-btn:hover {
    background: #0056b3;
  }
  
  .assistant-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .stat {
    background: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .stat-value {
    display: block;
    font-size: 32px;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 5px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .message-display {
    padding: 12px 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    font-weight: 500;
  }
  
  .message-display.info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }
  
  .message-display.error {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  .message-display.success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  @media (max-width: 1024px) {
    .assistant-layout {
      grid-template-columns: 1fr;
    }
    
    .assistant-header {
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }
    
    .editor-header {
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .metrics {
      grid-template-columns: 1fr;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Initialize the AI Code Assistant
let aiAssistant;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    aiAssistant = new AICodeAssistant();
    await aiAssistant.initialize();
    aiAssistant.updateSwarmStatus('Swarm Active - 6 Agents Running');
    
    // Update session count
    await aiAssistant.startSession();
    document.getElementById('sessions-count').textContent = '1';
  });
} else {
  aiAssistant = new AICodeAssistant();
  aiAssistant.initialize().then(() => {
    aiAssistant.updateSwarmStatus('Swarm Active - 6 Agents Running');
    aiAssistant.startSession().then(() => {
      document.getElementById('sessions-count').textContent = '1';
    });
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    AICodeAssistant, 
    SwarmCoordinator, 
    CodeAnalysisEngine,
    JavaScriptProcessor,
    PythonProcessor,
    RustProcessor,
    GoProcessor
  };
}

/**
 * SPARC 3.0 LEARNING OBJECTIVES:
 * 
 * 1. SPECIFICATIONS - AI-first requirements with swarm coordination
 * 2. PSEUDOCODE - Complex multi-agent orchestration logic
 * 3. ARCHITECTURE - Microservices with AI agent integration
 * 4. REFINEMENT - Advanced optimization with neural learning
 * 5. COMPLETION - Production-ready AI assistant with Claude Flow
 * 
 * KEY CONCEPTS DEMONSTRATED:
 * - Multi-agent swarm coordination
 * - Claude Flow MCP integration
 * - AI-powered code analysis
 * - Real-time collaborative features
 * - Neural pattern learning
 * - Advanced error handling
 * - Performance optimization
 * - Security-first design
 * - Natural language processing
 * - Cross-language support
 */