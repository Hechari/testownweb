// Custom cursor system with energy being effects
class CursorSystem {
    constructor() {
        this.cursorElement = null;
        this.currentState = 'default';
        this.lastPosition = { x: 0, y: 0 };
        this.trailElements = [];
        this.maxTrails = 5;
        this.interactiveElements = [];
    }

    async init() {
        console.log('🖱️ Initializing cursor system...');
        
        this.createCursorElement();
        this.setupEventListeners();
        this.setupInteractiveElements();
        
        // Register with game loop for trail effects
        GAME_LOOP.registerSystem('cursor', this);
        
        console.log('✅ Cursor system ready with trail effects');
    }

    createCursorElement() {
        // Remove existing cursor if any
        const existingCursor = document.querySelector('.energy-cursor');
        if (existingCursor) {
            existingCursor.remove();
        }

        this.cursorElement = document.createElement('div');
        this.cursorElement.className = 'energy-cursor cursor-default';
        document.body.appendChild(this.cursorElement);

        // Create trail elements
        for (let i = 0; i < this.maxTrails; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: #00ffff;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(trail);
            this.trailElements.push(trail);
        }
    }

    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            this.updatePosition(e.clientX, e.clientY);
            this.updateTrail(e.clientX, e.clientY);
        });

        // Mouse over interactive elements
        document.addEventListener('mouseover', (e) => {
            if (this.isInteractive(e.target)) {
                this.setState('hover');
                if (AUDIO_SYSTEM) {
                    AUDIO_SYSTEM.playSound('sfx-scanner', 0.2);
                }
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (this.isInteractive(e.target)) {
                this.setState('default');
            }
        });

        // Mouse clicks
        document.addEventListener('mousedown', (e) => {
            this.setState('click');
            if (AUDIO_SYSTEM) {
                AUDIO_SYSTEM.playSound('sfx-click', 0.3);
            }
            
            // Add click effect
            this.createClickEffect(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', () => {
            this.setState('default');
        });

        // Touch events for mobile
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.updatePosition(touch.clientX, touch.clientY);
                this.setState('click');
                this.createClickEffect(touch.clientX, touch.clientY);
            }
        });

        document.addEventListener('touchend', () => {
            this.setState('default');
        });

        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.updatePosition(touch.clientX, touch.clientY);
                this.updateTrail(touch.clientX, touch.clientY);
            }
        });
    }

    setupInteractiveElements() {
        // Mark character as interactive
        const character = document.getElementById('fethi-character');
        if (character) {
            character.classList.add('interactive');
            this.interactiveElements.push(character);
        }

        // Add interactive class to game container for general interactions
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.classList.add('interactive');
            this.interactiveElements.push(gameContainer);
        }
    }

    updatePosition(x, y) {
        this.lastPosition = { x, y };
        
        if (this.cursorElement) {
            this.cursorElement.style.left = `${x - 16}px`;
            this.cursorElement.style.top = `${y - 16}px`;
        }
    }

    updateTrail(x, y) {
        // Shift trail positions
        for (let i = this.trailElements.length - 1; i > 0; i--) {
            const currentTrail = this.trailElements[i];
            const prevTrail = this.trailElements[i - 1];
            
            if (prevTrail.style.opacity !== '0') {
                currentTrail.style.left = prevTrail.style.left;
                currentTrail.style.top = prevTrail.style.top;
                currentTrail.style.opacity = prevTrail.style.opacity;
            }
        }
        
        // Update first trail
        const firstTrail = this.trailElements[0];
        firstTrail.style.left = `${x - 4}px`;
        firstTrail.style.top = `${y - 4}px`;
        firstTrail.style.opacity = '0.6';
        
        // Fade out trails
        setTimeout(() => {
            firstTrail.style.opacity = '0';
        }, 100);
    }

    setState(state) {
        if (this.currentState === state) return;
        
        this.currentState = state;
        
        if (this.cursorElement) {
            // Remove all state classes
            this.cursorElement.className = 'energy-cursor';
            
            // Add current state class
            this.cursorElement.classList.add(`cursor-${state}`);
            
            // Add transition effect
            this.cursorElement.style.transition = `all ${CONFIG.ANIMATION_TIMING.CURSOR_TRANSITION}ms ease`;
        }
    }

    createClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            left: ${x - 20}px;
            top: ${y - 20}px;
            width: 40px;
            height: 40px;
            border: 2px solid #ffff00;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            animation: click-effect 0.6s ease-out forwards;
        `;
        
        // Add CSS for animation
        if (!document.querySelector('#click-effect-style')) {
            const style = document.createElement('style');
            style.id = 'click-effect-style';
            style.textContent = `
                @keyframes click-effect {
                    0% { transform: scale(0); opacity: 1; }
                    50% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(effect);
        
        // Remove effect after animation
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 600);
    }

    isInteractive(element) {
        return element.classList.contains('interactive') ||
               this.interactiveElements.includes(element) ||
               this.interactiveElements.some(ie => ie.contains(element));
    }

    update(deltaTime) {
        // Update trail effects or other dynamic behaviors
    }

    render() {
        // Additional rendering if needed
    }

    setTrailLength(length) {
        this.maxTrails = Utils.clamp(length, 0, 10);
        
        // Update trail elements
        this.trailElements.forEach(trail => trail.remove());
        this.trailElements = [];
        this.createCursorElement();
    }

    getState() {
        return {
            state: this.currentState,
            position: this.lastPosition,
            trailLength: this.maxTrails
        };
    }
}

window.CURSOR_SYSTEM = new CursorSystem();
console.log('✅ Cursor system loaded with trail effects');