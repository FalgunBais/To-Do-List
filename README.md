# TaskFlow - Modern Dashboard To-Do List Web Application & Reminders

TaskFlow is a clean, modern, dark glassmorphism dashboard To-Do List application built from scratch using **HTML5, CSS3, and Vanilla JavaScript**, equipped with customizable **Real-Time Reminders**.

![TaskFlow Header](https://img.shields.io/badge/TaskFlow-v1.1-6366f1)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 🌟 Key Features

- **Modern Glassmorphism UI**: High-end dark theme design with smooth animations, glow effects, and typography (`Plus Jakarta Sans`).
- **Customizable Real-Time Reminders**:
  - Set specific date and time alerts per task with `datetime-local` picker.
  - **Upcoming Reminders Dashboard Section**: View all scheduled task reminders with live countdown badges (`In 15 min`, `In 2 hr`, `Due now`).
  - **Web Audio API Chime**: Pleasant multi-tone synthesizer chime sound when reminder triggers.
  - **Desktop Web Notifications API**: Native browser push notifications.
  - **Real-Time Alert Modal**: Glassmorphism popover with Snooze options (`5 min`, `15 min`), Mark Done, and Dismiss actions.
- **Dashboard Statistics**: Dynamic task status metrics (**Total**, **Active**, **Completed**) and real-time **Completion Rate Progress Bar**.
- **Task Management**:
  - Add tasks with priority levels (**High**, **Medium**, **Low**).
  - Press `Enter` to submit tasks quickly.
  - Validation to prevent empty tasks (with shake feedback effect).
- **Inline Editing & Deletion**:
  - Edit existing tasks inline with `Enter` to save and `Escape` to cancel.
  - Delete tasks with slide-out exit animations.
- **Filtering & Real-time Search**:
  - Status tabs: **All**, **Active**, and **Completed**.
  - Real-time search filter by title keywords.
  - **Clear Completed** button to clear finished tasks.
- **`localStorage` Persistence**: Automatically saves and restores tasks & reminders upon page reload.
- **Fully Responsive**: Mobile-first grid layout that scales across phone, tablet, and desktop viewports.

---

## 📁 Project Structure

```text
To-Do-List/
├── index.html         # Main semantic HTML structure, reminders section & alert modal
├── css/
│   └── style.css      # Custom CSS variables, glassmorphism, modal popovers, responsive grid
├── js/
│   └── script.js       # App state management, Real-time Reminder engine, Web Audio chime, localStorage
└── README.md          # Documentation
```

---

## 🚀 How to Run Locally

No build tools or backend dependencies are required.

1. Clone or download the repository.
2. Open `index.html` in any web browser.

Alternatively, serve using Python:
```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080`.

---

## 💻 Tech Stack

- **HTML5**: Semantic elements, accessible form controls.
- **Vanilla CSS**: CSS custom properties, Flexbox, Grid, custom scrollbars, keyframe animations, modal popovers.
- **Vanilla JavaScript**: ES6 modules, Web Audio API, Web Notifications API, background ticker interval engine, and browser `localStorage`.
