// Main initialization and system coordinator
class GameInitializer {
    constructor() {
        this.systems = new Map();
        this.isInitialized = false;
        this.loadingProgress = 0;
        this.totalSystems = 8; // Updated total system count
    }

    async initialize() {
        console.log('🚀 Starting Fethi\'s Anomaly Facility initialization...');
        console.log('================================');
        
        try {
            // Phase 1: Configuration and core setup
            this.updateLoadingProgress(10, 'Loading configuration...');
            await this.verifyDependencies();
            
            // Phase 2: Core engine systems
            this.updateLoadingProgress(20, 'Initializing core systems...');
            await this.initializeCoreSystems();
            
            // Phase 3: Game systems
            this.updateLoadingProgress(40, 'Loading game systems...');
            await this.initializeGameSystems();
            
            // Phase 4: Interaction systems
            this.updateLoadingProgress(70, 'Setting up interactions...');
            await this.initializeInteractionSystems();
            
            // Phase 5: Final setup
            this.updateLoadingProgress(90, 'Starting game world...');
            await this.startGame();
            
            this.updateLoadingProgress(100, 'Ready!');
            
            this.isInitialized = true;
            this.onInitializationComplete();
            
        } catch (error) {
            console.error('💥 Initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    async verifyDependencies() {
        console.log('🔍 Verifying dependencies...');
        
        const requiredGlobals = [
            'CONFIG', 'Utils', 'PIXEL_SCALER', 'PERFORMANCE_DETECTOR',
            'GAME_LOOP', 'AUDIO_SYSTEM', 'PARALLAX_SYSTEM', 'CURSOR_SYSTEM',
            'CHARACTER_SYSTEM', 'HOVER_DETECTOR', 'ANIMATION_CONTROLLER'
        ];

        const missing = [];
        
        for (const globalName of requiredGlobals) {
            if (typeof window[globalName] === 'undefined') {
                missing.push(globalName);
                console.error(`❌ Missing: ${globalName}`);
            } else {
                console.log(`✅ Found: ${globalName}`);
            }
        }

        if (missing.length > 0) {
            throw new Error(`Missing required dependencies: ${missing.join(', ')}`);
        }

        console.log('✅ All dependencies verified');
    }

    async initializeCoreSystems() {
        console.log('⚙️ Initializing core systems...');
        
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
            this.updateLoadingProgress(20 + (30 / coreSystems.length), `Initializing ${system.name}...`);
        }
    }

    async initializeGameSystems() {
        console.log('🎮 Initializing game systems...');
        
        const gameSystems = [
            { name: 'audio', instance: window.AUDIO_SYSTEM, initMethod: 'init' },
            { name: 'parallax', instance: window.PARALLAX_SYSTEM, initMethod: 'init' },
            { name: 'cursor', instance: window.CURSOR_SYSTEM, initMethod: 'init' },
            { name: 'character', instance: window.CHARACTER_SYSTEM, initMethod: 'init' }
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
            } catch (error) {
                console.error(`❌ Failed to initialize ${system.name}:`, error);
            }
            
            this.updateLoadingProgress(40 + (30 / gameSystems.length), `Loading ${system.name}...`);
        }
    }

    async initializeInteractionSystems() {
        console.log('🎯 Initializing interaction systems...');
        
        const interactionSystems = [
            { name: 'hoverDetector', instance: window.HOVER_DETECTOR, initMethod: 'init' },
            { name: 'animationController', instance: window.ANIMATION_CONTROLLER, initMethod: 'init' }
        ];
        
        for (const system of interactionSystems) {
            try {
                if (system.instance && system.instance[system.initMethod]) {
                    await system.instance[system.initMethod]();
                    this.systems.set(system.name, system.instance);
                    console.log(`✅ ${system.name} system ready`);
                } else {
                    console.warn(`⚠️ ${system.name} system or init method not found`);
                }
            } catch (error) {
                console.error(`❌ Failed to initialize ${system.name}:`, error);
            }
            
            this.updateLoadingProgress(70 + (20 / interactionSystems.length), `Setting up ${system.name}...`);
        }
    }

    async startGame() {
        console.log('🎪 Starting game systems...');
        
        // Start the main game loop
        if (window.GAME_LOOP && window.GAME_LOOP.start) {
            window.GAME_LOOP.start();
        }
        
        // Enable audio after user interaction
        setTimeout(() => {
            if (window.AUDIO_SYSTEM) {
                window.AUDIO_SYSTEM.enableAudio();
            }
        }, CONFIG.GAME.AMBIENT_AUDIO_DELAY);
        
        console.log('✅ Game systems started');
    }

    updateLoadingProgress(percent, message = '') {
        this.loadingProgress = percent;
        
        const loadingBar = document.getElementById('loading-progress-bar');
        const loadingText = document.getElementById('loading-text');
        const loadingDetails = document.getElementById('loading-details');
        
        if (loadingBar) {
            loadingBar.style.width = percent + '%';
        }
        
        if (loadingText) {
            loadingText.textContent = `INITIALIZING ANOMALY FACILITY... ${Math.floor(percent)}%`;
        }
        
        if (loadingDetails && message) {
            loadingDetails.textContent = message;
        }
        
        console.log(`📊 Loading: ${Math.floor(percent)}% ${message}`);
    }

    onInitializationComplete() {
        console.log('🎉 Initialization complete!');
        console.log('================================');
        console.log('🌟 FETHI\'S ANOMALY FACILITY 🌟');
        console.log('================================');
        console.log('Systems initialized:', Array.from(this.systems.keys()));
        console.log('Performance grade:', PERFORMANCE_DETECTOR.getPerformanceGrade());
        console.log('Optimal settings:', PERFORMANCE_DETECTOR.getOptimalSettings());
        console.log('================================');
        
        // Remove loading screen and start experience
        setTimeout(() => {
            this.removeLoadingScreen();
            this.triggerWelcomeSequence();
        }, 1500);
    }

    removeLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        
        if (loadingScreen && gameContainer) {
            // Add fade-out animation
            loadingScreen.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                loadingScreen.classList.remove('loading-active');
                loadingScreen.classList.add('hidden');
                
                gameContainer.classList.remove('hidden');
                gameContainer.style.display = 'block';
                
                console.log('🎮 Game container revealed');
            }, 800);
        } else {
            console.error('❌ Could not find loading screen or game container');
        }
    }

    triggerWelcomeSequence() {
        console.log('👋 Starting welcome sequence...');
        
        // Play welcome backflip
        if (window.CHARACTER_SYSTEM) {
            setTimeout(() => {
                window.CHARACTER_SYSTEM.playBackflip('east');
            }, 500);
        }
        
        // Start ambient audio
        if (window.AUDIO_SYSTEM) {
            window.AUDIO_SYSTEM.startAmbientAudio();
        }
        
        // Welcome message
        setTimeout(() => {
            console.log('%c👋 Welcome to Fethi\'s Anomaly Facility!', 
                'color: #00ffff; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #00ffff;');
            console.log('%cMove your cursor to trigger backflips, click to crouch!', 
                'color: #ff00ff; font-size: 14px;');
        }, 1000);
    }

    handleInitializationError(error) {
        console.error('💥 Critical initialization error:', error);
        
        const errorMessage = `
            Initialization failed: ${error.message}
            
            Common issues to check:
            • All asset folders exist in correct locations
            • File names match exactly (asteroid-1.png vs astroid-1.png)
            • JavaScript files are loading in correct order
            • Check browser console for 404 errors
            
            Current status:
            • Systems loaded: ${this.systems.size}
            • Loading progress: ${this.loadingProgress}%
        `;
        
        this.showErrorMessage(errorMessage);
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
            box-shadow: 0 0 30px rgba(255, 0, 0, 0.7);
            backdrop-filter: blur(10px);
        `;
        errorDiv.innerHTML = `
            <h2 style="margin-bottom: 15px; color: #ffff00;">🚨 SYSTEM INITIALIZATION ERROR</h2>
            <pre style="margin-bottom: 20px; text-align: left; white-space: pre-wrap; font-size: 12px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 5px;">${message}</pre>
            <div style="margin-bottom: 15px; font-size: 14px;">
                <strong>Quick checks:</strong><br>
                • All asset folders exist<br>
                • File names are correct<br>
                • Check browser console (F12)<br>
                • JavaScript loading order
            </div>
            <button onclick="location.reload()" style="
                background: #00ffff;
                color: #0a0a1a;
                border: none;
                padding: 12px 24px;
                cursor: pointer;
                font-family: 'Courier New', monospace;
                font-weight: bold;
                border-radius: 4px;
                margin: 5px;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='#ffff00'" onmouseout="this.style.background='#00ffff'">🔄 Refresh Page</button>
            <button onclick="window.FETHI_FACILITY.debug()" style="
                background: #ff00ff;
                color: white;
                border: none;
                padding: 12px 24px;
                cursor: pointer;
                font-family: 'Courier New', monospace;
                font-weight: bold;
                border-radius: 4px;
                margin: 5px;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='#ffff00'; this.style.color='black'" onmouseout="this.style.background='#ff00ff'; this.style.color='white'">🐛 Debug Info</button>
        `;
        
        document.body.appendChild(errorDiv);
    }

    getStatus() {
        return {
            initialized: this.isInitialized,
            progress: this.loadingProgress,
            systems: Array.from(this.systems.keys()),
            performance: PERFORMANCE_DETECTOR.getPerformanceGrade(),
            stats: GAME_LOOP ? GAME_LOOP.getStats() : null
        };
    }

    debug() {
        console.log('🐛 Debug Information:');
        console.log('=====================');
        console.log('Initialization Status:', this.getStatus());
        console.log('Performance:', PERFORMANCE_DETECTOR.getOptimalSettings());
        console.log('Systems:');
        this.systems.forEach((system, name) => {
            console.log(`  ${name}:`, system.getStatus ? system.getStatus() : 'No status method');
        });
        console.log('=====================');
    }
}

// Create the game instance
const GAME = new GameInitializer();

// Global debugging and control interface
window.FETHI_FACILITY = {
    // Core access
    game: GAME,
    config: window.CONFIG,
    
    // System access
    systems: {
        audio: window.AUDIO_SYSTEM,
        character: window.CHARACTER_SYSTEM,
        cursor: window.CURSOR_SYSTEM,
        parallax: window.PARALLAX_SYSTEM,
        animation: window.ANIMATION_CONTROLLER
    },
    
    // Debug methods
    debug: () => GAME.debug(),
    getStatus: () => GAME.getStatus(),
    restart: () => location.reload(),
    
    // Control methods
    setVolume: (volume) => window.AUDIO_SYSTEM && window.AUDIO_SYSTEM.setMasterVolume(volume),
    triggerBackflip: (direction = 'east') => window.CHARACTER_SYSTEM && window.CHARACTER_SYSTEM.playBackflip(direction),
    setParallax: (intensity) => window.PARALLAX_SYSTEM && window.PARALLAX_SYSTEM.setParallaxIntensity(intensity)
};

console.log('🔧 Fethi\'s Anomaly Facility - Debug interface available at window.FETHI_FACILITY');
console.log('   Try: FETHI_FACILITY.debug() for system information');

// Auto-start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM loaded, starting game initialization...');
        setTimeout(() => GAME.initialize(), 100);
    });
} else {
    console.log('⚡ DOM already loaded, starting game initialization...');
    setTimeout(() => GAME.initialize(), 100);
}
