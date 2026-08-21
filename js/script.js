/**
 * TaskFlow - Premium Dashboard & Reminders Engine
 * Includes task CRUD operations, statistics calculation,
 * filter & search handling, inline task editing,
 * personalized time-of-day greeting, Thought for the Day quote engine,
 * customizable recurring reminders engine, Web Audio chime,
 * and localStorage persistence.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // State & Configuration
  // =========================================================================
  const STORAGE_KEY = 'taskflow_tasks_v1';
  const USER_KEY = 'taskflow_username_v1';
  
  let state = {
    tasks: [],
    userName: 'Sunil',
    filter: 'all', // 'all' | 'active' | 'completed'
    searchQuery: '',
    editingId: null,
    activeAlertTaskId: null,
    currentQuoteIndex: 0
  };

  // Inspirational Quotes Database
  const MOTIVATIONAL_QUOTES = [
    { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Don't count the days, make the days count.", author: "Muhammad Ali" }
  ];

  // Sample tasks loaded if user has no stored tasks
  const DEFAULT_TASKS = [
    {
      id: 1700000000001,
      title: 'Explore TaskFlow dashboard features',
      completed: true,
      priority: 'high',
      createdAt: 'Today',
      reminder: null
    },
    {
      id: 1700000000002,
      title: 'Complete project documentation',
      completed: false,
      priority: 'medium',
      createdAt: 'Today',
      reminder: null
    },
    {
      id: 1700000000003,
      title: 'Design high-converting landing page',
      completed: false,
      priority: 'low',
      createdAt: 'Today',
      reminder: null
    }
  ];

  // =========================================================================
  // DOM Elements
  // =========================================================================
  const timeGreetingEl = document.getElementById('timeGreeting');
  const userNameBadge = document.getElementById('userNameBadge');
  
  // Thought for the Day elements
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const shuffleQuoteBtn = document.getElementById('shuffleQuoteBtn');

  // Task form elements
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

  // Reminder elements
  const enableReminderCheck = document.getElementById('enableReminderCheck');
  const reminderInputGroup = document.getElementById('reminderInputGroup');
  const reminderDateTime = document.getElementById('reminderDateTime');
  const recurrenceSelect = document.getElementById('recurrenceSelect');
  const reminderSoundCheck = document.getElementById('reminderSoundCheck');
  const notifyPermissionBtn = document.getElementById('notifyPermissionBtn');
  const notifyPermText = document.getElementById('notifyPermText');
  const remindersSection = document.getElementById('remindersSection');
  const remindersList = document.getElementById('remindersList');
  const remindersCountBadge = document.getElementById('remindersCountBadge');

  // Reminder Alert Modal elements
  const reminderModalOverlay = document.getElementById('reminderModalOverlay');
  const modalTaskTitle = document.getElementById('modalTaskTitle');
  const modalTaskTime = document.getElementById('modalTaskTime');
  const modalRecurrenceTag = document.getElementById('modalRecurrenceTag');
  const modalSnooze5Btn = document.getElementById('modalSnooze5Btn');
  const modalSnooze15Btn = document.getElementById('modalSnooze15Btn');
  const modalCompleteBtn = document.getElementById('modalCompleteBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');

  // Web Audio Context for Chimes
  let audioCtx = null;

  // =========================================================================
  // Application Initialization
  // =========================================================================
  function init() {
    loadUserData();
    setupHeaderGreetingAndDate();
    setupThoughtOfTheDay();
    loadTasks();
    setupDefaultReminderInput();
    setupEventListeners();
    updateNotificationPermissionUI();
    startReminderEngine();
    render();
  }

  /**
   * Calculates time of day and sets greeting message & user name
   */
  function setupHeaderGreetingAndDate() {
    const now = new Date();
    const hours = now.getHours();

    let greeting = 'Good Morning';
    if (hours >= 12 && hours < 17) {
      greeting = 'Good Afternoon';
    } else if (hours >= 17 && hours < 22) {
      greeting = 'Good Evening';
    } else if (hours >= 22 || hours < 5) {
      greeting = 'Good Night';
    }

    timeGreetingEl.textContent = greeting;
    userNameBadge.textContent = state.userName;

    const dayOptions = { weekday: 'long' };
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };

    currentDayEl.textContent = now.toLocaleDateString('en-US', dayOptions);
    currentDateEl.textContent = now.toLocaleDateString('en-US', dateOptions);
  }

  function loadUserData() {
    const storedName = localStorage.getItem(USER_KEY);
    if (storedName) {
      state.userName = storedName;
    }
  }

  function saveUserName(newName) {
    const trimmed = newName.trim();
    if (trimmed) {
      state.userName = trimmed;
      localStorage.setItem(USER_KEY, trimmed);
      userNameBadge.textContent = trimmed;
    }
  }

  /**
   * Sets up Thought for the Day based on day of year
   */
  function setupThoughtOfTheDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    state.currentQuoteIndex = dayOfYear % MOTIVATIONAL_QUOTES.length;
    displayQuote(state.currentQuoteIndex);
  }

  function displayQuote(index) {
    const quote = MOTIVATIONAL_QUOTES[index];
    quoteText.textContent = `"${quote.text}"`;
    quoteAuthor.textContent = `\u2014 ${quote.author}`;
  }

  function shuffleQuote() {
    state.currentQuoteIndex = (state.currentQuoteIndex + 1) % MOTIVATIONAL_QUOTES.length;
    displayQuote(state.currentQuoteIndex);
  }

  /**
   * Sets default datetime-local input value to 15 minutes in future
   */
  function setupDefaultReminderInput() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    reminderDateTime.value = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // =========================================================================
  // Storage Handlers
  // =========================================================================
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
    // Edit username on badge click
    userNameBadge.addEventListener('click', () => {
      const input = prompt('Enter your name:', state.userName);
      if (input !== null) {
        saveUserName(input);
      }
    });

    // Quote shuffle button
    shuffleQuoteBtn.addEventListener('click', shuffleQuote);

    // Form submission
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleAddTask();
    });

    // Reminder toggle checkbox
    enableReminderCheck.addEventListener('change', () => {
      if (enableReminderCheck.checked) {
        reminderInputGroup.classList.remove('hidden');
      } else {
        reminderInputGroup.classList.add('hidden');
      }
    });

    // Browser Notification permission button
    notifyPermissionBtn.addEventListener('click', requestNotificationPermission);

    // Search input
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      render();
    });

    // Filter tabs
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

    // Clear completed button
    clearCompletedBtn.addEventListener('click', handleClearCompleted);

    // Modal action buttons
    modalSnooze5Btn.addEventListener('click', () => handleSnoozeModal(5));
    modalSnooze15Btn.addEventListener('click', () => handleSnoozeModal(15));
    modalCompleteBtn.addEventListener('click', handleCompleteModalTask);
    modalDismissBtn.addEventListener('click', handleDismissModalTask);
  }

  // =========================================================================
  // Web Audio & Browser Notification Utilities
  // =========================================================================
  function playChimeSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.12);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + index * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + index * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + index * 0.12);
        osc.stop(audioCtx.currentTime + index * 0.12 + 0.45);
      });
    } catch (e) {
      console.log('Audio playback blocked or uninitialized', e);
    }
  }

  function requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        updateNotificationPermissionUI();
      });
    } else {
      alert('Desktop notifications are not supported in your browser.');
    }
  }

  function updateNotificationPermissionUI() {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      notifyPermissionBtn.classList.add('granted');
      notifyPermText.textContent = 'Alerts Active';
    } else {
      notifyPermissionBtn.classList.remove('granted');
      notifyPermText.textContent = 'Enable Alerts';
    }
  }

  function showNativeNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path></svg>'
      });
    }
  }

  // =========================================================================
  // Recurrence Calculation Helper
  // =========================================================================
  /**
   * Calculates next recurrence date based on pattern (daily, weekly, weekdays, monthly)
   * @param {string} currentISO 
   * @param {string} type 
   * @returns {string} ISOString
   */
  function calculateNextRecurrence(currentISO, type) {
    const dt = new Date(currentISO);
    
    switch (type) {
      case 'daily':
        dt.setDate(dt.getDate() + 1);
        break;
      case 'weekdays':
        do {
          dt.setDate(dt.getDate() + 1);
        } while (dt.getDay() === 0 || dt.getDay() === 6); // Skip Sun(0) & Sat(6)
        break;
      case 'weekly':
        dt.setDate(dt.getDate() + 7);
        break;
      case 'monthly':
        dt.setMonth(dt.getMonth() + 1);
        break;
      default:
        break;
    }
    return dt.toISOString();
  }

  // =========================================================================
  // Real-time Reminder Engine & Alert Ticker
  // =========================================================================
  function startReminderEngine() {
    setInterval(() => {
      checkDueReminders();
      updateRemindersSection();
    }, 1000);
  }

  function checkDueReminders() {
    const nowMs = Date.now();

    state.tasks.forEach(task => {
      if (task.completed || !task.reminder || task.reminder.triggered) return;

      const reminderMs = new Date(task.reminder.dateTime).getTime();

      if (nowMs >= reminderMs) {
        task.reminder.triggered = true;
        saveTasks();

        if (task.reminder.soundEnabled) {
          playChimeSound();
        }

        const recurrenceText = task.reminder.recurrence && task.reminder.recurrence !== 'none'
          ? ` (${task.reminder.recurrence.toUpperCase()})`
          : '';

        showNativeNotification('TaskFlow Reminder' + recurrenceText, `Time for: ${task.title}`);
        showReminderModal(task);
      }
    });
  }

  // =========================================================================
  // Reminder Modal Popup Logic
  // =========================================================================
  function showReminderModal(task) {
    state.activeAlertTaskId = task.id;
    modalTaskTitle.textContent = task.title;

    if (task.reminder.recurrence && task.reminder.recurrence !== 'none') {
      modalRecurrenceTag.textContent = `RECURRING ALERT (${task.reminder.recurrence.toUpperCase()})`;
    } else {
      modalRecurrenceTag.textContent = 'REAL-TIME REMINDER ALERT';
    }

    const formattedTime = new Date(task.reminder.dateTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    modalTaskTime.textContent = `Scheduled for ${formattedTime}`;

    reminderModalOverlay.classList.remove('hidden');
  }

  function hideReminderModal() {
    reminderModalOverlay.classList.add('hidden');
    state.activeAlertTaskId = null;
  }

  function handleSnoozeModal(minutes) {
    if (!state.activeAlertTaskId) return;

    const newDate = new Date();
    newDate.setMinutes(newDate.getMinutes() + minutes);

    state.tasks = state.tasks.map(task => {
      if (task.id === state.activeAlertTaskId) {
        return {
          ...task,
          reminder: {
            ...task.reminder,
            dateTime: newDate.toISOString(),
            triggered: false
          }
        };
      }
      return task;
    });

    saveTasks();
    hideReminderModal();
    render();
  }

  function handleCompleteModalTask() {
    if (!state.activeAlertTaskId) return;

    const targetId = state.activeAlertTaskId;
    const targetTask = state.tasks.find(t => t.id === targetId);

    // If recurring, advance reminder to next cycle instead of marking completed forever!
    if (targetTask && targetTask.reminder && targetTask.reminder.recurrence && targetTask.reminder.recurrence !== 'none') {
      const nextDate = calculateNextRecurrence(targetTask.reminder.dateTime, targetTask.reminder.recurrence);
      state.tasks = state.tasks.map(t => {
        if (t.id === targetId) {
          return {
            ...t,
            reminder: {
              ...t.reminder,
              dateTime: nextDate,
              triggered: false
            }
          };
        }
        return t;
      });
    } else {
      toggleTask(targetId);
    }

    saveTasks();
    hideReminderModal();
    render();
  }

  function handleDismissModalTask() {
    if (!state.activeAlertTaskId) return;

    const targetId = state.activeAlertTaskId;
    const targetTask = state.tasks.find(t => t.id === targetId);

    // If recurring, reschedule to next recurrence automatically!
    if (targetTask && targetTask.reminder && targetTask.reminder.recurrence && targetTask.reminder.recurrence !== 'none') {
      const nextDate = calculateNextRecurrence(targetTask.reminder.dateTime, targetTask.reminder.recurrence);
      state.tasks = state.tasks.map(t => {
        if (t.id === targetId) {
          return {
            ...t,
            reminder: {
              ...t.reminder,
              dateTime: nextDate,
              triggered: false
            }
          };
        }
        return t;
      });
      saveTasks();
    }

    hideReminderModal();
    render();
  }

  // =========================================================================
  // Task Operations (Add, Toggle, Delete, Edit, Clear)
  // =========================================================================
  function handleAddTask() {
    const title = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (!title) {
      taskInput.parentElement.classList.add('shake');
      setTimeout(() => taskInput.parentElement.classList.remove('shake'), 400);
      taskInput.focus();
      return;
    }

    let reminderObj = null;
    if (enableReminderCheck.checked && reminderDateTime.value) {
      reminderObj = {
        dateTime: new Date(reminderDateTime.value).toISOString(),
        recurrence: recurrenceSelect.value,
        soundEnabled: reminderSoundCheck.checked,
        triggered: false
      };
    }

    const newTask = {
      id: Date.now(),
      title: title,
      completed: false,
      priority: priority,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      reminder: reminderObj
    };

    state.tasks.unshift(newTask);
    saveTasks();

    // Reset input
    taskInput.value = '';
    enableReminderCheck.checked = false;
    reminderInputGroup.classList.add('hidden');
    setupDefaultReminderInput();
    taskInput.focus();

    render();
  }

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

  function removeReminderFromTask(id) {
    state.tasks = state.tasks.map(task => {
      if (task.id === id) {
        return { ...task, reminder: null };
      }
      return task;
    });

    saveTasks();
    render();
  }

  function startEdit(id) {
    state.editingId = id;
    render();
  }

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

  function cancelEdit() {
    state.editingId = null;
    render();
  }

  function handleClearCompleted() {
    state.tasks = state.tasks.filter(task => !task.completed);
    saveTasks();
    render();
  }

  // =========================================================================
  // Statistics & Upcoming Reminders Section Rendering
  // =========================================================================
  function updateStats() {
    const total = state.tasks.length;
    const completed = state.tasks.filter(t => t.completed).length;
    const active = total - completed;

    statTotal.textContent = total;
    statActive.textContent = active;
    statCompleted.textContent = completed;

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    progressPercent.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;

    clearCompletedBtn.disabled = completed === 0;
  }

  function updateRemindersSection() {
    const activeReminders = state.tasks.filter(t => !t.completed && t.reminder);

    if (activeReminders.length === 0) {
      remindersSection.classList.add('hidden');
      return;
    }

    remindersSection.classList.remove('hidden');
    remindersCountBadge.textContent = activeReminders.length;
    remindersList.innerHTML = '';

    const nowMs = Date.now();

    activeReminders.forEach(task => {
      const remDate = new Date(task.reminder.dateTime);
      const diffMs = remDate.getTime() - nowMs;
      const isDue = diffMs <= 0;

      let countdownText = 'Due now';
      if (!isDue) {
        const diffMins = Math.ceil(diffMs / (1000 * 60));
        if (diffMins < 60) {
          countdownText = `In ${diffMins} min`;
        } else {
          const diffHours = Math.floor(diffMins / 60);
          countdownText = `In ${diffHours} hr`;
        }
      }

      let recurrenceBadge = '';
      if (task.reminder.recurrence && task.reminder.recurrence !== 'none') {
        recurrenceBadge = `<span class="recurrence-badge">${task.reminder.recurrence}</span>`;
      }

      const card = document.createElement('div');
      card.className = 'reminder-card-item';
      card.innerHTML = `
        <div class="reminder-card-info">
          <div class="reminder-card-title">${escapeHTML(task.title)}</div>
          <div class="reminder-card-time">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${remDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; ${remDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            ${recurrenceBadge}
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="reminder-countdown-badge ${isDue ? 'due' : ''}">${countdownText}</span>
          <button class="action-btn delete" title="Cancel reminder">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;

      card.querySelector('.action-btn.delete').addEventListener('click', () => {
        removeReminderFromTask(task.id);
      });

      remindersList.appendChild(card);
    });
  }

  // =========================================================================
  // Rendering Tasks List
  // =========================================================================
  function render() {
    updateStats();
    updateRemindersSection();
    tasksContainer.innerHTML = '';

    const filteredTasks = state.tasks.filter(task => {
      if (state.filter === 'active' && task.completed) return false;
      if (state.filter === 'completed' && !task.completed) return false;

      if (state.searchQuery && !task.title.toLowerCase().includes(state.searchQuery)) {
        return false;
      }

      return true;
    });

    if (filteredTasks.length === 0) {
      renderEmptyState();
      return;
    }

    filteredTasks.forEach(task => {
      if (state.editingId === task.id) {
        tasksContainer.appendChild(createEditTaskNode(task));
      } else {
        tasksContainer.appendChild(createTaskNode(task));
      }
    });
  }

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
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8"></path>
        </svg>
      </div>
      <div class="empty-title">${escapeHTML(emptyTitle)}</div>
      <div class="empty-subtitle">${escapeHTML(emptySubtitle)}</div>
    `;
    tasksContainer.appendChild(emptyNode);
  }

  function createTaskNode(task) {
    const item = document.createElement('div');
    item.className = `task-item ${task.completed ? 'completed' : ''}`;
    item.dataset.id = task.id;

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

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const titleEl = document.createElement('div');
    titleEl.className = 'task-title';
    titleEl.textContent = task.title;
    titleEl.title = 'Double-click to edit';
    titleEl.addEventListener('dblclick', () => startEdit(task.id));

    const metaEl = document.createElement('div');
    metaEl.className = 'task-meta';

    let reminderHtml = '';
    if (task.reminder) {
      const remDate = new Date(task.reminder.dateTime);
      const formattedRem = `${remDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const recBadge = task.reminder.recurrence && task.reminder.recurrence !== 'none'
        ? ` <span class="recurrence-badge">${task.reminder.recurrence}</span>`
        : '';
      reminderHtml = `
        <span class="task-reminder-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          </svg>
          ${formattedRem}${recBadge}
        </span>
        <span>&bull;</span>
      `;
    }

    metaEl.innerHTML = `
      <span class="priority-badge ${task.priority}">${task.priority}</span>
      <span>&bull;</span>
      ${reminderHtml}
      <span>${task.createdAt || 'Today'}</span>
    `;

    taskContent.appendChild(titleEl);
    taskContent.appendChild(metaEl);

    leftGroup.appendChild(checkboxLabel);
    leftGroup.appendChild(taskContent);

    const actionsGroup = document.createElement('div');
    actionsGroup.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit';
    editBtn.title = 'Edit task';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    `;
    editBtn.addEventListener('click', () => startEdit(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete';
    deleteBtn.title = 'Delete task';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

    const saveBtn = document.createElement('button');
    saveBtn.type = 'submit';
    saveBtn.className = 'action-btn edit';
    saveBtn.title = 'Save edit';
    saveBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'action-btn delete';
    cancelBtn.title = 'Cancel edit';
    cancelBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;

    cancelBtn.addEventListener('click', cancelEdit);

    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveEdit(task.id, editInput.value);
    });

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        cancelEdit();
      }
    });

    editForm.appendChild(editInput);
    editForm.appendChild(saveBtn);
    editForm.appendChild(cancelBtn);

    item.appendChild(editForm);

    setTimeout(() => {
      editInput.focus();
      editInput.select();
    }, 0);

    return item;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  init();
});
