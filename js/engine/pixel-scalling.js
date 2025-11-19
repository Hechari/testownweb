// Pixel scaling system for retro aesthetic
class PixelScaler {
    constructor() {
        this.scale = window.CONFIG ? window.CONFIG.PIXEL_SCALE : 3;
        this.baseWidth = 320;
        this.baseHeight = 240;
        this.init();
    }

    init() {
        console.log('🎯 Initializing pixel scaling system...');
        
        // Apply pixelated rendering to the entire document
        document.body.style.imageRendering = 'pixelated';
        document.body.style.transform = `scale(${this.scale})`;
        document.body.style.transformOrigin = 'top left';
        document.body.style.width = `${100 / this.scale}vw`;
        document.body.style.height = `${100 / this.scale}vh`;
        
        // Scale the game container specifically
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.width = `${window.innerWidth / this.scale}px`;
            gameContainer.style.height = `${window.innerHeight / this.scale}px`;
            gameContainer.style.imageRendering = 'pixelated';
        }
        
        console.log(`✅ Pixel scaling applied: ${this.scale}x`);
    }

    updateScale(newScale) {
        this.scale = newScale;
        this.init();
    }

    handleResize() {
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.width = `${window.innerWidth / this.scale}px`;
            gameContainer.style.height = `${window.innerHeight / this.scale}px`;
        }
    }

    getStatus() {
        return {
            scale: this.scale,
            baseWidth: this.baseWidth,
            baseHeight: this.baseHeight
        };
    }
}

// Initialize and expose globally
window.PIXEL_SCALER = new PixelScaler();

// Add resize handler
window.addEventListener('resize', () => {
    window.PIXEL_SCALER.handleResize();
});

console.log('✅ PixelScaler loaded');