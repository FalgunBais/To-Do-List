# TaskFlow - Premium Dashboard, Quotes & Recurring Reminders

TaskFlow is a clean, modern, dark glassmorphism dashboard To-Do List application built from scratch using **HTML5, CSS3, and Vanilla JavaScript**, equipped with personalized time-of-day greetings, daily motivational quotes, and customizable **Recurring Real-Time Reminders**.

![TaskFlow Header](https://img.shields.io/badge/TaskFlow-v1.2-6366f1)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 🌟 Key Features

- **Personalized Time-of-Day Greeting Banner**:
  - Dynamically displays greeting based on time of day (*Good Morning*, *Good Afternoon*, *Good Evening*, *Good Night*).
  - Customizable User Name badge with inline editing (persists in `localStorage`).
- **Thought for the Day Engine**:
  - Curated motivational quotes box.
  - Interactive **New Thought** shuffle button.
- **Customizable & Recurring Real-Time Reminders**:
  - Set specific date & time alerts per task.
  - **Recurrence Patterns**: `Repeat Daily`, `Repeat Weekdays (Mon-Fri)`, `Repeat Weekly`, `Repeat Monthly`.
  - Auto-rescheduling upon alert completion/dismissal.
  - **Upcoming Reminders Widget**: Live countdown badges (`In 15 min`, `In 2 hr`, `Due now`) with recurrence indicators.
  - **Web Audio API Synthesizer Chime**: Multi-tone chime sound when reminders trigger.
  - **Desktop Web Notifications**: Native browser push alerts.
  - **Real-Time Alert Modal**: Glassmorphism popover with Snooze (`5m`, `15m`), Mark Done, and Dismiss actions.
- **Ambient Dark UI Aesthetic**:
  - Floating radial aura glow blurs, glassmorphism cards (`backdrop-filter: blur(20px)`), glowing hover borders, and responsive grid.
- **Dashboard Statistics**: Dynamic counters (**Total**, **Active**, **Completed**) and percentage progress bar.
- **`localStorage` Persistence**: Saves all tasks, recurrence schedules, user name, and stats.

---

## 📁 Project Structure

```text
To-Do-List/
├── index.html         # Main layout, greeting header, quote card, reminders section, modal
├── css/
│   └── style.css      # Custom CSS variables, ambient aura blurs, glassmorphic popovers, grid
├── js/
│   └── script.js       # Greeting engine, quote database, recurring reminder ticker, localStorage
└── README.md          # Documentation
```

---

## 🚀 How to Run Locally

No build tools or backend dependencies are required.

1. Clone or download the repository:
   ```bash
   git clone https://github.com/FalgunBais/To-Do-List.git
   ```
2. Open `index.html` in any web browser.

Alternatively, serve using Python:
```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080`.
