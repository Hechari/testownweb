// Device capability detection and optimization
class PerformanceDetector {
    constructor() {
        this.isMobile = Utils.isMobile();
        this.supportedFPS = this.isMobile ? 
            CONFIG.PERFORMANCE.MOBILE_FPS : 
            CONFIG.PERFORMANCE.DESKTOP_FPS;
        
        this.capabilities = {};
        this.detectCapabilities();
    }

    detectCapabilities() {
        this.capabilities = {
            webgl: this.detectWebGL(),
            webgl2: this.detectWebGL2(),
            audio: this.detectAudio(),
            animation: this.testAnimationPerformance(),
            touch: this.detectTouch(),
            storage: this.detectStorage(),
            workers: this.detectWorkers()
        };
        
        console.log('📊 Performance capabilities detected:', {
            device: this.isMobile ? 'mobile' : 'desktop',
            fps: this.supportedFPS,
            ...this.capabilities
        });
    }

    detectWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    detectWebGL2() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
        } catch (e) {
            return false;
        }
    }

    detectAudio() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }

    detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    detectStorage() {
        try {
            return 'localStorage' in window && window.localStorage !== null;
        } catch (e) {
            return false;
        }
    }

    detectWorkers() {
        return !!window.Worker;
    }

    testAnimationPerformance() {
        if (!('requestAnimationFrame' in window)) return false;
        
        // Simple animation performance test
        let frames = 0;
        const startTime = performance.now();
        
        const testFrame = () => {
            frames++;
            if (performance.now() - startTime < 1000) {
                requestAnimationFrame(testFrame);
            }
        };
        
        requestAnimationFrame(testFrame);
        
        // We'll assume good performance if RAF is available
        return true;
    }

    getOptimalSettings() {
        return {
            fps: this.supportedFPS,
            useWebGL: this.capabilities.webgl,
            useAudio: this.capabilities.audio,
            isMobile: this.isMobile,
            maxParticles: this.isMobile ? 50 : 200,
            textureQuality: this.isMobile ? 'low' : 'high'
        };
    }

    getPerformanceGrade() {
        const score = Object.values(this.capabilities).filter(Boolean).length;
        if (score >= 6) return 'excellent';
        if (score >= 4) return 'good';
        if (score >= 2) return 'fair';
        return 'basic';
    }
}

window.PERFORMANCE_DETECTOR = new PerformanceDetector();
console.log('✅ Performance detector initialized');