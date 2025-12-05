document.addEventListener('DOMContentLoaded', () => {
    class PomodoroTimer {
        constructor() {
            this.config = {
                focus: { duration: 25 * 60, color: '#6366f1', label: 'Focus Session' },
                'short-break': { duration: 5 * 60, color: '#10b981', label: 'Short Break' },
                'long-break': { duration: 15 * 60, color: '#f59e0b', label: 'Long Break' }
            };
            
            this.currentMode = 'focus';
            this.timeLeft = this.config.focus.duration;
            this.isRunning = false;
            this.animation = null;
            this.sessionCount = 0;
            this.longBreakInterval = 4;
            this.autoStartBreaks = false;
            this.autoStartFocus = false;
            this.isPageVisible = true;
            this.audioContext = null;

            this.loadSettings();
            this.initializeElements();
            this.createParticles();
            this.updateDisplay(true);
            this.updateSessionCounterDisplay();
            this.setupEventListeners();
            this.setupAudioFallbacks();
            this.animateIn();
            this.setupPageVisibility();
        }

        loadSettings() {
            try {
                const saved = localStorage.getItem('pomodoroSettings');
                if (saved) {
                    const settings = JSON.parse(saved);
                    
                    // Validate and load settings
                    if (settings.focusDuration && settings.focusDuration >= 1) {
                        this.config.focus.duration = settings.focusDuration * 60;
                    }
                    if (settings.shortBreakDuration && settings.shortBreakDuration >= 1) {
                        this.config['short-break'].duration = settings.shortBreakDuration * 60;
                    }
                    if (settings.longBreakDuration && settings.longBreakDuration >= 1) {
                        this.config['long-break'].duration = settings.longBreakDuration * 60;
                    }
                    if (settings.longBreakInterval && settings.longBreakInterval >= 1) {
                        this.longBreakInterval = Math.min(settings.longBreakInterval, 12);
                    }
                    
                    this.autoStartBreaks = Boolean(settings.autoStartBreaks);
                    this.autoStartFocus = Boolean(settings.autoStartFocus);
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }

        saveSettingsToStorage() {
            try {
                const settings = {
                    focusDuration: this.config.focus.duration / 60,
                    shortBreakDuration: this.config['short-break'].duration / 60,
                    longBreakDuration: this.config['long-break'].duration / 60,
                    longBreakInterval: this.longBreakInterval,
                    autoStartBreaks: this.autoStartBreaks,
                    autoStartFocus: this.autoStartFocus
                };
                localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
            } catch (error) {
                console.error('Error saving settings:', error);
            }
        }

        initializeElements() {
            this.elements = {
                timerDisplay: document.getElementById('timer-display'),
                sessionLabel: document.getElementById('session-label'),
                sessionCounter: document.getElementById('session-counter'),
                progressRing: document.getElementById('progress-ring'),
                playPauseBtn: document.getElementById('play-pause-btn'),
                playPauseIcon: document.querySelector('#play-pause-btn i'),
                prevBtn: document.getElementById('prev-btn'),
                nextBtn: document.getElementById('next-btn'),
                resetBtn: document.getElementById('reset-btn'),
                modeTabs: document.querySelectorAll('.mode-tab'),
                background: document.getElementById('background'),
                startSound: document.getElementById('start-sound'),
                endSound: document.getElementById('end-sound'),
                appContainer: document.getElementById('app-container'),
                footer: document.querySelector('.footer'),
                settingsBtn: document.getElementById('settings-btn'),
                settingsModal: document.getElementById('settings-modal'),
                closeSettingsBtn: document.getElementById('close-settings-btn'),
                saveSettingsBtn: document.getElementById('save-settings-btn'),
                focusDurationInput: document.getElementById('focus-duration'),
                shortBreakDurationInput: document.getElementById('short-break-duration'),
                longBreakDurationInput: document.getElementById('long-break-duration'),
                longBreakIntervalInput: document.getElementById('long-break-interval'),
                autoStartBreaksToggle: document.getElementById('auto-start-breaks'),
                autoStartFocusToggle: document.getElementById('auto-start-focus')
            };
            
            // Calculate circumference from actual radius (135 from viewBox)
            this.circumference = 2 * Math.PI * 135;
            this.elements.progressRing.style.strokeDasharray = this.circumference;
            this.elements.progressRing.style.strokeDashoffset = this.circumference;
        }

        setupAudioFallbacks() {
            // Base64 encoded fallback sounds (very short beeps)
            const startSoundBase64 = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
            const endSoundBase64 = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
            
            try {
                // Try to load external sounds first
                this.elements.startSound.src = "https://assets.mixkit.co/sfx/preview/mixkit-interface-hint-notification-911.mp3";
                this.elements.endSound.src = "https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3";
                
                // Set fallback if external fails
                this.elements.startSound.onerror = () => {
                    this.elements.startSound.src = startSoundBase64;
                };
                
                this.elements.endSound.onerror = () => {
                    this.elements.endSound.src = endSoundBase64;
                };
            } catch (error) {
                console.error('Audio setup error:', error);
            }
        }

        createParticles() {
            for (let i = 0; i < 8; i++) { // Reduced from 15 for performance
                const particle = document.createElement('div');
                particle.className = 'floating-particle';
                const size = Math.random() * 80 + 30; // Smaller particles
                Object.assign(particle.style, {
                    width: `${size}px`, 
                    height: `${size}px`,
                    left: `${Math.random() * 100}%`, 
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 20}s`,
                    animationDuration: `${Math.random() * 30 + 20}s`
                });
                this.elements.background.appendChild(particle);
            }
        }

        setupEventListeners() {
            this.elements.playPauseBtn.addEventListener('click', () => this.toggleTimer());
            this.elements.prevBtn.addEventListener('click', () => this.changeMode(-1));
            this.elements.nextBtn.addEventListener('click', () => this.changeMode(1));
            this.elements.resetBtn.addEventListener('click', () => this.resetTimer());
            
            this.elements.modeTabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const modeTab = e.target.closest('.mode-tab');
                    if (modeTab) {
                        this.switchMode(modeTab.dataset.mode, true);
                    }
                });
            });
            
            this.elements.settingsBtn.addEventListener('click', () => this.openSettings());
            this.elements.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
            this.elements.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
            
            // Close modal on backdrop click
            this.elements.settingsModal.addEventListener('click', (e) => {
                if (e.target === this.elements.settingsModal) {
                    this.closeSettings();
                }
            });
            
            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.elements.settingsModal.classList.contains('visible')) {
                    this.closeSettings();
                }
            });
        }

        setupPageVisibility() {
            document.addEventListener('visibilitychange', () => {
                this.isPageVisible = !document.hidden;
                
                if (!this.isPageVisible && this.isRunning) {
                    this.pauseTimer(true); // Pause but keep state
                }
            });
        }

        animateIn() {
            gsap.from([this.elements.appContainer, this.elements.footer], {
                opacity: 0, 
                y: 30, 
                duration: 1, 
                ease: "power3.out", 
                stagger: 0.2, 
                delay: 0.5
            });
        }

        switchMode(mode, isManual = false) {
            this.pauseTimer();
            this.isRunning = false;
            
            // Kill any existing animation
            if (this.animation) {
                this.animation.kill();
                this.animation = null;
            }
            
            const tl = gsap.timeline({ onComplete: () => this.updateDisplay(true) });
            tl.to([this.elements.timerDisplay, this.elements.sessionLabel], { 
                opacity: 0, 
                y: 10, 
                duration: 0.3, 
                ease: 'power2.in' 
            })
            .call(() => {
                this.currentMode = mode;
                this.timeLeft = this.config[mode].duration;
                this.elements.modeTabs.forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
                this.elements.progressRing.style.stroke = this.config[mode].color;
            })
            .set(this.elements.progressRing, { strokeDashoffset: this.circumference })
            .to([this.elements.timerDisplay, this.elements.sessionLabel], { 
                opacity: 1, 
                y: 0, 
                duration: 0.5, 
                ease: 'power2.out' 
            })
            .call(() => {
                if (!isManual) {
                    this.toggleTimer();
                }
            });
        }
        
        changeMode(direction) {
            const modes = ['focus', 'short-break', 'long-break'];
            let currentIndex = modes.indexOf(this.currentMode);
            let nextIndex = (currentIndex + direction + modes.length) % modes.length;
            this.switchMode(modes[nextIndex], true);
        }

        toggleTimer() {
            this.isRunning = !this.isRunning;
            this.elements.playPauseIcon.className = this.isRunning ? 'fa-solid fa-pause' : 'fa-solid fa-play';
            
            if (this.isRunning) {
                if (this.timeLeft > 0) {
                    this.playSound('start');
                }
                this.startTimer();
            } else {
                this.pauseTimer();
            }
        }

        playSound(type) {
            try {
                const sound = type === 'start' ? this.elements.startSound : this.elements.endSound;
                
                // Reset sound to beginning
                sound.currentTime = 0;
                
                // Try to play with error handling
                const playPromise = sound.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Audio play failed:', error);
                    });
                }
            } catch (error) {
                console.error('Sound error:', error);
            }
        }

        startTimer() {
            const totalTime = this.config[this.currentMode].duration;
            const elapsed = totalTime - this.timeLeft;
            const startOffset = this.circumference * (1 - (elapsed / totalTime));

            // Kill any existing animation
            if (this.animation) {
                this.animation.kill();
            }

            this.animation = gsap.fromTo(this.elements.progressRing, 
                { strokeDashoffset: startOffset },
                {
                    strokeDashoffset: 0,
                    duration: this.timeLeft,
                    ease: 'linear',
                    onUpdate: () => {
                        if (this.animation) {
                            this.timeLeft = totalTime * (1 - this.animation.progress());
                            this.updateDisplay();
                        }
                    },
                    onComplete: () => this.completeSession()
                }
            );
        }

        pauseTimer(silent = false) {
            if (this.animation) {
                this.animation.pause();
            }
            
            if (!silent) {
                this.elements.playPauseIcon.className = 'fa-solid fa-play';
                this.isRunning = false;
            }
        }

        resetTimer() {
            this.pauseTimer();
            
            // Kill animation
            if (this.animation) {
                this.animation.kill();
                this.animation = null;
            }
            
            this.timeLeft = this.config[this.currentMode].duration;
            this.updateDisplay(true);
            
            gsap.to(this.elements.progressRing, { 
                strokeDashoffset: this.circumference, 
                duration: 0.5 
            });
        }

        completeSession() {
            this.isRunning = false;
            this.elements.playPauseIcon.className = 'fa-solid fa-play';
            this.playSound('end');
            
            let nextMode = 'focus';
            if (this.currentMode === 'focus') {
                this.sessionCount++;
                nextMode = this.sessionCount % this.longBreakInterval === 0 ? 'long-break' : 'short-break';
            }
            
            this.updateSessionCounterDisplay();
            
            const shouldAutoStart = (nextMode === 'focus' && this.autoStartFocus) || 
                                  (nextMode !== 'focus' && this.autoStartBreaks);
            
            // Small delay before auto-starting next session
            setTimeout(() => {
                this.switchMode(nextMode, !shouldAutoStart);
            }, 1000);
        }
        
        updateDisplay(force = false) {
            if (!this.isRunning && !force) return;
            
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = Math.floor(this.timeLeft % 60); // Fixed: Math.floor instead of Math.round
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            this.elements.timerDisplay.textContent = timeString;
            document.title = `${timeString} - ${this.config[this.currentMode].label}`;
            this.elements.sessionLabel.textContent = this.config[this.currentMode].label;
        }

        updateSessionCounterDisplay() {
            this.elements.sessionCounter.innerHTML = '';
            const count = this.currentMode === 'focus' ? 
                this.sessionCount % this.longBreakInterval : 
                this.sessionCount;
            
            for (let i = 0; i < this.longBreakInterval; i++) {
                const dot = document.createElement('div');
                dot.className = 'session-dot';
                if (i < count) dot.classList.add('active');
                this.elements.sessionCounter.appendChild(dot);
            }
        }

        openSettings() {
            // Load current values
            this.elements.focusDurationInput.value = this.config.focus.duration / 60;
            this.elements.shortBreakDurationInput.value = this.config['short-break'].duration / 60;
            this.elements.longBreakDurationInput.value = this.config['long-break'].duration / 60;
            this.elements.longBreakIntervalInput.value = this.longBreakInterval;
            this.elements.autoStartBreaksToggle.checked = this.autoStartBreaks;
            this.elements.autoStartFocusToggle.checked = this.autoStartFocus;
            
            this.elements.settingsModal.classList.add('visible');
            
            // Focus first input for accessibility
            setTimeout(() => {
                this.elements.focusDurationInput.focus();
            }, 100);
        }

        closeSettings() {
            this.elements.settingsModal.classList.remove('visible');
        }

        saveSettings() {
            try {
                // Validate inputs
                const focusDuration = Math.max(1, Math.min(120, 
                    parseInt(this.elements.focusDurationInput.value) || 25));
                const shortBreakDuration = Math.max(1, Math.min(30, 
                    parseInt(this.elements.shortBreakDurationInput.value) || 5));
                const longBreakDuration = Math.max(1, Math.min(60, 
                    parseInt(this.elements.longBreakDurationInput.value) || 15));
                const longBreakInterval = Math.max(1, Math.min(12, 
                    parseInt(this.elements.longBreakIntervalInput.value) || 4));
                
                // Update config
                this.config.focus.duration = focusDuration * 60;
                this.config['short-break'].duration = shortBreakDuration * 60;
                this.config['long-break'].duration = longBreakDuration * 60;
                this.longBreakInterval = longBreakInterval;
                this.autoStartBreaks = this.elements.autoStartBreaksToggle.checked;
                this.autoStartFocus = this.elements.autoStartFocusToggle.checked;
                
                // Save to localStorage
                this.saveSettingsToStorage();
                
                this.closeSettings();
                this.resetTimer();
                this.updateSessionCounterDisplay();
                
            } catch (error) {
                console.error('Error saving settings:', error);
                alert('Error saving settings. Please check your inputs.');
            }
        }
    }

    // Initialize timer
    try {
        new PomodoroTimer();
    } catch (error) {
        console.error('Failed to initialize timer:', error);
        // Show error message to user
        document.body.innerHTML = `
            <div style="color: white; text-align: center; padding: 40px;">
                <h2>Error Loading Timer</h2>
                <p>Please refresh the page or check your browser settings.</p>
            </div>
        `;
    }
});
