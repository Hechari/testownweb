// Character animation and state management system
class CharacterSystem {
    constructor() {
        this.characterElement = null;
        this.currentAnimation = 'idle';
        this.currentDirection = 'east';
        this.animationFrames = new Map();
        this.currentFrame = 0;
        this.animationInterval = null;
        this.isMoving = false;
        this.spriteSheets = new Map();
    }

    async init() {
        console.log('👤 Initializing character system...');
        
        this.characterElement = document.getElementById('fethi-character');
        
        if (!this.characterElement) {
            console.error('❌ Character element not found');
            this.createFallbackCharacter();
        }

        await this.preloadSprites();
        this.setupEventListeners();
        
        // Register with game loop
        GAME_LOOP.registerSystem('character', this);
        
        // Start idle animation
        this.playAnimation('idle');
        
        console.log('✅ Character system ready with sprite animations');
    }

    createFallbackCharacter() {
        const characterContainer = document.getElementById('character-container');
        if (!characterContainer) {
            console.error('❌ Character container also not found');
            return;
        }
        
        this.characterElement = document.createElement('div');
        this.characterElement.id = 'fethi-character';
        this.characterElement.className = 'character-idle';
        characterContainer.appendChild(this.characterElement);
        console.log('✅ Created fallback character element');
    }

    async preloadSprites() {
        console.log('🖼️ Preloading character sprites...');
        
        const spritePromises = [];
        
        // Idle animation frames
        for (let i = 0; i < 4; i++) {
            const path = `${CONFIG.PATHS.CHARACTER.IDLE}frame_${i}.png`;
            spritePromises.push(this.loadSprite(path, 'idle', i));
        }
        
        // Crouching animation frames
        for (let i = 0; i < 5; i++) {
            const path = `${CONFIG.PATHS.CHARACTER.CROUCH}frame_${i}.png`;
            spritePromises.push(this.loadSprite(path, 'crouch', i));
        }
        
        // Backflip animation frames
        for (let i = 0; i < 10; i++) {
            const eastPath = `${CONFIG.PATHS.CHARACTER.BACKFLIP.EAST}frame_${i}.png`;
            const westPath = `${CONFIG.PATHS.CHARACTER.BACKFLIP.WEST}frame_${i}.png`;
            spritePromises.push(this.loadSprite(eastPath, 'backflip-east', i));
            spritePromises.push(this.loadSprite(westPath, 'backflip-west', i));
        }
        
        const results = await Promise.allSettled(spritePromises);
        
        let successCount = 0;
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                successCount++;
            }
        });
        
        console.log(`✅ Loaded ${successCount}/${spritePromises.length} sprite frames`);
        
        // If no sprites loaded, use CSS animations
        if (successCount === 0) {
            console.warn('⚠️ No sprites loaded, using CSS fallback animations');
            this.setupCSSFallbacks();
        }
    }

    async loadSprite(path, animation, frame) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                if (!this.spriteSheets.has(animation)) {
                    this.spriteSheets.set(animation, []);
                }
                this.spriteSheets.get(animation)[frame] = path;
                resolve(true);
            };
            img.onerror = () => {
                console.warn(`❌ Failed to load sprite: ${path}`);
                resolve(false);
            };
            img.src = path;
        });
    }

    setupCSSFallbacks() {
        // CSS animations are already defined in character.css
        // This method is for additional fallback setup if needed
        console.log('🎨 Setting up CSS fallback animations');
    }

    setupEventListeners() {
        // Animation end listeners
        this.characterElement.addEventListener('animationend', (e) => {
            if (e.animationName.includes('crouch') && this.currentAnimation === 'crouching') {
                this.playAnimation('idle');
            }
        });

        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else {
                this.playAnimation(this.currentAnimation);
            }
        });
    }

    playAnimation(animationName, direction = 'east') {
        if (!this.characterElement) return;
        if (this.currentAnimation === animationName && this.currentDirection === direction) return;

        // Stop current animation
        this.stopAnimation();

        this.currentAnimation = animationName;
        this.currentDirection = direction;
        this.currentFrame = 0;

        const fullAnimationName = direction ? `${animationName}-${direction}` : animationName;
        
        // Update CSS class for animation
        this.characterElement.className = `character-${fullAnimationName}`;

        // Start frame-based animation if sprites are available
        if (this.spriteSheets.has(fullAnimationName)) {
            this.startSpriteAnimation(fullAnimationName);
        }

        this.playAnimationSound(animationName);
        console.log(`🎬 Playing animation: ${fullAnimationName}`);
    }

    startSpriteAnimation(animationName) {
        const frames = this.spriteSheets.get(animationName);
        if (!frames || frames.length === 0) return;

        const frameTime = this.getAnimationDuration(animationName) / frames.length;
        
        this.animationInterval = setInterval(() => {
            this.currentFrame = (this.currentFrame + 1) % frames.length;
            const framePath = frames[this.currentFrame];
            
            if (framePath && this.characterElement) {
                this.characterElement.style.backgroundImage = `url('${framePath}')`;
            }
        }, frameTime);
    }

    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    getAnimationDuration(animationName) {
        const timing = CONFIG.ANIMATION_TIMING;
        
        switch(animationName.split('-')[0]) {
            case 'idle': return timing.IDLE_BREATHING;
            case 'crouch': return timing.CROUCHING;
            case 'backflip': return timing.BACKFLIP;
            default: return 1000;
        }
    }

    playAnimationSound(animationName) {
        if (!AUDIO_SYSTEM) return;

        const soundMap = {
            'crouch': { name: 'sfx-click', volume: 0.3 },
            'backflip': { name: 'sfx-backflip', volume: 0.5 },
            'idle': { name: 'sfx-scanner', volume: 0.1 }
        };

        const soundConfig = soundMap[animationName];
        if (soundConfig) {
            AUDIO_SYSTEM.playSound(soundConfig.name, soundConfig.volume);
        }
    }

    playBackflip(direction) {
        this.playAnimation('backflip', direction);
        
        // Auto-return to idle after backflip completes
        setTimeout(() => {
            if (this.currentAnimation === 'backflip') {
                this.playAnimation('idle');
            }
        }, CONFIG.ANIMATION_TIMING.BACKFLIP);
    }

    update(deltaTime) {
        // Update character state, physics, or other dynamic behaviors
    }

    render() {
        // Additional rendering logic if needed
    }

    getCurrentState() {
        return {
            animation: this.currentAnimation,
            direction: this.currentDirection,
            frame: this.currentFrame,
            position: this.characterElement ? {
                x: this.characterElement.offsetLeft,
                y: this.characterElement.offsetTop
            } : null
        };
    }

    setPosition(x, y) {
        if (this.characterElement) {
            this.characterElement.style.left = `${x}px`;
            this.characterElement.style.top = `${y}px`;
        }
    }

    // Emergency fallback if everything else fails
    setupEmergencyVisual() {
        if (this.characterElement) {
            this.characterElement.style.cssText = `
                width: 48px;
                height: 48px;
                background: #00ffff;
                border: 3px solid #0088ff;
                border-radius: 8px;
                box-shadow: 0 0 20px #00ffff;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1000;
            `;
        }
    }
}

window.CHARACTER_SYSTEM = new CharacterSystem();
console.log('✅ Character system loaded with full animation support');