/**
 * TaskFlow - Vanilla JavaScript Application Logic
 * 
 * Includes task CRUD operations, statistics calculation,
 * filter & search handling, inline task editing,
 * and localStorage persistence.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // State & Configuration
  // =========================================================================
  const STORAGE_KEY = 'taskflow_tasks_v1';
  
  let state = {
    tasks: [],
    filter: 'all', // 'all' | 'active' | 'completed'
    searchQuery: '',
    editingId: null
  };

  // Sample tasks loaded if user has no stored tasks
  const DEFAULT_TASKS = [
    {
      id: 1700000000001,
      title: 'Explore TaskFlow dashboard features',
      completed: true,
      priority: 'high',
      createdAt: 'Today'
    },
    {
      id: 1700000000002,
      title: 'Complete project documentation',
      completed: false,
      priority: 'medium',
      createdAt: 'Today'
    },
    {
      id: 1700000000003,
      title: 'Design high-converting landing page',
      completed: false,
      priority: 'low',
      createdAt: 'Today'
    }
  ];

  // =========================================================================
  // DOM Elements
  // =========================================================================
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const prioritySelect = document.getElementById('prioritySelect');
  const tasksContainer = document.getElementById('tasksContainer');
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');

  // Stats elements
  const statTotal = document.getElementById('statTotal');
  const statActive = document.getElementById('statActive');
  const statCompleted = document.getElementById('statCompleted');
  const progressPercent = document.getElementById('progressPercent');
  const progressFill = document.getElementById('progressFill');

  // Date elements
  const currentDayEl = document.getElementById('currentDay');
  const currentDateEl = document.getElementById('currentDate');

  // =========================================================================
  // Application Initialization
  // =========================================================================
  function init() {
    setupHeaderDate();
    loadTasks();
    setupEventListeners();
    render();
  }

  /**
   * Sets up real-time date and day in the header
   */
  function setupHeaderDate() {
    const now = new Date();
    const dayOptions = { weekday: 'long' };
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };

    currentDayEl.textContent = now.toLocaleDateString('en-US', dayOptions);
    currentDateEl.textContent = now.toLocaleDateString('en-US', dateOptions);
  }

  // =========================================================================
  // Storage Handlers
  // =========================================================================
  
  /**
   * Loads tasks from localStorage or uses default tasks on first launch
   */
  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        state.tasks = JSON.parse(stored);
      } else {
        state.tasks = DEFAULT_TASKS;
        saveTasks();
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
      state.tasks = [];
    }
  }

  /**
   * Saves current state tasks to localStorage
   */
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }

  // =========================================================================
  // Event Listeners Setup
  // =========================================================================
  function setupEventListeners() {
    // Form submission to add new task
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleAddTask();
    });

    // Search input field live filtering
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      render();
    });

    // Filter tab switching
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        state.filter = btn.dataset.filter;
        render();
      });
    });

    // Clear completed tasks button
    clearCompletedBtn.addEventListener('click', handleClearCompleted);
  }

  // =========================================================================
  // Task Operations (Add, Toggle, Delete, Edit, Clear)
  // =========================================================================

  /**
   * Adds a new task with validation and error visual effect
   */
  function handleAddTask() {
    const title = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (!title) {
      // Shake input wrapper if empty
      taskInput.parentElement.classList.add('shake');
      setTimeout(() => taskInput.parentElement.classList.remove('shake'), 400);
      taskInput.focus();
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title,
      completed: false,
      priority: priority,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };

    state.tasks.unshift(newTask);
    saveTasks();

    // Reset input
    taskInput.value = '';
    taskInput.focus();

    render();
  }

  /**
   * Toggles task completion state
   * @param {number} id 
   */
  function toggleTask(id) {
    state.tasks = state.tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    saveTasks();
    render();
  }

  /**
   * Deletes a task with smooth exit animation
   * @param {number} id 
   * @param {HTMLElement} itemEl 
   */
  function deleteTask(id, itemEl) {
    if (itemEl) {
      itemEl.classList.add('removing');
      setTimeout(() => {
        state.tasks = state.tasks.filter(task => task.id !== id);
        saveTasks();
        render();
      }, 250);
    } else {
      state.tasks = state.tasks.filter(task => task.id !== id);
      saveTasks();
      render();
    }
  }

  /**
   * Enters inline edit mode for a given task ID
   * @param {number} id 
   */
  function startEdit(id) {
    state.editingId = id;
    render();
  }

  /**
   * Saves edited task title
   * @param {number} id 
   * @param {string} newTitle 
   */
  function saveEdit(id, newTitle) {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      state.editingId = null;
      render();
      return;
    }

    state.tasks = state.tasks.map(task => {
      if (task.id === id) {
        return { ...task, title: trimmed };
      }
      return task;
    });

    state.editingId = null;
    saveTasks();
    render();
  }

  /**
   * Cancels inline editing
   */
  function cancelEdit() {
    state.editingId = null;
    render();
  }

  /**
   * Removes all completed tasks
   */
  function handleClearCompleted() {
    state.tasks = state.tasks.filter(task => !task.completed);
    saveTasks();
    render();
  }

  // =========================================================================
  // Statistics & Progress Logic
  // =========================================================================
  function updateStats() {
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.completed).length;
    const active = total - completed;

    statTotal.textContent = total;
    statActive.textContent = active;
    statCompleted.textContent = completed;

    // Calculate completion percentage
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    progressPercent.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;

    // Enable/Disable Clear Completed button
    clearCompletedBtn.disabled = completed === 0;
  }

  // =========================================================================
  // Rendering & Template Builders
  // =========================================================================

  /**
   * Main render function that filters and updates DOM
   */
  function render() {
    updateStats();
    tasksContainer.innerHTML = '';

    // Filter tasks based on selected tab and search query
    const filteredTasks = state.tasks.filter(task => {
      // Tab filter
      if (state.filter === 'active' && task.completed) return false;
      if (state.filter === 'completed' && !task.completed) return false;

      // Search filter
      if (state.searchQuery && !task.title.toLowerCase().includes(state.searchQuery)) {
        return false;
      }

      return true;
    });

    // Handle Empty State
    if (filteredTasks.length === 0) {
      renderEmptyState();
      return;
    }

    // Render each task item
    filteredTasks.forEach(task => {
      if (state.editingId === task.id) {
        tasksContainer.appendChild(createEditTaskNode(task));
      } else {
        tasksContainer.appendChild(createTaskNode(task));
      }
    });
  }

  /**
   * Renders empty state message when no tasks match current filter/search
   */
  function renderEmptyState() {
    let emptyTitle = 'No tasks found';
    let emptySubtitle = 'Get started by creating a new task above!';

    if (state.searchQuery) {
      emptyTitle = 'No matching tasks';
      emptySubtitle = `No results found for "${state.searchQuery}". Try a different keyword.`;
    } else if (state.filter === 'active') {
      emptyTitle = 'No active tasks';
      emptySubtitle = 'Awesome job! You have completed all active tasks.';
    } else if (state.filter === 'completed') {
      emptyTitle = 'No completed tasks';
      emptySubtitle = 'Completed tasks will appear here once you finish them.';
    }

    const emptyNode = document.createElement('div');
    emptyNode.className = 'empty-state';
    emptyNode.innerHTML = `
      <div class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8"></path>
        </svg>
      </div>
      <div class="empty-title">${escapeHTML(emptyTitle)}</div>
      <div class="empty-subtitle">${escapeHTML(emptySubtitle)}</div>
    `;
    tasksContainer.appendChild(emptyNode);
  }

  /**
   * Creates DOM element for a standard task item
   * @param {Object} task 
   * @returns {HTMLElement}
   */
  function createTaskNode(task) {
    const item = document.createElement('div');
    item.className = `task-item ${task.completed ? 'completed' : ''}`;
    item.dataset.id = task.id;

    // Checkbox container
    const leftGroup = document.createElement('div');
    leftGroup.className = 'task-left';

    const checkboxLabel = document.createElement('label');
    checkboxLabel.className = 'checkbox-container';
    
    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.checked = task.completed;
    checkboxInput.addEventListener('change', () => toggleTask(task.id));

    const checkmarkSpan = document.createElement('span');
    checkmarkSpan.className = 'checkmark';
    checkmarkSpan.innerHTML = `
      <svg viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    checkboxLabel.appendChild(checkboxInput);
    checkboxLabel.appendChild(checkmarkSpan);

    // Task content (Title & Metadata)
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const titleEl = document.createElement('div');
    titleEl.className = 'task-title';
    titleEl.textContent = task.title;
    titleEl.title = 'Double-click to edit';
    titleEl.addEventListener('dblclick', () => startEdit(task.id));

    const metaEl = document.createElement('div');
    metaEl.className = 'task-meta';
    metaEl.innerHTML = `
      <span class="priority-badge ${task.priority}">${task.priority}</span>
      <span>&bull;</span>
      <span>${task.createdAt || 'Today'}</span>
    `;

    taskContent.appendChild(titleEl);
    taskContent.appendChild(metaEl);

    leftGroup.appendChild(checkboxLabel);
    leftGroup.appendChild(taskContent);

    // Action buttons group (Edit & Delete)
    const actionsGroup = document.createElement('div');
    actionsGroup.className = 'task-actions';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit';
    editBtn.title = 'Edit task';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    `;
    editBtn.addEventListener('click', () => startEdit(task.id));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete';
    deleteBtn.title = 'Delete task';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
    deleteBtn.addEventListener('click', () => deleteTask(task.id, item));

    actionsGroup.appendChild(editBtn);
    actionsGroup.appendChild(deleteBtn);

    item.appendChild(leftGroup);
    item.appendChild(actionsGroup);

    return item;
  }

  /**
   * Creates DOM element for inline task editing mode
   * @param {Object} task 
   * @returns {HTMLElement}
   */
  function createEditTaskNode(task) {
    const item = document.createElement('div');
    item.className = 'task-item editing';
    item.dataset.id = task.id;

    const editForm = document.createElement('form');
    editForm.className = 'edit-form';

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = task.title;

    // Save button
    const saveBtn = document.createElement('button');
    saveBtn.type = 'submit';
    saveBtn.className = 'action-btn edit';
    saveBtn.title = 'Save edit';
    saveBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'action-btn delete';
    cancelBtn.title = 'Cancel edit';
    cancelBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;

    cancelBtn.addEventListener('click', cancelEdit);

    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveEdit(task.id, editInput.value);
    });

    // Handle Escape key to cancel
    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        cancelEdit();
      }
    });

    editForm.appendChild(editInput);
    editForm.appendChild(saveBtn);
    editForm.appendChild(cancelBtn);

    item.appendChild(editForm);

    // Auto focus and select input text
    setTimeout(() => {
      editInput.focus();
      editInput.select();
    }, 0);

    return item;
  }

  // Helper utility function for HTML escaping
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Initialize Application
  init();
});
