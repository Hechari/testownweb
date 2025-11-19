// Utility functions and helpers
class Utils {
    static async preloadImages(imagePaths) {
        console.log(`🖼️ Preloading ${imagePaths.length} images...`);
        const promises = imagePaths.map(path => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`✅ Loaded: ${path}`);
                    resolve({ path, img, status: 'success' });
                };
                img.onerror = () => {
                    console.warn(`❌ Failed: ${path}`);
                    resolve({ path, img: null, status: 'error' });
                };
                img.src = path;
            });
        });
        
        const results = await Promise.allSettled(promises);
        return results.map(result => result.value);
    }

    static async loadJSON(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            console.log(`✅ Loaded config: ${path}`);
            return data;
        } catch (error) {
            console.warn(`❌ Failed to load JSON: ${path}`, error);
            return null;
        }
    }

    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static getMouseDirection(startX, startY, endX, endY) {
        const dx = endX - startX;
        const dy = endY - startY;
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        if (angle >= -45 && angle < 45) return 'east';
        if (angle >= 45 && angle < 135) return 'south';
        if (angle >= 135 || angle < -135) return 'west';
        return 'north';
    }

    static isMobile() {
        return window.innerWidth <= CONFIG.PERFORMANCE.MOBILE_THRESHOLD;
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    static randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    static formatTime(ms) {
        return `${(ms / 1000).toFixed(2)}s`;
    }

    static createGradientCSS(color1, color2, angle = 45) {
        return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
    }

    static preloadAudio(audioPaths) {
        return Promise.allSettled(
            audioPaths.map(path => {
                return new Promise((resolve, reject) => {
                    const audio = new Audio();
                    audio.preload = 'auto';
                    audio.oncanplaythrough = () => resolve({ path, audio, status: 'success' });
                    audio.onerror = () => resolve({ path, audio: null, status: 'error' });
                    audio.src = path;
                });
            })
        );
    }
}

window.Utils = Utils;
console.log('✅ Utils loaded with enhanced functionality');