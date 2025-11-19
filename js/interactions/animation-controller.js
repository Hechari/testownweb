// Animation state machine and transition management
class AnimationController {
    constructor() {
        this.stateMachine = this.createStateMachine();
        this.currentState = 'idle';
        this.previousState = 'idle';
        this.stateHistory = [];
        this.maxHistory = 10;
        this.transitionCallbacks = new Map();
    }

    init() {
        console.log('🎭 Initializing animation controller...');
        this.setupStateTransitions();
        this.setupGlobalEventListeners();
        console.log('✅ Animation controller ready with state machine');
    }

    createStateMachine() {
        return {
            idle: {
                transitions: {
                    hover_east: 'backflip_east',
                    hover_west: 'backflip_west', 
                    click: 'crouching',
                    timeout: 'sleeping',
                    curious: 'curious'
                },
                onEnter: () => this.onStateEnter('idle'),
                onExit: () => this.onStateExit('idle')
            },
            backflip_east: {
                transitions: {
                    complete: 'idle',
                    interrupt: 'idle'
                },
                onEnter: () => this.onStateEnter('backflip_east'),
                onExit: () => this.onStateExit('backflip_east')
            },
            backflip_west: {
                transitions: {
                    complete: 'idle',
                    interrupt: 'idle'
                },
                onEnter: () => this.onStateEnter('backflip_west'),
                onExit: () => this.onStateExit('backflip_west')
            },
            crouching: {
                transitions: {
                    complete: 'idle',
                    hover: 'alert',
                    double_click: 'excited'
                },
                onEnter: () => this.onStateEnter('crouching'),
                onExit: () => this.onStateExit('crouching')
            },
            sleeping: {
                transitions: {
                    hover: 'idle',
                    click: 'curious',
                    wake_up: 'idle'
                },
                onEnter: () => this.onStateEnter('sleeping'),
                onExit: () => this.onStateExit('sleeping')
            },
            curious: {
                transitions: {
                    satisfied: 'idle',
                    scared: 'crouching',
                    excited: 'backflip_east'
                },
                onEnter: () => this.onStateEnter('curious'),
                onExit: () => this.onStateExit('curious')
            },
            alert: {
                transitions: {
                    calm: 'idle',
                    threat: 'crouching',
                    all_clear: 'idle'
                },
                onEnter: () => this.onStateEnter('alert'),
                onExit: () => this.onStateExit('alert')
            },
            excited: {
                transitions: {
                    calm: 'idle',
                    tired: 'sleeping'
                },
                onEnter: () => this.onStateEnter('excited'),
                onExit: () => this.onStateExit('excited')
            }
        };
    }

    setupStateTransitions() {
        // Animation end listeners
        document.addEventListener('animationend', (e) => {
            const animationName = e.animationName;
            
            if (animationName.includes('crouch') && this.currentState === 'crouching') {
                this.transitionToState('complete');
            }
            
            if ((animationName.includes('backflip-east') || animationName.includes('backflip-west')) && 
                (this.currentState === 'backflip_east' || this.currentState === 'backflip_west')) {
                this.transitionToState('complete');
            }
        });

        // CSS animation iteration for looping animations
        document.addEventListener('animationiteration', (e) => {
            if (e.animationName.includes('idle-breathing') && this.currentState === 'idle') {
                // Idle animation looped, could trigger random state changes
                if (Math.random() < 0.01) { // 1% chance
                    this.transitionToState('curious');
                }
            }
        });
    }

    setupGlobalEventListeners() {
        // Global click handler for state transitions
        document.addEventListener('click', (e) => {
            if (this.currentState === 'idle') {
                this.transitionToState('click');
            } else if (this.currentState === 'sleeping') {
                this.transitionToState('click');
            } else if (this.currentState === 'crouching') {
                // Check for double click
                this.handleDoubleClick(e);
            }
        });

        // Global key handlers for debug and testing
        document.addEventListener('keydown', (e) => {
            if (e.key === '1') this.transitionToState('hover_east');
            if (e.key === '2') this.transitionToState('hover_west');
            if (e.key === '3') this.transitionToState('click');
            if (e.key === '4') this.transitionToState('timeout');
            if (e.key === '0') this.transitionToState('complete');
            
            // Debug info
            if (e.key === 'd' && e.ctrlKey) {
                console.log('🐛 Animation Controller Debug:', {
                    currentState: this.currentState,
                    previousState: this.previousState,
                    history: this.stateHistory,
                    machine: this.stateMachine
                });
            }
        });

        // Auto sleep timer
        setInterval(() => {
            if (this.currentState === 'idle' && Math.random() < 0.001) {
                this.transitionToState('timeout');
            }
        }, 1000);
    }

    transitionToState(transition, direction = null) {
        const currentStateConfig = this.stateMachine[this.currentState];
        
        if (!currentStateConfig) {
            console.error(`❌ Unknown current state: ${this.currentState}`);
            return false;
        }

        const targetState = currentStateConfig.transitions[transition];
        
        if (!targetState) {
            console.warn(`⚠️ No transition '${transition}' from state '${this.currentState}'`);
            return false;
        }

        // Execute exit callback for current state
        if (currentStateConfig.onExit) {
            currentStateConfig.onExit();
        }

        // Update state history
        this.previousState = this.currentState;
        this.currentState = targetState;
        this.stateHistory.push({
            from: this.previousState,
            to: this.currentState,
            transition: transition,
            timestamp: Date.now()
        });

        // Keep history manageable
        if (this.stateHistory.length > this.maxHistory) {
            this.stateHistory.shift();
        }

        // Execute enter callback for new state
        const newStateConfig = this.stateMachine[this.currentState];
        if (newStateConfig && newStateConfig.onEnter) {
            newStateConfig.onEnter();
        }

        // Update character animation
        if (CHARACTER_SYSTEM) {
            const [animation, animDirection] = targetState.split('_');
            CHARACTER_SYSTEM.playAnimation(animation, animDirection || direction);
        }

        // Trigger transition callbacks
        this.triggerTransitionCallbacks(transition, targetState);

        console.log(`🔄 State transition: ${this.previousState} → ${this.currentState} (via ${transition})`);
        return true;
    }

    onStateEnter(state) {
        console.log(`🚪 Entering state: ${state}`);
        
        // State-specific enter logic
        switch(state) {
            case 'sleeping':
                // Reduce audio volume
                if (AUDIO_SYSTEM) {
                    AUDIO_SYSTEM.setMasterVolume(0.3);
                }
                break;
                
            case 'alert':
                // Play alert sound
                if (AUDIO_SYSTEM) {
                    AUDIO_SYSTEM.playSound('sfx-glitch', 0.4);
                }
                break;
        }
    }

    onStateExit(state) {
        console.log(`🚪 Exiting state: ${state}`);
        
        // State-specific exit logic
        switch(state) {
            case 'sleeping':
                // Restore audio volume
                if (AUDIO_SYSTEM) {
                    AUDIO_SYSTEM.setMasterVolume(CONFIG.GAME.AUDIO_VOLUME);
                }
                break;
        }
    }

    handleDoubleClick(e) {
        // Simple double-click detection
        if (!this.lastClickTime) {
            this.lastClickTime = Date.now();
            return;
        }

        const now = Date.now();
        if (now - this.lastClickTime < 300) { // 300ms double-click threshold
            this.transitionToState('double_click');
        }
        this.lastClickTime = now;
    }

    registerTransitionCallback(transition, callback) {
        if (!this.transitionCallbacks.has(transition)) {
            this.transitionCallbacks.set(transition, []);
        }
        this.transitionCallbacks.get(transition).push(callback);
    }

    triggerTransitionCallbacks(transition, newState) {
        const callbacks = this.transitionCallbacks.get(transition) || [];
        callbacks.forEach(callback => {
            try {
                callback(this.previousState, newState, transition);
            } catch (error) {
                console.error('❌ Transition callback error:', error);
            }
        });
    }

    getCurrentState() {
        return this.currentState;
    }

    getStateHistory() {
        return [...this.stateHistory];
    }

    forceState(state) {
        if (this.stateMachine[state]) {
            this.currentState = state;
            if (CHARACTER_SYSTEM) {
                const [animation, direction] = state.split('_');
                CHARACTER_SYSTEM.playAnimation(animation, direction);
            }
            return true;
        }
        return false;
    }

    // Debug method to visualize state machine
    visualizeStateMachine() {
        console.log('🕸️ State Machine Visualization:');
        Object.entries(this.stateMachine).forEach(([state, config]) => {
            console.log(`  ${state} →`, config.transitions);
        });
    }
}

window.ANIMATION_CONTROLLER = new AnimationController();
console.log('✅ Animation controller loaded with state machine');