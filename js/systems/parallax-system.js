// Parallax background system with multiple layers
class ParallaxSystem {
    constructor() {
        this.layers = [];
        this.mouseX = 0.5;
        this.mouseY = 0.5;
        this.parallaxIntensity = CONFIG.GAME.PARALLAX_INTENSITY;
        this.initialized = false;
    }

    async init() {
        console.log('🌌 Initializing parallax system...');
        
        // Wait for DOM to be ready
        if (!document.getElementById('game-container')) {
            console.error('❌ Game container not found');
            return;
        }

        this.layers = Array.from(document.querySelectorAll('.parallax-layer'));
        
        if (this.layers.length === 0) {
            console.warn('⚠️ No parallax layers found in DOM, creating fallback layers');
            this.createFallbackLayers();
        }
        
        await this.setupBackgrounds();
        this.setupEventListeners();
        
        // Register with game loop
        GAME_LOOP.registerSystem('parallax', this);
        
        this.initialized = true;
        console.log(`✅ Parallax system ready with ${this.layers.length} layers`);
    }

    createFallbackLayers() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;

        const layerData = [
            { class: 'layer-back', depth: 0.1, color: '#000022' },
            { class: 'layer-mid', depth: 0.3, color: '#001144' },
            { class: 'layer-front', depth: 0.6, color: '#002266' },
            { class: 'layer-asteroids', depth: 0.7, color: '#003377' },
            { class: 'layer-planets', depth: 0.8, color: '#004488' },
            { class: 'layer-facility', depth: 0.9, color: '#005599' },
            { class: 'layer-anomaly', depth: 1.0, color: '#8B00FF' }
        ];

        layerData.forEach(layer => {
            const div = document.createElement('div');
            div.className = `parallax-layer ${layer.class}`;
            div.setAttribute('data-depth', layer.depth);
            div.style.background = layer.color;
            div.style.position = 'absolute';
            div.style.top = '0';
            div.style.left = '0';
            div.style.width = '100%';
            div.style.height = '100%';
            gameContainer.appendChild(div);
        });

        this.layers = Array.from(document.querySelectorAll('.parallax-layer'));
    }

    async setupBackgrounds() {
        console.log('🎨 Setting up parallax backgrounds...');
        
        // Preload background images
        const backgroundImages = [
            CONFIG.PATHS.BACKGROUND.SPACE,
            CONFIG.PATHS.BACKGROUND.STARS,
            CONFIG.PATHS.BACKGROUND.STARS_DENSE,
            CONFIG.PATHS.BACKGROUND.ASTEROID_1,
            CONFIG.PATHS.BACKGROUND.ASTEROID_2,
            CONFIG.PATHS.BACKGROUND.PLANET_BIG,
            CONFIG.PATHS.BACKGROUND.PLANET_SMALL
        ];

        const imageResults = await Utils.preloadImages(backgroundImages);
        
        // Set up each layer with proper backgrounds
        this.layers.forEach((layer, index) => {
            const depth = parseFloat(layer.dataset.depth) || 0.5;
            this.setupLayerBackground(layer, index, depth, imageResults);
        });
    }

    setupLayerBackground(layer, index, depth, imageResults) {
        const hue = 220 + (index * 8);
        const saturation = 80 - (index * 5);
        const lightness = 10 + (index * 3);
        const baseColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        switch(index) {
            case 0: // Deep space
                layer.style.background = `
                    ${baseColor},
                    url('${CONFIG.PATHS.BACKGROUND.SPACE}')
                `;
                layer.style.backgroundBlendMode = 'overlay';
                layer.style.backgroundSize = 'cover';
                break;
                
            case 1: // Stars
                layer.style.background = `
                    ${baseColor},
                    url('${CONFIG.PATHS.BACKGROUND.STARS}')
                `;
                layer.style.backgroundBlendMode = 'screen';
                layer.style.backgroundSize = 'cover';
                layer.style.opacity = '0.8';
                break;
                
            case 2: // Dense stars
                layer.style.background = `
                    ${baseColor},
                    url('${CONFIG.PATHS.BACKGROUND.STARS_DENSE}')
                `;
                layer.style.backgroundBlendMode = 'overlay';
                layer.style.backgroundSize = 'cover';
                layer.style.opacity = '0.6';
                break;
                
            case 3: // Asteroids
                layer.style.backgroundImage = `
                    url('${CONFIG.PATHS.BACKGROUND.ASTEROID_1}'),
                    url('${CONFIG.PATHS.BACKGROUND.ASTEROID_2}')
                `;
                layer.style.backgroundRepeat = 'no-repeat';
                layer.style.backgroundPosition = '20% 30%, 80% 70%';
                layer.style.backgroundSize = '150px, 100px';
                layer.style.opacity = '0.7';
                break;
                
            case 4: // Planets
                layer.style.backgroundImage = `
                    url('${CONFIG.PATHS.BACKGROUND.PLANET_BIG}'),
                    url('${CONFIG.PATHS.BACKGROUND.PLANET_SMALL}')
                `;
                layer.style.backgroundRepeat = 'no-repeat';
                layer.style.backgroundPosition = '10% 80%, 90% 20%';
                layer.style.backgroundSize = '200px, 120px';
                layer.style.opacity = '0.8';
                break;
                
            case 5: // Facility
                layer.style.background = `
                    linear-gradient(45deg, transparent 70%, rgba(0, 255, 255, 0.2) 100%),
                    radial-gradient(ellipse at bottom, #001133 0%, transparent 70%)
                `;
                layer.style.opacity = '0.9';
                break;
                
            case 6: // Anomaly
                layer.style.background = `
                    radial-gradient(circle at center, rgba(139, 0, 255, 0.4) 0%, transparent 70%),
                    conic-gradient(from 0deg at 50% 50%, 
                        rgba(139, 0, 255, 0.2), 
                        rgba(0, 255, 255, 0.2), 
                        rgba(139, 0, 255, 0.2))
                `;
                layer.style.mixBlendMode = 'screen';
                break;
                
            default:
                layer.style.background = baseColor;
        }
        
        // Add fallback background color
        layer.style.backgroundColor = baseColor;
    }

    setupEventListeners() {
        // Mouse movement for parallax
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX / window.innerWidth;
            this.mouseY = e.clientY / window.innerHeight;
        });

        // Touch movement for mobile
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouseX = e.touches[0].clientX / window.innerWidth;
                this.mouseY = e.touches[0].clientY / window.innerHeight;
                e.preventDefault();
            }
        }, { passive: false });

        // Device orientation for mobile
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                if (e.gamma && e.beta) {
                    this.mouseX = (e.gamma + 90) / 180;
                    this.mouseY = (e.beta + 90) / 180;
                }
            });
        }
    }

    update(deltaTime) {
        if (!this.initialized) return;

        this.layers.forEach(layer => {
            const depth = parseFloat(layer.dataset.depth) || 0.5;
            const intensity = depth * this.parallaxIntensity;
            
            const xMove = (this.mouseX - 0.5) * intensity;
            const yMove = (this.mouseY - 0.5) * intensity;
            
            layer.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    }

    render() {
        // Additional rendering logic if needed
    }

    registerLayer(className, depth) {
        const layer = document.querySelector(`.${className}`);
        if (layer) {
            layer.setAttribute('data-depth', depth);
            if (!this.layers.includes(layer)) {
                this.layers.push(layer);
            }
        }
    }

    setParallaxIntensity(intensity) {
        this.parallaxIntensity = Utils.clamp(intensity, 0, 100);
        console.log(`🎯 Parallax intensity set to: ${this.parallaxIntensity}`);
    }

    getLayerInfo() {
        return this.layers.map(layer => ({
            className: layer.className,
            depth: parseFloat(layer.dataset.depth) || 0.5,
            visible: layer.style.display !== 'none'
        }));
    }
}

window.PARALLAX_SYSTEM = new ParallaxSystem();
console.log('✅ Parallax system loaded with enhanced backgrounds');