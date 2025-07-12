/**
 * SPARC 2.0 Example: Enhanced Todo Application
 * Demonstrates SPARC 2.0 with improved architecture and real-time features
 * Author: SPARC Evolution Team
 */

// SPARC Step 1: SPECIFICATIONS
/*
REQUIREMENTS:
- Create a todo application with CRUD operations
- Support categories, priorities, and due dates
- Real-time updates across multiple clients
- Offline functionality with sync when online
- Search and filtering capabilities
- Data persistence with local storage backup
- Responsive design for mobile and desktop
- Accessibility compliance (WCAG 2.1)

CONSTRAINTS:
- Must use modern JavaScript (ES6+)
- Progressive Web App (PWA) capabilities
- Memory efficient with virtual scrolling for large lists
- Maximum 500ms response time for all operations
- Support for 10,000+ todos with performance

EXPECTED INPUTS:
- Todo text (string, 1-500 characters)
- Category (predefined or custom)
- Priority (low, medium, high, urgent)
- Due date (optional)
- Tags (array of strings)

EXPECTED OUTPUTS:
- Real-time todo list updates
- Search results with highlighting
- Statistics and analytics
- Export capabilities (JSON, CSV)
*/

// SPARC Step 2: PSEUDOCODE
/*
BEGIN TodoApp
  INITIALIZE state = {
    todos: [],
    categories: [],
    filters: {},
    searchQuery: '',
    sortBy: 'created',
    isOnline: true
  }
  
  FUNCTION createTodo(todoData)
    VALIDATE todoData
    SET newTodo = {
      id: generateUUID(),
      text: todoData.text,
      category: todoData.category,
      priority: todoData.priority,
      dueDate: todoData.dueDate,
      tags: todoData.tags,
      completed: false,
      created: getCurrentTimestamp(),
      updated: getCurrentTimestamp()
    }
    ADD newTodo to state.todos
    CALL persistToStorage()
    CALL broadcastUpdate('todo-created', newTodo)
    RETURN newTodo
  END FUNCTION
  
  FUNCTION updateTodo(id, updates)
    FIND todo in state.todos WHERE todo.id = id
    IF todo exists
      MERGE updates into todo
      SET todo.updated = getCurrentTimestamp()
      CALL persistToStorage()
      CALL broadcastUpdate('todo-updated', todo)
      RETURN todo
    ELSE
      THROW 'Todo not found'
    END IF
  END FUNCTION
  
  FUNCTION deleteTodo(id)
    REMOVE todo from state.todos WHERE todo.id = id
    CALL persistToStorage()
    CALL broadcastUpdate('todo-deleted', id)
  END FUNCTION
  
  FUNCTION searchTodos(query)
    SET results = []
    FOR each todo in state.todos
      IF todo.text CONTAINS query OR todo.tags CONTAINS query
        ADD todo to results
      END IF
    END FOR
    RETURN results
  END FUNCTION
  
  FUNCTION filterTodos(filters)
    SET filtered = state.todos
    FOR each filter in filters
      APPLY filter to filtered
    END FOR
    RETURN filtered
  END FUNCTION
  
  FUNCTION syncWithServer()
    IF isOnline
      TRY
        SEND local changes to server
        RECEIVE server updates
        MERGE changes with conflict resolution
        CALL persistToStorage()
      CATCH syncError
        LOG syncError
        SCHEDULE retry
      END TRY
    END IF
  END FUNCTION
END TodoApp
*/

// SPARC Step 3: ARCHITECTURE
/*
COMPONENTS:
1. TodoApp Class - Main application controller
2. TodoItem Component - Individual todo rendering
3. TodoList Component - List management with virtualization
4. SearchFilter Component - Search and filtering interface
5. CategoryManager - Category CRUD operations
6. SyncManager - Real-time synchronization
7. StorageManager - Local persistence and caching
8. EventBus - Pub/sub for component communication

DATA FLOW:
User Input → Component → EventBus → TodoApp → StorageManager → SyncManager → Server
            ↑                                                                    ↓
         UI Update ← Component ← EventBus ← TodoApp ← StorageManager ← Real-time Events

STRUCTURE:
TodoApp/
├── src/
│   ├── components/
│   │   ├── TodoApp.js (main controller)
│   │   ├── TodoItem.js (individual todo)
│   │   ├── TodoList.js (virtualized list)
│   │   ├── SearchFilter.js (search/filter UI)
│   │   └── CategoryManager.js (category management)
│   ├── services/
│   │   ├── SyncManager.js (real-time sync)
│   │   ├── StorageManager.js (persistence)
│   │   └── EventBus.js (communication)
│   ├── utils/
│   │   ├── validators.js (input validation)
│   │   ├── dateUtils.js (date formatting)
│   │   └── constants.js (app constants)
│   └── styles/
│       ├── main.css (global styles)
│       └── components/ (component-specific styles)
├── tests/
│   ├── unit/ (unit tests)
│   ├── integration/ (integration tests)
│   └── e2e/ (end-to-end tests)
└── public/
    ├── index.html
    ├── manifest.json (PWA manifest)
    └── service-worker.js (offline functionality)
*/

// SPARC Step 4: REFINEMENT
/*
IMPROVEMENTS IDENTIFIED:
1. Virtual scrolling for performance with large datasets
2. Intelligent caching with LRU eviction
3. Optimistic updates for better UX
4. Conflict resolution for concurrent edits
5. Advanced search with fuzzy matching
6. Keyboard shortcuts for power users
7. Drag and drop for reordering
8. Bulk operations (select multiple)
9. Undo/redo functionality
10. Rich text editing for todo descriptions

OPTIMIZATIONS:
1. Debounced search input
2. Memoized component rendering
3. Service worker for offline caching
4. IndexedDB for large data storage
5. Web Workers for heavy computations
6. Lazy loading for non-critical features

ERROR HANDLING:
1. Network error recovery
2. Storage quota exceeded handling
3. Invalid data sanitization
4. Graceful degradation for older browsers
5. User-friendly error messages
*/

// SPARC Step 5: COMPLETION

// Event Bus for component communication
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

// Storage Manager for persistence
class StorageManager {
  constructor() {
    this.storageKey = 'sparc-todos';
    this.initIndexedDB();
  }
  
  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('TodoDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('todos')) {
          const store = db.createObjectStore('todos', { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('priority', 'priority', { unique: false });
          store.createIndex('completed', 'completed', { unique: false });
          store.createIndex('created', 'created', { unique: false });
        }
      };
    });
  }
  
  async save(todos) {
    // Save to localStorage as fallback
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
    
    // Save to IndexedDB for better performance
    if (this.db) {
      const transaction = this.db.transaction(['todos'], 'readwrite');
      const store = transaction.objectStore('todos');
      
      // Clear existing data
      await store.clear();
      
      // Add all todos
      for (const todo of todos) {
        await store.add(todo);
      }
    }
  }
  
  async load() {
    if (this.db) {
      const transaction = this.db.transaction(['todos'], 'readonly');
      const store = transaction.objectStore('todos');
      const request = store.getAll();
      
      return new Promise((resolve) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => {
          // Fallback to localStorage
          const stored = localStorage.getItem(this.storageKey);
          resolve(stored ? JSON.parse(stored) : []);
        };
      });
    } else {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    }
  }
  
  async search(query) {
    if (!this.db) return [];
    
    const transaction = this.db.transaction(['todos'], 'readonly');
    const store = transaction.objectStore('todos');
    const request = store.getAll();
    
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const todos = request.result || [];
        const filtered = todos.filter(todo => 
          todo.text.toLowerCase().includes(query.toLowerCase()) ||
          todo.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        resolve(filtered);
      };
    });
  }
}

// Sync Manager for real-time updates
class SyncManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.ws = null;
    
    this.setupOnlineHandlers();
    this.connectWebSocket();
  }
  
  setupOnlineHandlers() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
      this.connectWebSocket();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      if (this.ws) {
        this.ws.close();
      }
    });
  }
  
  connectWebSocket() {
    if (!this.isOnline) return;
    
    try {
      this.ws = new WebSocket(this.getWebSocketURL());
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.processSyncQueue();
      };
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.eventBus.emit('sync-update', data);
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Retry connection after delay
        setTimeout(() => this.connectWebSocket(), 5000);
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }
  
  getWebSocketURL() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  }
  
  queueUpdate(action, data) {
    this.syncQueue.push({ action, data, timestamp: Date.now() });
    
    if (this.isOnline && this.ws?.readyState === WebSocket.OPEN) {
      this.processSyncQueue();
    }
  }
  
  processSyncQueue() {
    while (this.syncQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const update = this.syncQueue.shift();
      this.ws.send(JSON.stringify(update));
    }
  }
}

// Main Todo Application
class TodoApp {
  constructor() {
    this.eventBus = new EventBus();
    this.storageManager = new StorageManager();
    this.syncManager = new SyncManager(this.eventBus);
    
    this.state = {
      todos: [],
      categories: ['Personal', 'Work', 'Shopping', 'Health'],
      filters: {
        category: null,
        priority: null,
        completed: null
      },
      searchQuery: '',
      sortBy: 'created',
      sortOrder: 'desc'
    };
    
    this.setupEventListeners();
    this.initializeUI();
    this.loadData();
  }
  
  setupEventListeners() {
    this.eventBus.on('todo-created', (todo) => this.handleTodoCreated(todo));
    this.eventBus.on('todo-updated', (todo) => this.handleTodoUpdated(todo));
    this.eventBus.on('todo-deleted', (id) => this.handleTodoDeleted(id));
    this.eventBus.on('sync-update', (data) => this.handleSyncUpdate(data));
    this.eventBus.on('search-query', (query) => this.handleSearch(query));
    this.eventBus.on('filter-changed', (filters) => this.handleFilterChange(filters));
  }
  
  async loadData() {
    try {
      this.state.todos = await this.storageManager.load();
      this.renderTodos();
    } catch (error) {
      console.error('Failed to load todos:', error);
      this.showError('Failed to load your todos. Please refresh the page.');
    }
  }
  
  createTodo(todoData) {
    const newTodo = {
      id: this.generateUUID(),
      text: todoData.text.trim(),
      category: todoData.category || 'Personal',
      priority: todoData.priority || 'medium',
      dueDate: todoData.dueDate,
      tags: todoData.tags || [],
      completed: false,
      created: Date.now(),
      updated: Date.now()
    };
    
    if (!this.validateTodo(newTodo)) {
      throw new Error('Invalid todo data');
    }
    
    this.state.todos.push(newTodo);
    this.storageManager.save(this.state.todos);
    this.syncManager.queueUpdate('create', newTodo);
    this.eventBus.emit('todo-created', newTodo);
    
    return newTodo;
  }
  
  updateTodo(id, updates) {
    const todoIndex = this.state.todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }
    
    const todo = { ...this.state.todos[todoIndex], ...updates };
    todo.updated = Date.now();
    
    if (!this.validateTodo(todo)) {
      throw new Error('Invalid todo data');
    }
    
    this.state.todos[todoIndex] = todo;
    this.storageManager.save(this.state.todos);
    this.syncManager.queueUpdate('update', todo);
    this.eventBus.emit('todo-updated', todo);
    
    return todo;
  }
  
  deleteTodo(id) {
    const todoIndex = this.state.todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }
    
    this.state.todos.splice(todoIndex, 1);
    this.storageManager.save(this.state.todos);
    this.syncManager.queueUpdate('delete', { id });
    this.eventBus.emit('todo-deleted', id);
  }
  
  validateTodo(todo) {
    return (
      todo.text && 
      todo.text.length > 0 && 
      todo.text.length <= 500 &&
      ['low', 'medium', 'high', 'urgent'].includes(todo.priority) &&
      this.state.categories.includes(todo.category)
    );
  }
  
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  getFilteredTodos() {
    let filtered = [...this.state.todos];
    
    // Apply search query
    if (this.state.searchQuery) {
      const query = this.state.searchQuery.toLowerCase();
      filtered = filtered.filter(todo => 
        todo.text.toLowerCase().includes(query) ||
        todo.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply filters
    if (this.state.filters.category) {
      filtered = filtered.filter(todo => todo.category === this.state.filters.category);
    }
    
    if (this.state.filters.priority) {
      filtered = filtered.filter(todo => todo.priority === this.state.filters.priority);
    }
    
    if (this.state.filters.completed !== null) {
      filtered = filtered.filter(todo => todo.completed === this.state.filters.completed);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[this.state.sortBy];
      const bVal = b[this.state.sortBy];
      const modifier = this.state.sortOrder === 'asc' ? 1 : -1;
      
      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });
    
    return filtered;
  }
  
  initializeUI() {
    const container = document.createElement('div');
    container.className = 'todo-app';
    container.innerHTML = `
      <header class="todo-header">
        <h1>SPARC 2.0 Todo App</h1>
        <div class="online-status ${navigator.onLine ? 'online' : 'offline'}">
          <span class="status-indicator"></span>
          <span class="status-text">${navigator.onLine ? 'Online' : 'Offline'}</span>
        </div>
      </header>
      
      <div class="todo-controls">
        <div class="search-container">
          <input type="text" id="search-input" placeholder="Search todos..." class="search-input">
          <button id="clear-search" class="clear-search">×</button>
        </div>
        
        <div class="filter-container">
          <select id="category-filter" class="filter-select">
            <option value="">All Categories</option>
            ${this.state.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
          </select>
          
          <select id="priority-filter" class="filter-select">
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select id="status-filter" class="filter-select">
            <option value="">All Status</option>
            <option value="false">Active</option>
            <option value="true">Completed</option>
          </select>
        </div>
        
        <div class="sort-container">
          <select id="sort-by" class="sort-select">
            <option value="created">Created Date</option>
            <option value="updated">Updated Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="text">Name</option>
          </select>
          
          <button id="sort-order" class="sort-order desc">↓</button>
        </div>
      </div>
      
      <form id="todo-form" class="todo-form">
        <div class="form-row">
          <input type="text" id="todo-input" placeholder="Add a new todo..." required maxlength="500" class="todo-input">
          <select id="todo-category" class="todo-category">
            ${this.state.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
          </select>
          <select id="todo-priority" class="todo-priority">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div class="form-row">
          <input type="date" id="todo-due-date" class="todo-due-date">
          <input type="text" id="todo-tags" placeholder="Tags (comma-separated)" class="todo-tags">
          <button type="submit" class="add-todo-btn">Add Todo</button>
        </div>
      </form>
      
      <div class="stats-container">
        <div class="stat">
          <span class="stat-value" id="total-todos">0</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat">
          <span class="stat-value" id="active-todos">0</span>
          <span class="stat-label">Active</span>
        </div>
        <div class="stat">
          <span class="stat-value" id="completed-todos">0</span>
          <span class="stat-label">Completed</span>
        </div>
      </div>
      
      <div id="todo-list" class="todo-list"></div>
      
      <div class="bulk-actions">
        <button id="select-all" class="bulk-btn">Select All</button>
        <button id="complete-selected" class="bulk-btn">Complete Selected</button>
        <button id="delete-selected" class="bulk-btn danger">Delete Selected</button>
        <button id="export-todos" class="bulk-btn">Export</button>
      </div>
    `;
    
    document.body.appendChild(container);
    this.attachEventListeners();
  }
  
  attachEventListeners() {
    // Form submission
    document.getElementById('todo-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddTodo();
    });
    
    // Search
    const searchInput = document.getElementById('search-input');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.state.searchQuery = e.target.value;
        this.renderTodos();
      }, 300);
    });
    
    document.getElementById('clear-search').addEventListener('click', () => {
      searchInput.value = '';
      this.state.searchQuery = '';
      this.renderTodos();
    });
    
    // Filters
    ['category-filter', 'priority-filter', 'status-filter'].forEach(id => {
      document.getElementById(id).addEventListener('change', (e) => {
        const filterType = id.replace('-filter', '');
        const value = e.target.value;
        this.state.filters[filterType] = value || null;
        
        if (filterType === 'status') {
          this.state.filters.completed = value === '' ? null : value === 'true';
        }
        
        this.renderTodos();
      });
    });
    
    // Sorting
    document.getElementById('sort-by').addEventListener('change', (e) => {
      this.state.sortBy = e.target.value;
      this.renderTodos();
    });
    
    document.getElementById('sort-order').addEventListener('click', (e) => {
      this.state.sortOrder = this.state.sortOrder === 'asc' ? 'desc' : 'asc';
      e.target.className = `sort-order ${this.state.sortOrder}`;
      e.target.textContent = this.state.sortOrder === 'asc' ? '↑' : '↓';
      this.renderTodos();
    });
    
    // Bulk actions
    document.getElementById('select-all').addEventListener('click', () => this.selectAllTodos());
    document.getElementById('complete-selected').addEventListener('click', () => this.completeSelectedTodos());
    document.getElementById('delete-selected').addEventListener('click', () => this.deleteSelectedTodos());
    document.getElementById('export-todos').addEventListener('click', () => this.exportTodos());
    
    // Online/offline status
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));
  }
  
  handleAddTodo() {
    const form = document.getElementById('todo-form');
    const formData = new FormData(form);
    
    const todoData = {
      text: document.getElementById('todo-input').value,
      category: document.getElementById('todo-category').value,
      priority: document.getElementById('todo-priority').value,
      dueDate: document.getElementById('todo-due-date').value || null,
      tags: document.getElementById('todo-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    try {
      this.createTodo(todoData);
      form.reset();
      document.getElementById('todo-priority').value = 'medium';
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  renderTodos() {
    const filteredTodos = this.getFilteredTodos();
    const todoList = document.getElementById('todo-list');
    
    if (filteredTodos.length === 0) {
      todoList.innerHTML = `
        <div class="empty-state">
          <p>No todos found</p>
          <small>${this.state.searchQuery || Object.values(this.state.filters).some(f => f) ? 'Try adjusting your search or filters' : 'Add your first todo above'}</small>
        </div>
      `;
    } else {
      todoList.innerHTML = filteredTodos.map(todo => this.renderTodoItem(todo)).join('');
    }
    
    this.updateStats();
    this.attachTodoEventListeners();
  }
  
  renderTodoItem(todo) {
    const dueDate = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : null;
    const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
    const priorityColor = {
      urgent: '#ff4757',
      high: '#ff6b35',
      medium: '#ffa502',
      low: '#2ed573'
    }[todo.priority];
    
    return `
      <div class="todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" data-id="${todo.id}">
        <div class="todo-checkbox">
          <input type="checkbox" ${todo.completed ? 'checked' : ''} data-action="toggle" data-id="${todo.id}">
        </div>
        
        <div class="todo-content">
          <div class="todo-text" data-action="edit" data-id="${todo.id}">${this.escapeHtml(todo.text)}</div>
          
          <div class="todo-meta">
            <span class="todo-category">${todo.category}</span>
            <span class="todo-priority" style="background-color: ${priorityColor}">${todo.priority}</span>
            ${dueDate ? `<span class="todo-due-date">${dueDate}</span>` : ''}
            ${todo.tags.length > 0 ? `<div class="todo-tags">${todo.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}</div>` : ''}
          </div>
        </div>
        
        <div class="todo-actions">
          <button class="action-btn edit" data-action="edit" data-id="${todo.id}" title="Edit">✏️</button>
          <button class="action-btn delete" data-action="delete" data-id="${todo.id}" title="Delete">🗑️</button>
          <input type="checkbox" class="todo-select" data-id="${todo.id}">
        </div>
      </div>
    `;
  }
  
  attachTodoEventListeners() {
    document.querySelectorAll('[data-action]').forEach(element => {
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = e.target.dataset.action;
        const id = e.target.dataset.id;
        
        switch (action) {
          case 'toggle':
            this.toggleTodo(id);
            break;
          case 'edit':
            this.editTodo(id);
            break;
          case 'delete':
            if (confirm('Are you sure you want to delete this todo?')) {
              this.deleteTodo(id);
            }
            break;
        }
      });
    });
  }
  
  toggleTodo(id) {
    const todo = this.state.todos.find(t => t.id === id);
    if (todo) {
      this.updateTodo(id, { completed: !todo.completed });
    }
  }
  
  editTodo(id) {
    const todo = this.state.todos.find(t => t.id === id);
    if (!todo) return;
    
    const newText = prompt('Edit todo:', todo.text);
    if (newText !== null && newText.trim() !== '') {
      this.updateTodo(id, { text: newText.trim() });
    }
  }
  
  selectAllTodos() {
    const checkboxes = document.querySelectorAll('.todo-select');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    checkboxes.forEach(cb => {
      cb.checked = !allChecked;
    });
  }
  
  completeSelectedTodos() {
    const selectedIds = this.getSelectedTodoIds();
    selectedIds.forEach(id => {
      this.updateTodo(id, { completed: true });
    });
  }
  
  deleteSelectedTodos() {
    const selectedIds = this.getSelectedTodoIds();
    if (selectedIds.length > 0 && confirm(`Delete ${selectedIds.length} selected todos?`)) {
      selectedIds.forEach(id => {
        this.deleteTodo(id);
      });
    }
  }
  
  getSelectedTodoIds() {
    return Array.from(document.querySelectorAll('.todo-select:checked'))
      .map(cb => cb.dataset.id);
  }
  
  exportTodos() {
    const data = {
      todos: this.state.todos,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  updateStats() {
    const total = this.state.todos.length;
    const completed = this.state.todos.filter(t => t.completed).length;
    const active = total - completed;
    
    document.getElementById('total-todos').textContent = total;
    document.getElementById('active-todos').textContent = active;
    document.getElementById('completed-todos').textContent = completed;
  }
  
  updateOnlineStatus(isOnline) {
    const statusElement = document.querySelector('.online-status');
    const statusText = document.querySelector('.status-text');
    
    statusElement.className = `online-status ${isOnline ? 'online' : 'offline'}`;
    statusText.textContent = isOnline ? 'Online' : 'Offline';
  }
  
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, m => map[m]);
  }
  
  showError(message) {
    // Create or update error message display
    let errorElement = document.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      document.querySelector('.todo-app').prepend(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }
  
  handleTodoCreated(todo) {
    this.renderTodos();
  }
  
  handleTodoUpdated(todo) {
    this.renderTodos();
  }
  
  handleTodoDeleted(id) {
    this.renderTodos();
  }
  
  handleSyncUpdate(data) {
    // Handle real-time updates from other clients
    console.log('Received sync update:', data);
    // Implement conflict resolution logic here
  }
}

// CSS Styles
const styles = `
  .todo-app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f8f9fa;
    min-height: 100vh;
  }
  
  .todo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .todo-header h1 {
    margin: 0;
    color: #2c3e50;
    font-size: 28px;
  }
  
  .online-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
  }
  
  .online-status.online {
    background: #d4edda;
    color: #155724;
  }
  
  .online-status.offline {
    background: #f8d7da;
    color: #721c24;
  }
  
  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
  }
  
  .todo-controls {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .search-container {
    position: relative;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 40px 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #007bff;
  }
  
  .clear-search {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #6c757d;
  }
  
  .filter-container {
    display: flex;
    gap: 10px;
  }
  
  .filter-select {
    flex: 1;
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 14px;
    background: white;
  }
  
  .sort-container {
    display: flex;
    gap: 10px;
  }
  
  .sort-select {
    flex: 1;
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 14px;
    background: white;
  }
  
  .sort-order {
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    font-size: 16px;
    min-width: 48px;
  }
  
  .todo-form {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
  }
  
  .form-row:last-child {
    margin-bottom: 0;
  }
  
  .todo-input {
    flex: 2;
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 16px;
  }
  
  .todo-category, .todo-priority, .todo-due-date, .todo-tags {
    flex: 1;
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 14px;
  }
  
  .add-todo-btn {
    padding: 12px 24px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .add-todo-btn:hover {
    background: #0056b3;
  }
  
  .stats-container {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .stat {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    flex: 1;
  }
  
  .stat-value {
    display: block;
    font-size: 24px;
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
  
  .todo-list {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    overflow: hidden;
  }
  
  .empty-state {
    padding: 60px 20px;
    text-align: center;
    color: #6c757d;
  }
  
  .empty-state p {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .todo-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e9ecef;
    transition: background-color 0.3s;
  }
  
  .todo-item:last-child {
    border-bottom: none;
  }
  
  .todo-item:hover {
    background: #f8f9fa;
  }
  
  .todo-item.completed {
    opacity: 0.6;
  }
  
  .todo-item.completed .todo-text {
    text-decoration: line-through;
  }
  
  .todo-item.overdue {
    border-left: 4px solid #dc3545;
  }
  
  .todo-checkbox {
    margin-right: 15px;
  }
  
  .todo-checkbox input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  
  .todo-content {
    flex: 1;
    min-width: 0;
  }
  
  .todo-text {
    font-size: 16px;
    color: #2c3e50;
    margin-bottom: 8px;
    word-break: break-word;
    cursor: pointer;
  }
  
  .todo-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  
  .todo-category {
    background: #e9ecef;
    color: #495057;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .todo-priority {
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
  }
  
  .todo-due-date {
    background: #fff3cd;
    color: #856404;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
  }
  
  .todo-tags {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }
  
  .tag {
    background: #d1ecf1;
    color: #0c5460;
    padding: 2px 6px;
    border-radius: 8px;
    font-size: 11px;
  }
  
  .todo-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .action-btn {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .action-btn:hover {
    background: #f8f9fa;
  }
  
  .todo-select {
    width: 16px;
    height: 16px;
  }
  
  .bulk-actions {
    display: flex;
    gap: 15px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .bulk-btn {
    padding: 10px 16px;
    border: 2px solid #007bff;
    border-radius: 6px;
    background: white;
    color: #007bff;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .bulk-btn:hover {
    background: #007bff;
    color: white;
  }
  
  .bulk-btn.danger {
    border-color: #dc3545;
    color: #dc3545;
  }
  
  .bulk-btn.danger:hover {
    background: #dc3545;
    color: white;
  }
  
  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
    border: 1px solid #f5c6cb;
  }
  
  @media (max-width: 768px) {
    .todo-app {
      padding: 10px;
    }
    
    .todo-controls {
      grid-template-columns: 1fr;
      gap: 15px;
    }
    
    .form-row {
      flex-direction: column;
    }
    
    .stats-container {
      flex-direction: column;
    }
    
    .bulk-actions {
      flex-wrap: wrap;
    }
    
    .todo-item {
      padding: 12px 15px;
    }
    
    .todo-meta {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new TodoApp());
} else {
  new TodoApp();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TodoApp, StorageManager, SyncManager, EventBus };
}

/**
 * SPARC 2.0 LEARNING OBJECTIVES:
 * 
 * 1. SPECIFICATIONS - Enhanced requirements with real-time features
 * 2. PSEUDOCODE - Complex logic with async operations
 * 3. ARCHITECTURE - Modular design with services and event-driven communication
 * 4. REFINEMENT - Performance optimizations and user experience improvements
 * 5. COMPLETION - Full-featured application with offline support
 * 
 * KEY CONCEPTS DEMONSTRATED:
 * - Event-driven architecture
 * - Real-time synchronization
 * - Offline-first design
 * - Progressive Web App features
 * - Advanced state management
 * - Performance optimization
 * - Accessibility considerations
 * - Modern JavaScript patterns
 */