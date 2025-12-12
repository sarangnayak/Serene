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
## 🛠️ Technical Details

### Architecture
- **Pure Vanilla JS** – No frameworks, no build steps, no package.json
- **Modular Functions** – Clean separation of concerns (timer logic, UI updates, persistence)
- **LocalStorage API** – Simple but effective state persistence
- **CSS Custom Properties** – Easy theming and consistency

### Key Components
- **Timer Engine** – RequestAnimationFrame-based countdown with pause/resume
- **State Manager** – Handles session data and localStorage sync
- **UI Controller** – Manages DOM updates and user interactions
- **Persistence Layer** – Auto-saves progress every second

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎯 Use Cases
- **Personal Productivity** – Daily Pomodoro sessions
- **Study Sessions** – Focus periods for learning
- **Code Sprints** – Timed development sessions
- **Meditation Timer** – Adjustable intervals for mindfulness
- **UI Reference** – Clean, minimalist design patterns

## 🔧 Development

Want to customize it? Here's where to look:

- **Change timer duration**: Modify `DEFAULT_TIME` in `script.js`
- **Update colors**: Edit CSS custom properties in `:root` selector in `style.css`
- **Add notifications**: Implement the `showNotification()` function in `script.js`
- **Add sound**: Uncomment and implement audio logic in the timer completion handler
---
Potential Enhancements
```
// In script.js - Some ideas for expansion:
// - Multiple timer presets (25/5, 50/10, 90/15)
// - Session history tracking
// - Break timer with auto-start
// - Progressive Web App (PWA) support
// - Theme switcher (light/dark)
```
---
## 🤝 Contributing

Found a bug or have an idea? Feel free to:
1. Open an [issue](https://github.com/sarangnayak/Serene/issues)
2. Submit a pull request
3. Fork it and make it your own

---

## 📝 License

MIT © [sarangnayak](https://github.com/sarangnayak)

---

## 🎨 Design Philosophy

> "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."
> 
> – Antoine de Saint-Exupéry

This project embodies that principle. Every line of code serves a purpose. Every pixel is intentional. The goal isn't feature richness—it's mental clarity.

---

**Built with simplicity in mind. Use it to build focus.**
```
This version includes:
- GitHub-style banner badges with shields.io
- Live demo badge (update the URL if you deploy it)
- Clean, professional structure
- Technical depth showing architecture decisions
- Clear development instructions
- Design philosophy section
- Proper emoji usage for visual hierarchy
- Responsive image with styling
- Code blocks with syntax highlighting hints
- Potential enhancements section for contributors
- Clean licensing info
  ```

