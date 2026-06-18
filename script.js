document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const waxSeal = document.getElementById('wax-seal');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const starsContainer = document.getElementById('stars');
    const heartsContainer = document.getElementById('hearts');

    // Letter Text Elements for Typewriter Effect
    const title = document.querySelector('.letter-title');
    const lines = document.querySelectorAll('.letter-line');
    const footer = document.querySelector('.letter-footer');

    // Save original text content and clear them immediately
    const titleText = title.textContent.trim();
    const linesTexts = Array.from(lines).map(line => line.textContent.trim());

    title.textContent = '';
    lines.forEach(line => {
        line.textContent = '';
    });
    footer.style.opacity = '0'; // Keep hidden initially

    let isEnvelopeOpen = false;
    const MAX_VOLUME = 0.15; // Set music to be very soft and ambient

    // Initialize Atmosphere
    createStars();
    startHeartParticles();

    // Event Listeners
    waxSeal.addEventListener('click', openEnvelope);
    envelopeWrapper.addEventListener('click', (e) => {
        if (!isEnvelopeOpen && !e.target.closest('.letter')) {
            openEnvelope();
        }
    });

    musicToggle.addEventListener('click', toggleMusic);

    /**
     * Creates static and twinkling star elements in the background.
     */
    function createStars() {
        const starCount = window.innerWidth < 600 ? 50 : 90;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            const delay = Math.random() * 4;
            star.style.animationDelay = `${delay}s`;
            star.style.opacity = Math.random() * 0.7 + 0.3;
            
            starsContainer.appendChild(star);
        }
    }

    /**
     * Starts the heart particle interval and pre-populates some hearts.
     */
    function startHeartParticles() {
        for (let i = 0; i < 6; i++) {
            spawnHeart(true);
        }

        setInterval(() => {
            spawnHeart(false);
        }, 700);
    }

    /**
     * Spawns a single floating heart particle.
     */
    function spawnHeart(randomY = false) {
        const heart = document.createElement('div');
        heart.classList.add('heart-particle');
        heart.innerHTML = '❤';

        const size = Math.random() * 14 + 10;
        const duration = Math.random() * 5 + 6;
        const opacity = Math.random() * 0.4 + 0.15;
        const sway = Math.random() * 120 - 60;
        const rotation = Math.random() * 80 - 40;

        heart.style.setProperty('--size', `${size}px`);
        heart.style.setProperty('--duration', `${duration}s`);
        heart.style.setProperty('--opacity', opacity);
        heart.style.setProperty('--sway', `${sway}px`);
        heart.style.setProperty('--rotation', `${rotation}deg`);

        heart.style.left = `${Math.random() * 100}%`;

        if (randomY) {
            const startY = Math.random() * 90;
            heart.style.bottom = `${startY}%`;
            const remainingDuration = duration * (1 - startY / 100);
            heart.style.setProperty('--duration', `${remainingDuration}s`);
        } else {
            heart.style.bottom = `-20px`;
        }

        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    /**
     * Triggers the multi-stage envelope opening animation sequence.
     */
    function openEnvelope() {
        if (isEnvelopeOpen) return;
        isEnvelopeOpen = true;

        envelopeWrapper.classList.add('open');

        // Play and fade in music (smooth volume transition to soft level)
        fadeInAudio(bgMusic, 2000);
        musicToggle.classList.add('playing');
        musicToggle.querySelector('.music-icon').textContent = '🎵';
        musicToggle.setAttribute('aria-label', 'إيقاف الموسيقى');

        // Stage 2: Trigger full letter expansion after animations complete (~1.6s)
        setTimeout(() => {
            envelopeWrapper.classList.add('letter-active');
            
            // Wait another 600ms for letter expand scaling to stabilize before typing
            setTimeout(() => {
                startTypewriterSequence();
            }, 600);
        }, 1600);
    }

    /**
     * Start the typewriter animation sequence: Title -> Lines -> Footer
     */
    function startTypewriterSequence() {
        // Type the Title
        typeText(title, titleText, 70, () => {
            // Pause 400ms then type the first line
            setTimeout(() => {
                typeLine(0);
            }, 400);
        });
    }

    /**
     * Recursively types each line in the letter body.
     */
    function typeLine(index) {
        if (index >= lines.length) {
            // All lines typed! Smoothly fade in the footer signature
            footer.style.opacity = '1';
            return;
        }

        const line = lines[index];
        const text = linesTexts[index];

        typeText(line, text, 55, () => {
            // If it's the last line (eyelashes highlight), add special styling for pulse glow
            if (index === lines.length - 1) {
                line.classList.add('typing-finished');
            }
            
            // Pause 500ms between lines
            setTimeout(() => {
                typeLine(index + 1);
            }, 500);
        });
    }

    /**
     * Core typewriter implementation typing character-by-character.
     */
    function typeText(element, text, charDelay, callback) {
        element.classList.add('typed');
        let index = 0;

        function nextChar() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                // Add natural typing jitter
                const delay = charDelay + (Math.random() * 30 - 15);
                setTimeout(nextChar, Math.max(10, delay));
            } else {
                if (callback) callback();
            }
        }
        nextChar();
    }

    /**
     * Toggles play/pause states for the background audio.
     */
    function toggleMusic() {
        if (bgMusic.paused) {
            fadeInAudio(bgMusic, 1500);
            musicToggle.classList.add('playing');
            musicToggle.querySelector('.music-icon').textContent = '🎵';
            musicToggle.setAttribute('aria-label', 'إيقاف الموسيقى');
        } else {
            fadeOutAudio(bgMusic, 800, () => {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
                musicToggle.querySelector('.music-icon').textContent = '🔇';
                musicToggle.setAttribute('aria-label', 'تشغيل الموسيقى');
            });
        }
    }

    /**
     * Smoothly fades in the audio volume to the MAX_VOLUME level.
     */
    function fadeInAudio(audio, duration = 1500) {
        audio.volume = 0;
        
        audio.play().then(() => {
            let start = null;
            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                // Ramp up to MAX_VOLUME instead of 1.0
                const volume = Math.min((progress / duration) * MAX_VOLUME, MAX_VOLUME);
                audio.volume = volume;
                
                if (progress < duration && audio.volume < MAX_VOLUME) {
                    window.requestAnimationFrame(step);
                }
            }
            window.requestAnimationFrame(step);
        }).catch(err => {
            console.log("Audio play deferred until full user interaction is registered.", err);
        });
    }

    /**
     * Smoothly fades out the audio volume before pausing.
     */
    function fadeOutAudio(audio, duration = 800, callback) {
        const startVolume = audio.volume;
        let start = null;
        
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const volume = Math.max(startVolume - (progress / duration) * startVolume, 0);
            audio.volume = volume;
            
            if (progress < duration && volume > 0) {
                window.requestAnimationFrame(step);
            } else {
                audio.volume = 0;
                if (callback) callback();
            }
        }
        window.requestAnimationFrame(step);
    }
});
