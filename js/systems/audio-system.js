// Audio management system with spatial effects
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.isMuted = false;
        this.userInteracted = false;
        this.masterVolume = CONFIG.GAME.AUDIO_VOLUME;
        this.ambientPlaying = false;
    }

    async init() {
        console.log('🎵 Initializing audio system...');
        
        if (!PERFORMANCE_DETECTOR.capabilities.audio) {
            console.warn('🔇 Web Audio API not supported on this device');
            return;
        }

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.setupUserInteraction();
            await this.preloadSounds();
            console.log('✅ Audio system ready - awaiting user interaction');
        } catch (error) {
            console.error('❌ Audio system initialization failed:', error);
        }
    }

    setupUserInteraction() {
        const enableAudio = () => {
            if (!this.userInteracted && this.audioContext) {
                this.userInteracted = true;
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log('🔊 Audio context resumed after user interaction');
                        this.startAmbientAudio();
                    });
                }
            }
        };

        // Listen for any user interaction
        const interactionEvents = ['click', 'keydown', 'touchstart', 'mousedown'];
        interactionEvents.forEach(event => {
            document.addEventListener(event, enableAudio, { 
                once: true,
                passive: true 
            });
        });

        // Also enable on game start if user already interacted
        setTimeout(() => {
            if (!this.userInteracted && document.activeElement) {
                enableAudio();
            }
        }, 1000);
    }

    async preloadSounds() {
        const soundPaths = [
            CONFIG.PATHS.AUDIO + 'ambient-hangar.mp3',
            CONFIG.PATHS.AUDIO + 'sfx-scanner.wav',
            CONFIG.PATHS.AUDIO + 'sfx-click.wav',
            CONFIG.PATHS.AUDIO + 'sfx-glitch.wav',
            CONFIG.PATHS.AUDIO + 'sfx-backflip.wav'
        ];

        console.log('📥 Preloading audio files...');
        
        for (const path of soundPaths) {
            try {
                const response = await fetch(path);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                const soundName = this.getSoundName(path);
                
                this.sounds.set(soundName, audioBuffer);
                console.log(`✅ Loaded: ${soundName}`);
            } catch (error) {
                console.warn(`❌ Failed to load: ${path}`, error);
            }
        }
    }

    playSound(soundName, options = {}) {
        if (this.isMuted || !this.audioContext || !this.userInteracted) {
            return null;
        }

        const {
            volume = 1.0,
            loop = false,
            playbackRate = 1.0,
            pan = 0
        } = options;

        const sound = this.sounds.get(soundName);
        if (!sound) {
            console.warn(`🔇 Sound not found: ${soundName}`);
            return null;
        }

        try {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            const pannerNode = this.audioContext.createStereoPanner ? 
                this.audioContext.createStereoPanner() : null;
            
            source.buffer = sound;
            source.loop = loop;
            source.playbackRate.value = playbackRate;
            
            gainNode.gain.value = volume * this.masterVolume;
            
            if (pannerNode) {
                pannerNode.pan.value = pan;
                source.connect(pannerNode);
                pannerNode.connect(gainNode);
            } else {
                source.connect(gainNode);
            }
            
            gainNode.connect(this.audioContext.destination);
            source.start();
            
            return {
                source,
                stop: () => source.stop(),
                setVolume: (vol) => gainNode.gain.value = vol * this.masterVolume,
                setPlaybackRate: (rate) => source.playbackRate.value = rate
            };
        } catch (error) {
            console.warn('🔇 Audio playback error:', error);
            return null;
        }
    }

    startAmbientAudio() {
        if (this.ambientPlaying || !this.userInteracted) return;
        
        const ambient = this.playSound('ambient-hangar', {
            volume: 0.3,
            loop: true
        });
        
        if (ambient) {
            this.ambientPlaying = true;
            console.log('🌌 Ambient audio started');
        }
    }

    playSpatialSound(soundName, x, y, options = {}) {
        // Convert screen coordinates to stereo panning (-1 to 1)
        const screenX = (x / window.innerWidth) * 2 - 1;
        const pan = Utils.clamp(screenX, -1, 1);
        
        // Calculate volume based on distance from center
        const centerX = window.innerWidth / 2;
        const distance = Math.abs(x - centerX);
        const maxDistance = window.innerWidth / 2;
        const distanceVolume = 1 - (distance / maxDistance) * 0.5;
        
        return this.playSound(soundName, {
            ...options,
            pan: pan,
            volume: (options.volume || 1.0) * distanceVolume
        });
    }

    getSoundName(path) {
        return path.split('/').pop().split('.')[0];
    }

    setMasterVolume(volume) {
        this.masterVolume = Utils.clamp(volume, 0, 1);
        console.log(`🔊 Master volume set to: ${this.masterVolume}`);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        console.log(this.isMuted ? '🔇 Audio muted' : '🔊 Audio unmuted');
        return this.isMuted;
    }

    // Public method to explicitly enable audio
    enableAudio() {
        this.userInteracted = true;
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('🔊 Audio context manually resumed');
                this.startAmbientAudio();
            });
        }
    }
}

window.AUDIO_SYSTEM = new AudioSystem();
console.log('✅ Audio system loaded with spatial effects');