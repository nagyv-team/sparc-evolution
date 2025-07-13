# SPARC Platform MCP Server

## 🔌 Overview

The SPARC Platform MCP (Model Context Protocol) Server provides programmatic access to the SPARC Evolution Platform through Claude Code. This enables seamless integration for managing assessments, tracking learning progress, and interacting with platform features.

## 🚀 Features

- **Platform Health Monitoring** - Check system status and performance
- **Playground Management** - Create sessions and execute SPARC methodology code
- **Assessment System** - Create and manage certification assessments
- **Learning Analytics** - Track user progress and platform usage
- **Content Management** - Retrieve and update educational content
- **Data Export** - Export platform data for analysis

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to SPARC Evolution Platform (running on port 3002)

### Setup Steps

1. **Install Dependencies**
   ```bash
   cd mcp-server
   npm install
   ```

2. **Configure Environment** (Optional)
   ```bash
   # Create .env file if needed
   echo "SPARC_PLATFORM_URL=http://localhost:3002" > .env
   ```

3. **Test MCP Server**
   ```bash
   npm start
   ```

## 🔧 Claude Code Integration

### Method 1: Direct Integration (Recommended)

1. **Add MCP Server to Claude Code**
   ```bash
   # From the mcp-server directory
   claude mcp add sparc-platform node sparc-platform-mcp.js
   ```

2. **Verify Installation**
   ```bash
   claude mcp list
   # Should show: sparc-platform
   ```

3. **Test Integration**
   ```bash
   # In Claude Code, you can now use MCP tools like:
   # - get_platform_health
   # - create_playground_session  
   # - create_assessment
   ```

### Method 2: Manual Configuration

Add to your Claude Code MCP configuration file:

```json
{
  "mcpServers": {
    "sparc-platform": {
      "command": "node",
      "args": ["/path/to/sparc-evolution/mcp-server/sparc-platform-mcp.js"],
      "env": {
        "SPARC_PLATFORM_URL": "http://localhost:3002"
      }
    }
  }
}
```

## 🛠️ Available Tools

### Platform Management
- **`get_platform_health`** - Check platform status and health
- **`get_platform_statistics`** - Comprehensive usage statistics
- **`export_platform_data`** - Export data for analysis

### Playground Operations
- **`create_playground_session`** - Create new SPARC practice session
- **`execute_sparc_code`** - Run code with SPARC methodology validation
- **`get_playground_progress`** - Track session progress

### Assessment System
- **`create_assessment`** - Create certification assessments
- **`get_assessment_results`** - Retrieve assessment outcomes

### Learning & Analytics
- **`get_learning_analytics`** - User progress and platform metrics
- **`get_sparc_content`** - Retrieve educational content

### Content Management
- **`update_platform_content`** - Update educational materials (admin)

## 📚 Usage Examples

### Example 1: Check Platform Health
```javascript
// In Claude Code, use the MCP tool:
get_platform_health()

// Returns:
{
  "status": "success",
  "health": {
    "status": "healthy",
    "timestamp": "2025-07-13T00:00:00.000Z",
    "platform": "SPARC Evolution Interactive",
    "features": ["playground", "assessment", "learning", "certification"]
  }
}
```

### Example 2: Create Playground Session
```javascript
create_playground_session({
  "userId": "user123",
  "skillLevel": "beginner"
})

// Returns session ID for further interactions
```

### Example 3: Execute SPARC Code
```javascript
execute_sparc_code({
  "sessionId": "session_abc123",
  "code": "/**\n * SPECIFICATIONS\n * Problem: Build a calculator\n * Requirements: Add, subtract, multiply, divide\n */",
  "step": "specifications"
})

// Returns execution results with SPARC methodology feedback
```

### Example 4: Create Assessment
```javascript
create_assessment({
  "userId": "user123", 
  "level": "practitioner"
})

// Creates a new SPARC Practitioner certification assessment
```

### Example 5: Get Analytics
```javascript
get_learning_analytics({
  "timeframe": "7d"
})

// Returns comprehensive learning analytics for the past week
```

## 🔧 Configuration Options

### Environment Variables
- **`SPARC_PLATFORM_URL`** - Platform base URL (default: http://localhost:3002)
- **`MCP_LOG_LEVEL`** - Logging level (default: info)

### Platform URLs
- **Local Development**: `http://localhost:3002`
- **Codespace**: `https://humble-computing-machine-7qqrqvpjqgcx446-3002.app.github.dev/`

## 🐛 Troubleshooting

### Common Issues

1. **"Connection Refused"**
   - Ensure SPARC platform is running on port 3002
   - Check platform URL in configuration
   
2. **"Tool Not Found"**
   - Verify MCP server is properly registered with Claude Code
   - Check `claude mcp list` output

3. **"Invalid Arguments"**
   - Review tool schemas and required parameters
   - Check argument types and formats

### Debug Mode
```bash
# Run with debug output
DEBUG=* npm start
```

### Health Check
```bash
# Test platform connectivity
curl http://localhost:3002/api/health
```

## 📊 Tool Reference

### Input Schemas

#### create_playground_session
```json
{
  "userId": "string (required)",
  "skillLevel": "beginner|intermediate|advanced (optional)"
}
```

#### execute_sparc_code
```json
{
  "sessionId": "string (required)",
  "code": "string (required)",
  "step": "specifications|pseudocode|architecture|refinement|completion (optional)"
}
```

#### create_assessment
```json
{
  "userId": "string (required)",
  "level": "practitioner|developer|architect|master (required)",
  "options": {
    "timeLimit": "number (optional)"
  }
}
```

## 🚀 Advanced Usage

### Batch Operations
```javascript
// Create multiple sessions for a cohort
const users = ['user1', 'user2', 'user3'];
for (const userId of users) {
  await create_playground_session({ userId, skillLevel: 'beginner' });
}
```

### Progress Tracking
```javascript
// Track learning progress across multiple sessions
const analytics = await get_learning_analytics({ timeframe: '30d' });
console.log(`Platform usage: ${analytics.totalUsers} users`);
```

### Content Updates
```javascript
// Update platform content (admin only)
await update_platform_content({
  section: 'methodology',
  content: 'Updated SPARC methodology explanation...',
  type: 'module'
});
```

## 🔐 Security Notes

- MCP server runs locally and connects to platform via HTTP
- No sensitive data stored in MCP server
- Platform API handles authentication and authorization
- All data transmission uses standard HTTP protocols

## 🆘 Support

- **Documentation**: See main project README.md
- **Platform URL**: Check PLATFORM_ACCESS.md for current URLs
- **Issues**: Report via project repository
- **API Reference**: Available through platform `/api/health` endpoint

## 📝 License

MIT License - Same as main SPARC Evolution project

---

**Ready to integrate SPARC Platform with Claude Code!** 🎉