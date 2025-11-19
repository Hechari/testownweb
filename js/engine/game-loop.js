// Main game loop and system coordination
class GameLoop {
    constructor() {
        this.isRunning = false;
        this.lastTime = 0;
        this.accumulator = 0;
        this.deltaTime = 1000 / PERFORMANCE_DETECTOR.supportedFPS;
        this.systems = new Map();
        this.frameCount = 0;
        this.fps = 0;
        this.lastFpsUpdate = 0;
    }

    start() {
        if (this.isRunning) {
            console.warn('⚠️ Game loop already running');
            return;
        }
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.lastFpsUpdate = this.lastTime;
        
        console.log(`🎮 Starting game loop at ${PERFORMANCE_DETECTOR.supportedFPS} FPS`);
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
        console.log('⏹️ Game loop stopped');
    }

    registerSystem(name, system) {
        this.systems.set(name, system);
        console.log(`🔧 Registered system: ${name}`);
    }

    unregisterSystem(name) {
        this.systems.delete(name);
        console.log(`🗑️ Unregistered system: ${name}`);
    }

    gameLoop(currentTime = performance.now()) {
        if (!this.isRunning) return;

        // Calculate delta time
        let deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Prevent spiral of death
        deltaTime = Math.min(deltaTime, 100);

        // Update FPS counter
        this.updateFPS(currentTime);

        // Fixed timestep update
        this.accumulator += deltaTime;

        while (this.accumulator >= this.deltaTime) {
            this.update(this.deltaTime);
            this.accumulator -= this.deltaTime;
        }

        // Render
        this.render();

        this.frameCount++;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        // Update all registered systems
        this.systems.forEach((system, name) => {
            if (system.update && typeof system.update === 'function') {
                try {
                    system.update(deltaTime);
                } catch (error) {
                    console.error(`❌ Error updating system ${name}:`, error);
                }
            }
        });
    }

    render() {
        // Render all registered systems
        this.systems.forEach((system, name) => {
            if (system.render && typeof system.render === 'function') {
                try {
                    system.render();
                } catch (error) {
                    console.error(`❌ Error rendering system ${name}:`, error);
                }
            }
        });
    }

    updateFPS(currentTime) {
        if (currentTime - this.lastFpsUpdate >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
            
            // Log FPS occasionally for debugging
            if (this.fps < PERFORMANCE_DETECTOR.supportedFPS - 10) {
                console.warn(`📉 Low FPS: ${this.fps}`);
            }
        }
    }

    getStats() {
        return {
            fps: this.fps,
            systems: this.systems.size,
            running: this.isRunning,
            frameCount: this.frameCount
        };
    }

    setFPS(fps) {
        this.deltaTime = 1000 / fps;
        console.log(`🎯 FPS target changed to: ${fps}`);
    }
}

window.GAME_LOOP = new GameLoop();
console.log('✅ Game loop engine ready');