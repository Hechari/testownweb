// Main initialization and system coordinator
class GameInitializer {
    constructor() {
        this.systems = new Map();
        this.isInitialized = false;
        this.loadingProgress = 0;
        this.totalSystems = 8;
    }

    async initialize() {
        console.log('🚀 Starting Fethi\'s Anomaly Facility initialization...');
        console.log('================================');
        
        try {
            // Phase 1: Basic setup
            this.updateLoadingProgress(10, 'Loading configuration...');
            
            // Wait a moment for scripts to load
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Phase 2: Initialize core systems first
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

    async initializeCoreSystems() {
        console.log('⚙️ Initializing core systems...');
        
        // Initialize core systems in correct order
        const coreSystems = [
            { 
                name: 'pixelScaling', 
                instance: window.PIXEL_SCALER,
                init: () => {
                    if (window.PIXEL_SCALER && window.PIXEL_SCALER.init) {
                        window.PIXEL_SCALER.init();
                        return true;
                    }
                    return false;
                }
            },
            { 
                name: 'performance', 
                instance: window.PERFORMANCE_DETECTOR,
                init: () => true // Already initialized
            },
            { 
                name: 'gameLoop', 
                instance: window.GAME_LOOP,
                init: () => true // Already initialized
            }
        ];
        
        for (const system of coreSystems) {
            try {
                if (system.instance) {
                    if (system.init) {
                        const success = system.init();
                        if (success) {
                            this.systems.set(system.name, system.instance);
                            console.log(`✅ ${system.name} system ready`);
                        } else {
                            console.warn(`⚠️ ${system.name} system initialization failed`);
                        }
                    } else {
                        this.systems.set(system.name, system.instance);
                        console.log(`✅ ${system.name} system ready`);
                    }
                } else {
                    console.warn(`⚠️ ${system.name} system not found`);
                }
            } catch (error) {
                console.error(`❌ Error initializing ${system.name}:`, error);
            }
            
            this.updateLoadingProgress(20 + (30 / coreSystems.length), `Initializing ${system.name}...`);
        }
    }

    async initializeGameSystems() {
        console.log('🎮 Initializing game systems...');
        
        const gameSystems = [
            { 
                name: 'audio', 
                instance: window.AUDIO_SYSTEM, 
                initMethod: 'init',
                optional: false
            },
            { 
                name: 'parallax', 
                instance: window.PARALLAX_SYSTEM, 
                initMethod: 'init',
                optional: false
            },
            { 
                name: 'cursor', 
                instance: window.CURSOR_SYSTEM, 
                initMethod: 'init',
                optional: false
            },
            { 
                name: 'character', 
                instance: window.CHARACTER_SYSTEM, 
                initMethod: 'init',
                optional: false
            }
        ];
        
        for (const system of gameSystems) {
            try {
                if (system.instance && system.instance[system.initMethod]) {
                    await system.instance[system.initMethod]();
                    this.systems.set(system.name, system.instance);
                    console.log(`✅ ${system.name} system ready`);
                } else {
                    const message = `⚠️ ${system.name} system or init method not found`;
                    if (system.optional) {
                        console.warn(message);
                    } else {
                        console.error(message);
                    }
                }
            } catch (error) {
                console.error(`❌ Failed to initialize ${system.name}:`, error);
                // Continue with other systems even if one fails
            }
            
            this.updateLoadingProgress(40 + (30 / gameSystems.length), `Loading ${system.name}...`);
        }
    }

    async initializeInteractionSystems() {
        console.log('🎯 Initializing interaction systems...');
        
        const interactionSystems = [
            { 
                name: 'hoverDetector', 
                instance: window.HOVER_DETECTOR, 
                initMethod: 'init',
                optional: false
            },
            { 
                name: 'animationController', 
                instance: window.ANIMATION_CONTROLLER, 
                initMethod: 'init',
                optional: false
            }
        ];
        
        for (const system of interactionSystems) {
            try {
                if (system.instance && system.instance[system.initMethod]) {
                    await system.instance[system.initMethod]();
                    this.systems.set(system.name, system.instance);
                    console.log(`✅ ${system.name} system ready`);
                } else {
                    const message = `⚠️ ${system.name} system or init method not found`;
                    if (system.optional) {
                        console.warn(message);
                    } else {
                        console.error(message);
                    }
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
        }, 2000);
        
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
        console.log('================================');
        
        // Remove loading screen and start experience
        setTimeout(() => {
            this.removeLoadingScreen();
            this.triggerWelcomeSequence();
        }, 1000);
    }

    removeLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        
        if (loadingScreen && gameContainer) {
            // Add fade-out animation
            loadingScreen.style.transition = 'opacity 0.8s ease';
            loadingScreen.style.opacity = '0';
            
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
Initialization Error: ${error.message}

Systems Status:
${Array.from(this.systems.entries()).map(([name, system]) => 
    `• ${name}: ${system ? 'READY' : 'MISSING'}`).join('\n')}

Loading Progress: ${this.loadingProgress}%

Troubleshooting:
1. Check browser console for 404 errors
2. Verify all JavaScript files are loading
3. Ensure pixel-scaling.js exists in js/engine/
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
                • Check browser console (F12) for errors<br>
                • Verify pixel-scaling.js exists<br>
                • All JavaScript files loading correctly
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
            ">🔄 Refresh Page</button>
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
            ">🐛 Debug Info</button>
        `;
        
        document.body.appendChild(errorDiv);
    }

    getStatus() {
        return {
            initialized: this.isInitialized,
            progress: this.loadingProgress,
            systems: Array.from(this.systems.keys()),
            totalSystems: this.totalSystems
        };
    }

    debug() {
        console.log('🐛 Debug Information:');
        console.log('=====================');
        console.log('Initialization Status:', this.getStatus());
        console.log('Available Systems:');
        console.log('  CONFIG:', !!window.CONFIG);
        console.log('  Utils:', !!window.Utils);
        console.log('  PIXEL_SCALER:', !!window.PIXEL_SCALER);
        console.log('  PERFORMANCE_DETECTOR:', !!window.PERFORMANCE_DETECTOR);
        console.log('  GAME_LOOP:', !!window.GAME_LOOP);
        console.log('  AUDIO_SYSTEM:', !!window.AUDIO_SYSTEM);
        console.log('  PARALLAX_SYSTEM:', !!window.PARALLAX_SYSTEM);
        console.log('  CURSOR_SYSTEM:', !!window.CURSOR_SYSTEM);
        console.log('  CHARACTER_SYSTEM:', !!window.CHARACTER_SYSTEM);
        console.log('  HOVER_DETECTOR:', !!window.HOVER_DETECTOR);
        console.log('  ANIMATION_CONTROLLER:', !!window.ANIMATION_CONTROLLER);
        console.log('=====================');
    }
}

// Create the game instance
const GAME = new GameInitializer();

// Global debugging and control interface
window.FETHI_FACILITY = {
    game: GAME,
    config: window.CONFIG,
    systems: {
        audio: window.AUDIO_SYSTEM,
        character: window.CHARACTER_SYSTEM,
        cursor: window.CURSOR_SYSTEM,
        parallax: window.PARALLAX_SYSTEM,
        animation: window.ANIMATION_CONTROLLER
    },
    debug: () => GAME.debug(),
    getStatus: () => GAME.getStatus(),
    restart: () => location.reload()
};

console.log('🔧 Fethi\'s Anomaly Facility - Debug interface available at window.FETHI_FACILITY');

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
