# Serene 🌿

> A minimal, distraction-free Pomodoro timer for deep focus

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge&logo=github)](https://sarangnayak.github.io/Serene/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/vanilla-js-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/dependencies-none-success?style=for-the-badge)](https://bundlephobia.com/)

<img src="./preview.png" alt="Serene Screenshot" width="800" style="border-radius: 12px; margin: 20px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

## ✨ Features

- **🕒 Clean Pomodoro Timer** – 25-minute focus sessions with smooth countdown
- **🎨 Soothing Interface** – Carefully chosen colors and animations to reduce eye strain
- **💾 Session Persistence** – Your timer state is saved automatically (even if you close the tab)
- **⚡ Blazing Fast** – Zero dependencies, pure vanilla JS for instant loading
- **♿ Accessible by Design** – Built with ARIA labels, keyboard navigation, and high contrast
- **📱 Responsive** – Works beautifully on desktop, tablet, and mobile
- **🌙 Theme Ready** – Codebase is structured for easy dark/light mode implementation
---
## 🚀 Quick Start

1. **Clone the repo**
   ```bash
   git clone https://github.com/sarangnayak/Serene.git
   cd Serene
   ```
2. That's it! Open index.html in your browser

```bash
# Or use a simple HTTP server
python3 -m http.server 8000
# Then visit http://localhost:8000
```
---
📁 Project Structure
```
Serene/
├── index.html          # Main application entry point
├── style.css           # All styles (BEM methodology, CSS custom properties)
├── script.js           # Timer logic, state management, and UI handlers
├── preview.png         # Project screenshot
├── LICENSE             # MIT License
└── README.md           # This file
```
---
🛠️ Technical Details

Architecture
Pure Vanilla JS – No frameworks, no build steps, no package.json
Modular Functions – Clean separation of concerns (timer logic, UI updates, persistence)
LocalStorage API – Simple but effective state persistence
CSS Custom Properties – Easy theming and consistency
---
