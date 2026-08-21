# TaskFlow - Modern Dashboard To-Do List Web Application

TaskFlow is a clean, modern, dark glassmorphism dashboard To-Do List application built from scratch using **HTML5, CSS3, and Vanilla JavaScript**.

![TaskFlow Header](https://img.shields.io/badge/TaskFlow-v1.0-6366f1)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 🌟 Key Features

- **Modern Glassmorphism UI**: High-end dark theme design with smooth animations, glow effects, and typography (`Plus Jakarta Sans`).
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
- **`localStorage` Persistence**: Automatically saves and restores tasks upon page reload.
- **Fully Responsive**: Mobile-first grid layout that scales across phone, tablet, and desktop viewports.

---

## 📁 Project Structure

```text
To-Do-List/
├── index.html         # Main semantic HTML structure & layout
├── css/
│   └── style.css      # CSS variables, animations, glassmorphism, responsive grid
├── js/
│   └── script.js       # App state management, DOM logic, event listeners, localStorage
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

- **HTML5**: Semantic elements and accessibility.
- **Vanilla CSS**: CSS custom properties, Flexbox, Grid, custom scrollbars, keyframe animations.
- **Vanilla JavaScript**: Modern ES6 syntax, event handling, state manipulation, and browser `localStorage`.
