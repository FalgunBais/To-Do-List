# TaskFlow - Premium Workspace & Daily Productivity Suite

TaskFlow is an all-in-one dark glassmorphic daily workspace application built from scratch using **HTML5, CSS3, and Vanilla JavaScript**. It combines task management, weekly scheduling, live productivity widgets, customizable real-time reminders, and dynamic time-of-day ambient themes.

![TaskFlow Header](https://img.shields.io/badge/TaskFlow-v2.0-6366f1)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 🌟 Feature Suite

### 1. 🌊 Water-Gliding Fluid Custom Cursor
- Custom glowing pointer with a spring-damped liquid follower ring that glides like water.
- Interactive expansion when hovering over buttons, cards, and inputs.
- Animated water ripple wave effect on every mouse click.

### 2. 🌅 Dynamic Time-of-Day Theme Engine
- Background atmosphere and radiant aura meshes shift automatically based on the current hour:
  - **Morning (5 AM - 12 PM)**: Sunrise golden-amber & deep indigo energy.
  - **Afternoon (12 PM - 5 PM)**: Vibrant cyan-violet daylight focus.
  - **Evening (5 PM - 9 PM)**: Sunset twilight purple & crimson-magenta ambiance.
  - **Night (9 PM - 5 AM)**: Midnight cosmic cyan calm.

### 3. ⏱️ Live Running Digital Clock
- Real-time header clock displaying hours, minutes, seconds, and AM/PM (`HH:MM:SS AM/PM`) with pulsing colon indicators.
- Live day of the week and formatted calendar date.

### 4. ⚡ Daily Activity Presets (1-Click Tasks)
- Instant task creation chips for daily routines:
  - 🏋️‍♂️ **Gym & Workout** (Strength / Cardio sessions)
  - 💻 **Work & Coding** (Deep focus coding blocks)
  - 📚 **Study & Learn** (Reading & research chapters)
  - 🧘‍♂️ **Wellness & Mind** (Mindfulness & meditation)
  - 🧹 **Daily Chores** (House cleaning & errands)

### 5. 📅 Weekly Timetable & Schedule Module
- Day-by-day scheduler tabs (**Mon**, **Tue**, **Wed**, **Thu**, **Fri**, **Sat**, **Sun**).
- Add custom routines with time slots, categories, and notification preferences.
- **1-Click "+ Task" Conversion**: Instantly transfer any scheduled routine into your active task list.

### 6. 🎯 Interactive Productivity Widgets
- **Pomodoro Focus Timer**: 25:00 countdown timer with Start, Pause, Reset, and audio chime alert upon completion.
- **Daily Mood Tracker**: Interactive mood selectors (🚀 *Energetic*, 🎯 *Focused*, ☕ *Relaxed*, 💡 *Creative*).
- **Quick Sticky Notes**: Auto-saving scratchpad for quick thoughts and ideas.

### 7. 🔔 Customizable & Recurring Real-Time Reminders
- Schedule date and time alerts per task with custom repeat rules (**Daily**, **Weekdays**, **Weekly**, **Monthly**).
- Automatic next-cycle rescheduling upon alert completion or dismissal.
- **Web Audio API Synthesizer Chimes** & native **Desktop Web Notifications**.
- Glassmorphic Alert Modal with Snooze (`5m`, `15m`), Mark Done, and Dismiss actions.

### 8. 📊 Dashboard Analytics & Task Manager
- Real-time metrics (**Total Tasks**, **Active**, **Completed**) and percentage progress bar.
- Inline task editing, completion checkboxes, status filter tabs (**All**, **Active**, **Completed**), live search, and `localStorage` persistence.

---

## 📁 Project Structure

```text
To-Do-List/
├── index.html         # Main semantic layout, widgets, timetable, header clock, alert modal
├── css/
│   └── style.css      # Multi-theme design tokens, ambient aura glows, fluid cursor, responsive grid
├── js/
│   └── script.js       # Theme engine, fluid cursor physics, live clock, widgets, timetable, reminders
└── README.md          # Documentation
```

---

## 🚀 How to Run Locally

No build steps or dependencies required.

1. Clone repository:
   ```bash
   git clone https://github.com/FalgunBais/To-Do-List.git
   ```
2. Open `index.html` directly in your browser.

Or serve with Python:
```bash
python3 -m http.server 8080
```
Visit `http://localhost:8080`.
