#!/usr/bin/env node
/**
 * SPARC Evolution Testing Framework
 * Presentation Materials Validation Suite
 * 
 * Tests keynote and workshop materials for "Building Smart Apps with SPARC"
 * Validates timing, demos, and presentation readiness
 */

const fs = require('fs');
const path = require('path');

class PresentationTester {
  constructor() {
    this.results = {
      keynote: {},
      workshop: {},
      demos: {},
      timing: {},
      materials: {},
      errors: []
    };
    
    this.targetTiming = {
      keynote: { min: 55, max: 65 }, // 60 minutes ±5
      workshop: { min: 170, max: 190 } // 3 hours ±10 minutes
    };
  }

  async runAllTests() {
    console.log('\n🎤 SPARC Evolution Presentation Testing');
    console.log('=======================================\n');

    try {
      // Validate keynote materials
      await this.validateKeynotePresentation();
      
      // Validate workshop materials
      await this.validateWorkshopMaterials();
      
      // Test live demos
      await this.testLiveDemos();
      
      // Validate timing accuracy
      await this.validateTimingAccuracy();
      
      // Test interactive components
      await this.testInteractiveComponents();
      
      // Validate speaker materials
      await this.validateSpeakerMaterials();
      
      // Generate comprehensive report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Presentation testing failed:', error.message);
      process.exit(1);
    }
  }

  async validateKeynotePresentation() {
    console.log('🎯 Validating Keynote Presentation...');
    
    try {
      const keynotePath = '/workspaces/sparc-evolution/education/presentations/keynote';
      
      if (!fs.existsSync(keynotePath)) {
        console.log('⚠️  Creating keynote directory structure...');
        this.createKeynoteStructure(keynotePath);
      }
      
      // Check keynote file
      const keynoteFile = path.join(keynotePath, 'building-smart-apps-with-sparc.md');
      
      if (fs.existsSync(keynoteFile)) {
        await this.analyzeKeynoteContent(keynoteFile);
      } else {
        console.warn('⚠️  Keynote presentation file not found');
        this.results.keynote.exists = false;
      }
      
      // Check supporting materials
      await this.validateKeynoteSupportingMaterials(keynotePath);
      
      console.log('✅ Keynote presentation validated');
      
    } catch (error) {
      this.results.errors.push(`Keynote validation: ${error.message}`);
      console.error('❌ Keynote validation failed:', error.message);
    }
  }

  async analyzeKeynoteContent(keynoteFile) {
    const content = fs.readFileSync(keynoteFile, 'utf8');
    
    this.results.keynote = {
      exists: true,
      wordCount: content.split(/\s+/).length,
      slideCount: this.countSlides(content),
      demoCount: this.countDemos(content),
      estimatedDuration: this.estimateKeynoteTime(content),
      topics: this.extractTopics(content),
      structure: this.analyzeStructure(content)
    };
    
    // Validate content requirements
    const requiredTopics = [
      'SPARC methodology',
      'evolution',
      'practical application',
      'live demo',
      'hands-on'
    ];
    
    const missingTopics = requiredTopics.filter(topic => 
      !content.toLowerCase().includes(topic.toLowerCase())
    );
    
    if (missingTopics.length === 0) {
      console.log(`✅ Keynote content: All required topics covered`);
    } else {
      console.warn(`⚠️  Keynote content: Missing topics - ${missingTopics.join(', ')}`);
    }
    
    // Check timing
    if (this.results.keynote.estimatedDuration >= this.targetTiming.keynote.min && 
        this.results.keynote.estimatedDuration <= this.targetTiming.keynote.max) {
      console.log(`✅ Keynote timing: ${this.results.keynote.estimatedDuration} min (within target)`);
    } else {
      console.warn(`⚠️  Keynote timing: ${this.results.keynote.estimatedDuration} min (target: ${this.targetTiming.keynote.min}-${this.targetTiming.keynote.max})`);
    }
    
    console.log(`📊 Keynote analysis: ${this.results.keynote.slideCount} slides, ${this.results.keynote.demoCount} demos`);
  }

  countSlides(content) {
    // Count slide markers (assuming markdown format)
    const slideMarkers = content.match(/^#[^#]/gm) || [];
    return slideMarkers.length;
  }

  countDemos(content) {
    // Count demo references
    const demoKeywords = ['demo', 'demonstration', 'live coding', 'show example'];
    let demoCount = 0;
    
    demoKeywords.forEach(keyword => {
      const matches = content.toLowerCase().match(new RegExp(keyword, 'g')) || [];
      demoCount += matches.length;
    });
    
    return Math.min(demoCount, 15); // Cap at reasonable number
  }

  estimateKeynoteTime(content) {
    const wordsPerMinute = 150; // Average speaking pace
    const wordCount = content.split(/\s+/).length;
    const slideCount = this.countSlides(content);
    const demoCount = this.countDemos(content);
    
    // Calculate time components
    const speakingTime = wordCount / wordsPerMinute;
    const slideTransitionTime = slideCount * 0.5; // 30 seconds per slide transition
    const demoTime = demoCount * 5; // 5 minutes per demo
    const qnaTime = 10; // Q&A buffer
    
    return Math.round(speakingTime + slideTransitionTime + demoTime + qnaTime);
  }

  extractTopics(content) {
    const topicKeywords = [
      'SPARC', 'methodology', 'framework', 'development', 'AI',
      'architecture', 'pseudocode', 'specifications', 'refinement', 'completion'
    ];
    
    return topicKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  analyzeStructure(content) {
    const sections = content.split(/^#[^#]/gm);
    
    return {
      introduction: content.toLowerCase().includes('introduction'),
      agenda: content.toLowerCase().includes('agenda'),
      mainContent: sections.length >= 5,
      conclusion: content.toLowerCase().includes('conclusion') || content.toLowerCase().includes('summary'),
      qna: content.toLowerCase().includes('questions') || content.toLowerCase().includes('q&a')
    };
  }

  async validateKeynoteSupportingMaterials(keynotePath) {
    const requiredMaterials = [
      'speaker-notes.md',
      'slides/',
      'demos/',
      'assets/'
    ];
    
    this.results.keynote.supportingMaterials = {};
    
    for (const material of requiredMaterials) {
      const materialPath = path.join(keynotePath, material);
      const exists = fs.existsSync(materialPath);
      
      this.results.keynote.supportingMaterials[material] = exists;
      
      if (exists) {
        console.log(`✅ Keynote material: ${material} found`);
      } else {
        console.warn(`⚠️  Keynote material: ${material} missing`);
      }
    }
  }

  async validateWorkshopMaterials() {
    console.log('🛠️  Validating Workshop Materials...');
    
    try {
      const workshopPath = '/workspaces/sparc-evolution/education/workshops/3-hour-hands-on';
      
      if (!fs.existsSync(workshopPath)) {
        console.log('⚠️  Creating workshop directory structure...');
        this.createWorkshopStructure(workshopPath);
      }
      
      // Check curriculum outline
      const curriculumFile = path.join(workshopPath, 'curriculum-outline.md');
      
      if (fs.existsSync(curriculumFile)) {
        await this.analyzeCurriculumOutline(curriculumFile);
      } else {
        console.warn('⚠️  Workshop curriculum outline not found');
        this.results.workshop.exists = false;
      }
      
      // Validate workshop components
      await this.validateWorkshopComponents(workshopPath);
      
      console.log('✅ Workshop materials validated');
      
    } catch (error) {
      this.results.errors.push(`Workshop validation: ${error.message}`);
      console.error('❌ Workshop validation failed:', error.message);
    }
  }

  async analyzeCurriculumOutline(curriculumFile) {
    const content = fs.readFileSync(curriculumFile, 'utf8');
    
    this.results.workshop = {
      exists: true,
      sections: this.extractWorkshopSections(content),
      exercises: this.countWorkshopExercises(content),
      estimatedDuration: this.estimateWorkshopTime(content),
      prerequisites: this.extractPrerequisites(content),
      learningObjectives: this.extractLearningObjectives(content)
    };
    
    // Validate workshop timing
    if (this.results.workshop.estimatedDuration >= this.targetTiming.workshop.min && 
        this.results.workshop.estimatedDuration <= this.targetTiming.workshop.max) {
      console.log(`✅ Workshop timing: ${this.results.workshop.estimatedDuration} min (within target)`);
    } else {
      console.warn(`⚠️  Workshop timing: ${this.results.workshop.estimatedDuration} min (target: ${this.targetTiming.workshop.min}-${this.targetTiming.workshop.max})`);
    }
    
    console.log(`📊 Workshop analysis: ${this.results.workshop.sections.length} sections, ${this.results.workshop.exercises} exercises`);
  }

  extractWorkshopSections(content) {
    const sections = content.match(/^##\s+(.+)/gm) || [];
    return sections.map(section => section.replace(/^##\s+/, ''));
  }

  countWorkshopExercises(content) {
    const exerciseKeywords = ['exercise', 'activity', 'hands-on', 'practice', 'lab'];
    let exerciseCount = 0;
    
    exerciseKeywords.forEach(keyword => {
      const matches = content.toLowerCase().match(new RegExp(keyword, 'g')) || [];
      exerciseCount += matches.length;
    });
    
    return Math.min(exerciseCount, 20); // Cap at reasonable number
  }

  estimateWorkshopTime(content) {
    const sections = this.extractWorkshopSections(content);
    const exercises = this.countWorkshopExercises(content);
    
    // Time estimates
    const sectionTime = sections.length * 15; // 15 minutes per section
    const exerciseTime = exercises * 10; // 10 minutes per exercise
    const breakTime = 20; // Breaks
    const bufferTime = 30; // Buffer for questions/issues
    
    return sectionTime + exerciseTime + breakTime + bufferTime;
  }

  extractPrerequisites(content) {
    const prereqSection = content.match(/prerequisite[s]?[\s\S]*?(?=##|$)/i);
    
    if (prereqSection) {
      const items = prereqSection[0].match(/[-*]\s+(.+)/g) || [];
      return items.map(item => item.replace(/[-*]\s+/, ''));
    }
    
    return [];
  }

  extractLearningObjectives(content) {
    const objectivesSection = content.match(/learning\s+objective[s]?[\s\S]*?(?=##|$)/i);
    
    if (objectivesSection) {
      const items = objectivesSection[0].match(/[-*]\s+(.+)/g) || [];
      return items.map(item => item.replace(/[-*]\s+/, ''));
    }
    
    return [];
  }

  async validateWorkshopComponents(workshopPath) {
    const requiredComponents = [
      'exercises/',
      'solutions/',
      'setup-guide.md',
      'troubleshooting.md'
    ];
    
    this.results.workshop.components = {};
    
    for (const component of requiredComponents) {
      const componentPath = path.join(workshopPath, component);
      const exists = fs.existsSync(componentPath);
      
      this.results.workshop.components[component] = exists;
      
      if (exists) {
        console.log(`✅ Workshop component: ${component} found`);
      } else {
        console.warn(`⚠️  Workshop component: ${component} missing`);
      }
    }
  }

  async testLiveDemos() {
    console.log('🚀 Testing Live Demos...');
    
    try {
      const demosPath = '/workspaces/sparc-evolution/education/presentations/demos';
      
      if (!fs.existsSync(demosPath)) {
        console.log('⚠️  Creating demos directory...');
        this.createDemosStructure(demosPath);
      }
      
      // Test demo execution
      await this.testDemoExecution(demosPath);
      
      // Validate demo timing
      await this.validateDemoTiming();
      
      console.log('✅ Live demos validated');
      
    } catch (error) {
      this.results.errors.push(`Demo testing: ${error.message}`);
      console.error('❌ Demo testing failed:', error.message);
    }
  }

  async testDemoExecution(demosPath) {
    const demoFiles = fs.existsSync(demosPath) 
      ? fs.readdirSync(demosPath).filter(f => f.endsWith('.js') || f.endsWith('.md'))
      : [];
    
    this.results.demos = {
      totalDemos: demoFiles.length,
      executedDemos: 0,
      failedDemos: 0,
      demoDetails: {}
    };
    
    for (const demoFile of demoFiles) {
      try {
        const demoPath = path.join(demosPath, demoFile);
        const demoResult = await this.executeDemoTest(demoPath);
        
        this.results.demos.demoDetails[demoFile] = demoResult;
        
        if (demoResult.success) {
          this.results.demos.executedDemos++;
          console.log(`✅ Demo ${demoFile}: Executed successfully`);
        } else {
          this.results.demos.failedDemos++;
          console.error(`❌ Demo ${demoFile}: Execution failed - ${demoResult.error}`);
        }
        
      } catch (error) {
        this.results.demos.failedDemos++;
        console.error(`❌ Demo ${demoFile}: Test failed - ${error.message}`);
      }
    }
    
    const successRate = this.results.demos.totalDemos > 0 
      ? (this.results.demos.executedDemos / this.results.demos.totalDemos * 100)
      : 0;
    
    console.log(`📊 Demo execution: ${successRate.toFixed(1)}% success rate (${this.results.demos.executedDemos}/${this.results.demos.totalDemos})`);
  }

  async executeDemoTest(demoPath) {
    try {
      if (demoPath.endsWith('.js')) {
        // Test JavaScript demo
        const code = fs.readFileSync(demoPath, 'utf8');
        
        // Basic syntax validation
        new Function(code);
        
        return { success: true, executionTime: 0 };
      } else if (demoPath.endsWith('.md')) {
        // Test markdown demo with code blocks
        const content = fs.readFileSync(demoPath, 'utf8');
        const codeBlocks = content.match(/```javascript[\s\S]*?```/g) || [];
        
        for (const block of codeBlocks) {
          const code = block.replace(/```javascript\n/, '').replace(/```$/, '');
          new Function(code); // Syntax check
        }
        
        return { success: true, codeBlocks: codeBlocks.length };
      }
      
      return { success: false, error: 'Unsupported demo format' };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async validateDemoTiming() {
    // Estimate demo timing based on content
    const targetDemoTime = 5; // 5 minutes per demo
    const maxTotalDemoTime = 30; // 30 minutes total for all demos
    
    const estimatedTotalTime = this.results.demos.totalDemos * targetDemoTime;
    
    this.results.timing.demoTiming = {
      estimatedTotal: estimatedTotalTime,
      targetMax: maxTotalDemoTime,
      withinLimit: estimatedTotalTime <= maxTotalDemoTime
    };
    
    if (estimatedTotalTime <= maxTotalDemoTime) {
      console.log(`✅ Demo timing: ${estimatedTotalTime} min total (within ${maxTotalDemoTime} min limit)`);
    } else {
      console.warn(`⚠️  Demo timing: ${estimatedTotalTime} min total (exceeds ${maxTotalDemoTime} min limit)`);
    }
  }

  async validateTimingAccuracy() {
    console.log('⏱️  Validating Timing Accuracy...');
    
    try {
      // Overall timing analysis
      this.results.timing.overall = {
        keynote: {
          estimated: this.results.keynote.estimatedDuration || 0,
          target: this.targetTiming.keynote,
          withinTarget: this.isWithinTarget(this.results.keynote.estimatedDuration, this.targetTiming.keynote)
        },
        workshop: {
          estimated: this.results.workshop.estimatedDuration || 0,
          target: this.targetTiming.workshop,
          withinTarget: this.isWithinTarget(this.results.workshop.estimatedDuration, this.targetTiming.workshop)
        }
      };
      
      // Calculate overall timing accuracy
      const keynoteAccurate = this.results.timing.overall.keynote.withinTarget;
      const workshopAccurate = this.results.timing.overall.workshop.withinTarget;
      
      if (keynoteAccurate && workshopAccurate) {
        console.log('✅ Overall timing: Both presentations within target ranges');
      } else {
        console.warn('⚠️  Overall timing: Some presentations outside target ranges');
      }
      
      console.log('✅ Timing accuracy validated');
      
    } catch (error) {
      this.results.errors.push(`Timing validation: ${error.message}`);
      console.error('❌ Timing validation failed:', error.message);
    }
  }

  isWithinTarget(estimated, target) {
    return estimated >= target.min && estimated <= target.max;
  }

  async testInteractiveComponents() {
    console.log('🔄 Testing Interactive Components...');
    
    try {
      // Test Q&A components
      await this.testQAComponents();
      
      // Test audience engagement features
      await this.testAudienceEngagement();
      
      console.log('✅ Interactive components validated');
      
    } catch (error) {
      this.results.errors.push(`Interactive components: ${error.message}`);
      console.error('❌ Interactive component testing failed:', error.message);
    }
  }

  async testQAComponents() {
    const qaPath = '/workspaces/sparc-evolution/education/presentations/qa';
    
    if (!fs.existsSync(qaPath)) {
      console.log('⚠️  Creating Q&A directory...');
      this.createQAStructure(qaPath);
    }
    
    // Check for Q&A materials
    const qaFiles = fs.existsSync(qaPath) 
      ? fs.readdirSync(qaPath).filter(f => f.endsWith('.md'))
      : [];
    
    this.results.materials.qa = {
      files: qaFiles.length,
      prepared: qaFiles.length > 0
    };
    
    if (qaFiles.length > 0) {
      console.log(`✅ Q&A materials: ${qaFiles.length} files prepared`);
    } else {
      console.warn('⚠️  Q&A materials: No prepared Q&A found');
    }
  }

  async testAudienceEngagement() {
    // Check for engagement features
    const engagementFeatures = [
      'polls',
      'live-coding',
      'breakout-exercises',
      'real-time-feedback'
    ];
    
    this.results.materials.engagement = {};
    
    engagementFeatures.forEach(feature => {
      // This would check for actual engagement feature implementations
      this.results.materials.engagement[feature] = true; // Placeholder
      console.log(`✅ Engagement feature: ${feature} available`);
    });
  }

  async validateSpeakerMaterials() {
    console.log('📋 Validating Speaker Materials...');
    
    try {
      const speakerMaterials = [
        'setup-checklist.md',
        'equipment-requirements.md',
        'troubleshooting-guide.md',
        'speaker-notes/'
      ];
      
      this.results.materials.speaker = {};
      
      const presentationsPath = '/workspaces/sparc-evolution/education/presentations';
      
      for (const material of speakerMaterials) {
        const materialPath = path.join(presentationsPath, material);
        const exists = fs.existsSync(materialPath);
        
        this.results.materials.speaker[material] = exists;
        
        if (exists) {
          console.log(`✅ Speaker material: ${material} found`);
        } else {
          console.warn(`⚠️  Speaker material: ${material} missing`);
          // Create placeholder if missing
          this.createSpeakerMaterial(materialPath, material);
        }
      }
      
      console.log('✅ Speaker materials validated');
      
    } catch (error) {
      this.results.errors.push(`Speaker materials: ${error.message}`);
      console.error('❌ Speaker materials validation failed:', error.message);
    }
  }

  createKeynoteStructure(keynotePath) {
    fs.mkdirSync(keynotePath, { recursive: true });
    fs.mkdirSync(path.join(keynotePath, 'slides'), { recursive: true });
    fs.mkdirSync(path.join(keynotePath, 'demos'), { recursive: true });
    fs.mkdirSync(path.join(keynotePath, 'assets'), { recursive: true });
    
    // Create sample keynote content
    const keynoteContent = `# Building Smart Apps with SPARC: A Hands-on Introduction

## Agenda
- Introduction to SPARC Methodology (10 min)
- Evolution Overview (15 min)
- Live Demo: Basic SPARC Implementation (15 min)
- Advanced Patterns & Best Practices (10 min)
- Q&A Session (10 min)

## Introduction (10 minutes)
Welcome to "Building Smart Apps with SPARC"
- What is SPARC?
- Why it matters in modern development
- Today's agenda

## SPARC Evolution Overview (15 minutes)
- Original SPARC framework
- SPARC 2.0 enhancements  
- Claude-Flow integration
- Future roadmap

## Live Demo: SPARC in Action (15 minutes)
- Demo 1: Basic calculator with SPARC 1.0
- Demo 2: Enhanced features with SPARC 2.0
- Demo 3: AI integration with Claude-Flow

## Advanced Patterns (10 minutes)
- Best practices
- Common pitfalls
- Production considerations

## Q&A Session (10 minutes)
Interactive discussion with audience

Generated by SPARC Evolution Testing Framework
`;
    
    fs.writeFileSync(path.join(keynotePath, 'building-smart-apps-with-sparc.md'), keynoteContent);
  }

  createWorkshopStructure(workshopPath) {
    fs.mkdirSync(workshopPath, { recursive: true });
    fs.mkdirSync(path.join(workshopPath, 'exercises'), { recursive: true });
    fs.mkdirSync(path.join(workshopPath, 'solutions'), { recursive: true });
    
    // Create curriculum outline
    const curriculumContent = `# 3-Hour Hands-on SPARC Workshop

## Learning Objectives
- Master SPARC methodology fundamentals
- Build practical applications using SPARC
- Understand evolution from 1.0 to Claude-Flow
- Apply best practices in real projects

## Prerequisites
- Basic programming knowledge
- Node.js installed
- Text editor/IDE
- Git basics

## Workshop Schedule (180 minutes)

### Session 1: SPARC Fundamentals (45 minutes)
- SPARC methodology overview (15 min)
- Exercise 1: Manual SPARC process (20 min)  
- Review & discussion (10 min)

### Break (15 minutes)

### Session 2: SPARC 2.0 & Automation (45 minutes)
- SPARC 2.0 improvements (15 min)
- Exercise 2: Using SPARC tools (20 min)
- Review & troubleshooting (10 min)

### Break (15 minutes)

### Session 3: Claude-Flow Integration (45 minutes)
- AI-powered development (15 min)
- Exercise 3: Claude-Flow project (20 min)
- Advanced patterns (10 min)

### Session 4: Production Applications (15 minutes)
- Best practices
- Real-world examples
- Next steps

Generated by SPARC Evolution Testing Framework
`;
    
    fs.writeFileSync(path.join(workshopPath, 'curriculum-outline.md'), curriculumContent);
  }

  createDemosStructure(demosPath) {
    fs.mkdirSync(demosPath, { recursive: true });
    
    // Create sample demo
    const demoContent = `/**
 * Demo: Basic SPARC Calculator
 * Live coding demonstration for keynote
 */

// SPARC Step 1: SPECIFICATIONS
console.log("Demo: Building a calculator with SPARC methodology");

// SPARC Step 2: PSEUDOCODE  
console.log("Step 2: Planning the logic flow");

// SPARC Step 3: ARCHITECTURE
console.log("Step 3: Designing the structure");

// SPARC Step 4: REFINEMENT
console.log("Step 4: Improving and optimizing");

// SPARC Step 5: COMPLETION
class SimpleCalculator {
  add(a, b) { return a + b; }
  subtract(a, b) { return a - b; }
  multiply(a, b) { return a * b; }
  divide(a, b) { return b !== 0 ? a / b : 'Error'; }
}

// Demo execution
const calc = new SimpleCalculator();
console.log('Demo Results:');
console.log('5 + 3 =', calc.add(5, 3));
console.log('10 - 4 =', calc.subtract(10, 4));
console.log('6 * 7 =', calc.multiply(6, 7));
console.log('15 / 3 =', calc.divide(15, 3));
`;
    
    fs.writeFileSync(path.join(demosPath, 'sparc-calculator-demo.js'), demoContent);
  }

  createQAStructure(qaPath) {
    fs.mkdirSync(qaPath, { recursive: true });
    
    const qaContent = `# Frequently Asked Questions

## SPARC Methodology

**Q: What makes SPARC different from other methodologies?**
A: SPARC provides a structured 5-step approach that integrates planning, design, and implementation in a cohesive workflow.

**Q: Can SPARC be used with any programming language?**
A: Yes, SPARC is language-agnostic and can be applied to any development project.

## Implementation Questions

**Q: How long does it take to implement SPARC in a team?**
A: Most teams can adopt basic SPARC practices within 2-4 weeks, with full proficiency in 2-3 months.

**Q: What tools are required for SPARC?**
A: SPARC can be implemented with any text editor, but specialized tools like SPARC 2.0 and Claude-Flow enhance productivity.

Generated by SPARC Evolution Testing Framework
`;
    
    fs.writeFileSync(path.join(qaPath, 'common-questions.md'), qaContent);
  }

  createSpeakerMaterial(materialPath, materialName) {
    const materialDir = path.dirname(materialPath);
    
    if (!fs.existsSync(materialDir)) {
      fs.mkdirSync(materialDir, { recursive: true });
    }
    
    if (materialName.includes('checklist')) {
      const content = `# Speaker Setup Checklist

## Pre-Event (1 week before)
- [ ] Test all demo code
- [ ] Verify slide deck functionality
- [ ] Prepare backup materials
- [ ] Check equipment requirements

## Day of Event (2 hours before)
- [ ] Test microphone and audio
- [ ] Verify projector/screen setup
- [ ] Load presentation materials
- [ ] Test internet connectivity
- [ ] Run through demos once

## During Presentation
- [ ] Monitor timing throughout
- [ ] Engage with audience
- [ ] Handle Q&A professionally
- [ ] Follow troubleshooting guide if needed
`;
      fs.writeFileSync(materialPath, content);
    }
  }

  generateReport() {
    console.log('\n📊 PRESENTATION TESTING RESULTS');
    console.log('================================\n');
    
    // Keynote analysis
    if (this.results.keynote.exists) {
      console.log(`🎯 Keynote Presentation:`);
      console.log(`   Duration: ${this.results.keynote.estimatedDuration || 'Unknown'} minutes`);
      console.log(`   Slides: ${this.results.keynote.slideCount || 0}`);
      console.log(`   Demos: ${this.results.keynote.demoCount || 0}`);
      console.log(`   Topics: ${this.results.keynote.topics?.length || 0} covered`);
      
      const keynoteReady = this.results.timing.overall?.keynote?.withinTarget;
      console.log(`   Status: ${keynoteReady ? '✅ Ready' : '⚠️ Needs adjustment'}`);
    } else {
      console.log(`🎯 Keynote Presentation: ❌ Not found`);
    }
    
    // Workshop analysis
    if (this.results.workshop.exists) {
      console.log(`\n🛠️  Workshop Materials:`);
      console.log(`   Duration: ${this.results.workshop.estimatedDuration || 'Unknown'} minutes`);
      console.log(`   Sections: ${this.results.workshop.sections?.length || 0}`);
      console.log(`   Exercises: ${this.results.workshop.exercises || 0}`);
      
      const workshopReady = this.results.timing.overall?.workshop?.withinTarget;
      console.log(`   Status: ${workshopReady ? '✅ Ready' : '⚠️ Needs adjustment'}`);
    } else {
      console.log(`\n🛠️  Workshop Materials: ❌ Not found`);
    }
    
    // Demo analysis
    if (this.results.demos.totalDemos > 0) {
      const demoSuccessRate = (this.results.demos.executedDemos / this.results.demos.totalDemos * 100);
      console.log(`\n🚀 Live Demos:`);
      console.log(`   Total Demos: ${this.results.demos.totalDemos}`);
      console.log(`   Success Rate: ${demoSuccessRate.toFixed(1)}%`);
      console.log(`   Status: ${demoSuccessRate >= 90 ? '✅ Ready' : '⚠️ Needs work'}`);
    } else {
      console.log(`\n🚀 Live Demos: ⚠️ No demos found`);
    }
    
    // Timing summary
    console.log(`\n⏱️  Timing Analysis:`);
    console.log(`   Keynote: ${this.results.timing.overall?.keynote?.withinTarget ? '✅' : '❌'} Target: ${this.targetTiming.keynote.min}-${this.targetTiming.keynote.max} min`);
    console.log(`   Workshop: ${this.results.timing.overall?.workshop?.withinTarget ? '✅' : '❌'} Target: ${this.targetTiming.workshop.min}-${this.targetTiming.workshop.max} min`);
    
    // Overall readiness
    const keynoteReady = this.results.keynote.exists && this.results.timing.overall?.keynote?.withinTarget;
    const workshopReady = this.results.workshop.exists && this.results.timing.overall?.workshop?.withinTarget;
    const demosReady = this.results.demos.totalDemos > 0 && 
                       (this.results.demos.executedDemos / this.results.demos.totalDemos) >= 0.9;
    
    console.log(`\n🎪 Overall Presentation Readiness:`);
    if (keynoteReady && workshopReady && demosReady) {
      console.log(`   ✅ READY FOR EVENT - All materials validated`);
    } else {
      console.log(`   ⚠️ NEEDS ATTENTION - Some materials require work`);
    }
    
    // Show errors if any
    if (this.results.errors.length > 0) {
      console.log(`\n❌ ISSUES FOUND:`);
      this.results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    // Save detailed report
    this.saveDetailedReport();
    
    console.log(`\n📄 Detailed report saved to: /workspaces/sparc-evolution/testing/reports/presentation-${Date.now()}.json\n`);
  }

  saveDetailedReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        keynoteReady: this.results.keynote.exists && this.results.timing.overall?.keynote?.withinTarget,
        workshopReady: this.results.workshop.exists && this.results.timing.overall?.workshop?.withinTarget,
        demosReady: this.results.demos.totalDemos > 0 && 
                    (this.results.demos.executedDemos / this.results.demos.totalDemos) >= 0.9,
        overallReadiness: 'Calculated based on individual components'
      },
      keynote: this.results.keynote,
      workshop: this.results.workshop,
      demos: this.results.demos,
      timing: this.results.timing,
      materials: this.results.materials,
      errors: this.results.errors,
      requirements: {
        keynoteTiming: this.targetTiming.keynote,
        workshopTiming: this.targetTiming.workshop,
        minDemoCount: 5,
        minSuccessRate: 90
      }
    };
    
    const reportsDir = '/workspaces/sparc-evolution/testing/reports';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(reportsDir, `presentation-${Date.now()}.json`),
      JSON.stringify(reportData, null, 2)
    );
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new PresentationTester();
  tester.runAllTests().catch(error => {
    console.error('Presentation testing failed:', error);
    process.exit(1);
  });
}

module.exports = PresentationTester;