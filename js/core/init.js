// Main initialization and system coordinator
class GameInitializer {
    constructor() {
        this.systems = new Map();
        this.isInitialized = false;
        this.loadingProgress = 0;
    }

    async initialize() {
        console.log('🚀 Starting Fethi\'s Anomaly Facility initialization...');
        
        try {
            // Show loading progress
            this.updateLoadingProgress(10, 'Loading configuration...');
            
            // Wait for config to be ready
            if (!window.CONFIG || Object.keys(window.CONFIG).length === 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            this.updateLoadingProgress(20, 'Initializing core systems...');
            
            // Initialize core systems first
            await this.initializeCoreSystems();
            
            this.updateLoadingProgress(50, 'Loading game systems...');
            
            // Initialize game systems with proper error handling
            await this.initializeGameSystems();
            
            this.updateLoadingProgress(80, 'Starting game world...');
            
            // Start the game
            await this.startGame();
            
            this.updateLoadingProgress(100, 'Ready!');
            
            this.isInitialized = true;
            this.onInitializationComplete();
            
        } catch (error) {
            console.error('💥 Initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    async initializeCoreSystems() {
        const coreSystems = [
            { name: 'config', instance: window.CONFIG },
            { name: 'utils', instance: window.Utils },
            { name: 'pixelScaling', instance: window.PIXEL_SCALER },
            { name: 'performance', instance: window.PERFORMANCE_DETECTOR },
            { name: 'gameLoop', instance: window.GAME_LOOP }
        ];
        
        for (const system of coreSystems) {
            if (system.instance) {
                this.systems.set(system.name, system.instance);
                console.log(`✅ ${system.name} system ready`);
            } else {
                console.warn(`⚠️ ${system.name} system not found`);
            }
        }
    }

    async initializeGameSystems() {
        const gameSystems = [
            { name: 'audio', instance: window.AUDIO_SYSTEM, initMethod: 'init' },
            { name: 'parallax', instance: window.PARALLAX_SYSTEM, initMethod: 'init' },
            { name: 'cursor', instance: window.CURSOR_SYSTEM, initMethod: 'init' },
            { name: 'character', instance: window.CHARACTER_SYSTEM, initMethod: 'init' },
            { name: 'hoverDetector', instance: window.HOVER_DETECTOR, initMethod: 'init' },
            { name: 'animationController', instance: window.ANIMATION_CONTROLLER, initMethod: 'init' }
        ];
        
        for (const system of gameSystems) {
            try {
                if (system.instance && system.instance[system.initMethod]) {
                    await system.instance[system.initMethod]();
                    this.systems.set(system.name, system.instance);
                    console.log(`✅ ${system.name} system ready`);
                } else {
                    console.warn(`⚠️ ${system.name} system or init method not found`);
                }
                
                // Update progress for each system
                this.loadingProgress += 30 / gameSystems.length;
                this.updateLoadingProgress(Math.floor(this.loadingProgress), `Loading ${system.name}...`);
                
            } catch (error) {
                console.error(`❌ Failed to initialize ${system.name}:`, error);
            }
        }
    }

    async startGame() {
        console.log('🎯 Starting game loop...');
        
        // Start the main game loop
        if (window.GAME_LOOP && window.GAME_LOOP.start) {
            window.GAME_LOOP.start();
        }
        
        console.log('🎪 Game systems started!');
    }

    updateLoadingProgress(percent, message = '') {
        this.loadingProgress = percent;
        
        const loadingBar = document.getElementById('loading-progress');
        const loadingText = document.getElementById('loading-text');
        const loadingDetails = document.getElementById('loading-details');
        
        if (loadingBar) {
            loadingBar.style.width = percent + '%';
        }
        
        if (loadingText && message) {
            loadingText.textContent = `INITIALIZING ANOMALY FACILITY... ${percent}%`;
        }
        
        if (loadingDetails && message) {
            loadingDetails.textContent = message;
        }
        
        console.log(`📊 Loading: ${percent}% ${message}`);
    }

    onInitializationComplete() {
        console.log('🎉 Initialization complete!');
        console.log('================================');
        console.log('🌟 FETHI\'S ANOMALY FACILITY 🌟');
        console.log('================================');
        console.log('Systems initialized:', Array.from(this.systems.keys()));
        console.log('================================');
        
        // Remove loading screen after a delay
        setTimeout(() => {
            this.removeLoadingScreen();
            this.triggerWelcomeSequence();
        }, 1000);
    }

    removeLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        
        if (loadingScreen && gameContainer) {
            loadingScreen.classList.remove('loading-active');
            loadingScreen.classList.add('hidden');
            
            gameContainer.classList.remove('hidden');
            gameContainer.style.display = 'block';
            
            console.log('🎮 Game container revealed');
        }
    }

    triggerWelcomeSequence() {
        if (window.CHARACTER_SYSTEM && window.CHARACTER_SYSTEM.playBackflip) {
            setTimeout(() => {
                window.CHARACTER_SYSTEM.playBackflip('east');
            }, 500);
        }
        
        if (window.AUDIO_SYSTEM) {
            window.AUDIO_SYSTEM.playSound('ambient-hangar', 0.1);
        }
        
        console.log('%c👋 Welcome to Fethi\'s Anomaly Facility!', 
            'color: #00ffff; font-size: 16px; font-weight: bold;');
    }

    handleInitializationError(error) {
        console.error('💥 Critical initialization error:', error);
        this.showErrorMessage(
            `Initialization failed: ${error.message}. Check the browser console for details.`
        );
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 50, 50, 0.95);
            color: white;
            padding: 30px;
            border-radius: 10px;
            border: 2px solid #ff0000;
            z-index: 10000;
            font-family: 'Courier New', monospace;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
        `;
        errorDiv.innerHTML = `
            <h2 style="margin-bottom: 15px;">🚨 SYSTEM INITIALIZATION ERROR</h2>
            <p style="margin-bottom: 20px; line-height: 1.4;">${message}</p>
            <button onclick="location.reload()" style="
                background: #00ffff;
                color: #0a0a1a;
                border: none;
                padding: 12px 24px;
                cursor: pointer;
                font-family: 'Courier New', monospace;
                font-weight: bold;
                border-radius: 4px;
            ">🔄 Refresh Page</button>
        `;
        
        document.body.appendChild(errorDiv);
    }
}

// Create the game instance
const GAME = new GameInitializer();

// Export for debugging
window.FETHI_FACILITY = {
    game: GAME,
    config: window.CONFIG,
    systems: {
        audio: window.AUDIO_SYSTEM,
        character: window.CHARACTER_SYSTEM,
        cursor: window.CURSOR_SYSTEM,
        parallax: window.PARALLAX_SYSTEM
    }
};

console.log('🔧 Fethi\'s Anomaly Facility - System exports available at window.FETHI_FACILITY');

// Auto-start when everything is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM loaded, starting game...');
        setTimeout(() => GAME.initialize(), 100);
    });
} else {
    console.log('⚡ DOM already loaded, starting game...');
    setTimeout(() => GAME.initialize(), 100);
}