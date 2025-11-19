// Mouse and hover interaction detection system
class HoverDetector {
    constructor() {
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.hoverEnabled = true;
        this.lastHoverTime = 0;
        this.hoverCooldown = 1000; // 1 second cooldown
        this.movementThreshold = 50; // Minimum movement to trigger
    }

    init() {
        console.log('🎯 Initializing hover detection system...');
        this.setupEventListeners();
        console.log('✅ Hover detection ready with cooldown system');
    }

    setupEventListeners() {
        let lastTriggerTime = 0;
        
        // Mouse movement with debouncing and cooldown
        document.addEventListener('mousemove', Utils.debounce((e) => {
            if (!this.hoverEnabled) return;

            const now = Date.now();
            if (now - lastTriggerTime < this.hoverCooldown) return;

            const deltaX = e.clientX - this.lastMouseX;
            const deltaY = e.clientY - this.lastMouseY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Only trigger if movement is significant
            if (distance > this.movementThreshold) {
                const direction = Utils.getMouseDirection(
                    this.lastMouseX, this.lastMouseY, e.clientX, e.clientY
                );

                this.handleHoverDirection(direction);
                lastTriggerTime = now;
            }
            
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        }, 100));

        // Click handling
        document.addEventListener('click', (e) => {
            if (CHARACTER_SYSTEM) {
                CHARACTER_SYSTEM.playAnimation('crouch');
                
                // Play spatial sound based on click position
                if (AUDIO_SYSTEM) {
                    AUDIO_SYSTEM.playSpatialSound('sfx-click', e.clientX, e.clientY, {
                        volume: 0.4
                    });
                }
            }
        });

        // Touch handling for mobile
        document.addEventListener('touchstart', (e) => {
            if (CHARACTER_SYSTEM && e.touches.length > 0) {
                const touch = e.touches[0];
                CHARACTER_SYSTEM.playAnimation('crouch');
                
                if (AUDIO_SYSTEM) {
                    AUDIO_SYSTEM.playSpatialSound('sfx-click', touch.clientX, touch.clientY, {
                        volume: 0.4
                    });
                }
            }
        });

        document.addEventListener('touchmove', Utils.debounce((e) => {
            if (!this.hoverEnabled || e.touches.length === 0) return;

            const now = Date.now();
            if (now - lastTriggerTime < this.hoverCooldown) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - this.lastMouseX;
            const deltaY = touch.clientY - this.lastMouseY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > this.movementThreshold) {
                const direction = Utils.getMouseDirection(
                    this.lastMouseX, this.lastMouseY, touch.clientX, touch.clientY
                );

                this.handleHoverDirection(direction);
                lastTriggerTime = now;
            }
            
            this.lastMouseX = touch.clientX;
            this.lastMouseY = touch.clientY;
        }, 150));

        // Enable/disable based on mouse presence
        document.addEventListener('mouseenter', () => {
            this.hoverEnabled = true;
        });

        document.addEventListener('mouseleave', () => {
            this.hoverEnabled = false;
        });
    }

    handleHoverDirection(direction) {
        if (!CHARACTER_SYSTEM || !this.hoverEnabled) return;

        const currentState = CHARACTER_SYSTEM.getCurrentState();
        
        // Only trigger backflip from idle state and only for east/west directions
        if (currentState.animation === 'idle' && (direction === 'east' || direction === 'west')) {
            CHARACTER_SYSTEM.playBackflip(direction);
            
            // Play spatial sound based on direction
            if (AUDIO_SYSTEM) {
                const soundX = direction === 'east' ? window.innerWidth : 0;
                const soundY = window.innerHeight / 2;
                AUDIO_SYSTEM.playSpatialSound('sfx-backflip', soundX, soundY, {
                    volume: 0.6
                });
            }
        }
    }

    setHoverCooldown(cooldown) {
        this.hoverCooldown = Math.max(cooldown, 100); // Minimum 100ms
        console.log(`⏰ Hover cooldown set to: ${this.hoverCooldown}ms`);
    }

    setMovementThreshold(threshold) {
        this.movementThreshold = Math.max(threshold, 10); // Minimum 10px
        console.log(`📏 Movement threshold set to: ${this.movementThreshold}px`);
    }

    enableHover() {
        this.hoverEnabled = true;
        console.log('🔓 Hover interactions enabled');
    }

    disableHover() {
        this.hoverEnabled = false;
        console.log('🔒 Hover interactions disabled');
    }

    getConfig() {
        return {
            hoverEnabled: this.hoverEnabled,
            cooldown: this.hoverCooldown,
            threshold: this.movementThreshold,
            lastPosition: { x: this.lastMouseX, y: this.lastMouseY }
        };
    }
}

window.HOVER_DETECTOR = new HoverDetector();
console.log('✅ Hover detector loaded with advanced interaction handling');