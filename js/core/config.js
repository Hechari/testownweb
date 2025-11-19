// Central configuration management
const CONFIG = {
    // Pixel Scaling
    PIXEL_SCALE: 3,
    BASE_RESOLUTION: { width: 16, height: 16 },
    
    // Animation Timing
    ANIMATION_TIMING: {
        IDLE_BREATHING: 2000,
        CROUCHING: 500,
        BACKFLIP: 800,
        STATE_TRANSITION: 150,
        CURSOR_TRANSITION: 200
    },
    
    // Performance Settings
    PERFORMANCE: {
        MOBILE_FPS: 30,
        DESKTOP_FPS: 60,
        MOBILE_THRESHOLD: 768,
        FRAME_SKIP_THRESHOLD: 16,
        MAX_PARALLAX_LAYERS: 7
    },
    
    // Color Palette
    COLORS: {
        ANOMALY_PURPLE: '#8B00FF',
        ENERGY_CYAN: '#00FFFF',
        RETRO_BLUE: '#0000AA',
        GLITCH_GREEN: '#00FF00',
        WARNING_ORANGE: '#FF8800',
        DEEP_SPACE: '#000011'
    },
    
    // Asset Paths - CORRECTED FILE NAMES
    PATHS: {
        CHARACTER: {
            IDLE: 'assets/character/breathing-idle/',
            CROUCH: 'assets/character/crouching/', 
            BACKFLIP: {
                EAST: 'assets/character/backflip/east/',
                WEST: 'assets/character/backflip/west/'
            }
        },
        CURSOR: 'assets/cursor/',
        AUDIO: 'assets/audio/',
        BACKGROUND: {
            STARS: 'assets/background/blue-stars.png',
            STARS_DENSE: 'assets/background/blue-with-stars.png',
            SPACE: 'assets/background/blue-back.png',
            ASTEROID_1: 'assets/background/asteroid-1.png', // CORRECTED
            ASTEROID_2: 'assets/background/asteroid-2.png', // CORRECTED
            PLANET_BIG: 'assets/background/prob-planet-big.png',
            PLANET_SMALL: 'assets/background/prob-planet-small.png'
        }
    },
    
    // Game Settings
    GAME: {
        PARALLAX_INTENSITY: 50,
        MOUSE_SENSITIVITY: 1.0,
        AUDIO_VOLUME: 0.7,
        AMBIENT_AUDIO_DELAY: 2000
    }
};

// Make configuration globally available
window.CONFIG = CONFIG;
console.log('✅ CONFIG loaded with corrected asset paths');