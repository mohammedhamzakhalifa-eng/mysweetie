document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const scrollContainer = document.getElementById('scroll-container');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const waxSeal = document.getElementById('wax-seal');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const starsContainer = document.getElementById('stars');
    const heartsContainer = document.getElementById('hearts');
    const scrollDownHint = document.getElementById('scroll-down-hint');

    // Section 1: Morning Letter Elements for Typewriter
    const title = document.querySelector('.letter-title');
    const lines = document.querySelectorAll('.letter-line');
    const footer = document.querySelector('.letter-footer');

    // Section 2: Cosmic Song Elements for Typewriter & Audio
    const songSection = document.getElementById('song-section');
    const glassLetter = document.getElementById('glass-letter');
    const songLines = document.querySelectorAll('.song-line');
    const cosmicPlayer = document.getElementById('cosmic-player');
    const ramySong = document.getElementById('ramy-song');
    const cosmicPlayBtn = document.getElementById('cosmic-play-btn');
    const cosmicProgress = document.getElementById('cosmic-progress');
    const cosmicProgressBar = document.getElementById('cosmic-progress-bar');

    // Save Section 1 original texts and clear them immediately
    const titleText = title.textContent.trim();
    const linesTexts = Array.from(lines).map(line => line.textContent.trim());
    title.textContent = '';
    lines.forEach(line => line.textContent = '');
    footer.style.opacity = '0';

    // Save Section 2 original texts and clear them immediately
    const songLinesTexts = Array.from(songLines).map(line => line.textContent.trim());
    songLines.forEach(line => line.textContent = '');

    let isEnvelopeOpen = false;
    let isSongSectionActive = false;
    let wasBgMusicPlaying = false; // Tracks if instrumental was active before song
    const MAX_VOLUME = 0.15; // Soft, ambient background music volume

    // Initialize Night Atmosphere
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

    // Cosmic Player Event Listeners (Ramy Sabry Song)
    cosmicPlayBtn.addEventListener('click', toggleRamySong);
    ramySong.addEventListener('timeupdate', updateSongProgress);
    ramySong.addEventListener('ended', onRamySongEnded);
    cosmicProgressBar.addEventListener('click', seekRamySong);

    // Intersection Observer to detect when Section 2 snaps into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Scrolled into Section 2 (Cosmic Song)
                if (!isSongSectionActive) {
                    isSongSectionActive = true;
                    onEnterSongSection();
                } else {
                    // Re-entering: Resume playing Ramy Sabry's song
                    playRamySong();
                }
            } else {
                // Scrolled out of Section 2 (Back to Section 1)
                if (isSongSectionActive && !ramySong.paused) {
                    pauseRamySong();
                }
            }
        });
    }, { threshold: 0.4 }); // Trigger when 40% of the section is visible

    observer.observe(songSection);

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

        // Play and fade in global background instrumental music
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
     * Start the typewriter animation sequence for Section 1 (Morning Letter)
     */
    function startTypewriterSequence() {
        typeText(title, titleText, 70, () => {
            setTimeout(() => {
                typeLine(0);
            }, 400);
        });
    }

    /**
     * Recursively types each line in the morning letter body.
     */
    function typeLine(index) {
        if (index >= lines.length) {
            // All lines typed! Smoothly fade in the footer signature
            footer.style.opacity = '1';
            
            // Reveal scroll-down hint and UNLOCK scrolling down to Section 2
            setTimeout(() => {
                scrollDownHint.classList.add('revealed');
                scrollContainer.style.overflowY = 'scroll'; // Enable scrolling snaps
            }, 1000);
            return;
        }

        const line = lines[index];
        const text = linesTexts[index];

        typeText(line, text, 55, () => {
            if (index === lines.length - 1) {
                line.classList.add('typing-finished');
            }
            
            setTimeout(() => {
                typeLine(index + 1);
            }, 500);
        });
    }

    /**
     * Triggered when Section 2 snaps into view.
     */
    function onEnterSongSection() {
        setTimeout(() => {
            // Reveal glass card container
            glassLetter.classList.add('revealed');
            
            // Automatically play Ramy Sabry song
            playRamySong();
            
            // Start typing song lyrics inside the glass card
            setTimeout(() => {
                typeSongLine(0);
            }, 800);
        }, 300);
    }

    /**
     * Recursively types song lyrics inside the glass card.
     */
    function typeSongLine(index) {
        if (index >= songLines.length) {
            return;
        }

        const line = songLines[index];
        const text = songLinesTexts[index];

        typeText(line, text, 55, () => {
            // When line 2 of the lyrics is typed ("والشمس مكسوفة م الغزل..."), reveal cosmic player
            if (index === 2) {
                cosmicPlayer.classList.add('typed');
                setTimeout(() => {
                    typeSongLine(index + 1);
                }, 1500);
            } else {
                setTimeout(() => {
                    typeSongLine(index + 1);
                }, 500);
            }
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
                const delay = charDelay + (Math.random() * 30 - 15);
                setTimeout(nextChar, Math.max(10, delay));
            } else {
                if (callback) callback();
            }
        }
        nextChar();
    }

    /**
     * Global music button handler (controls bg-music)
     */
    function toggleMusic() {
        if (bgMusic.paused) {
            if (!ramySong.paused) {
                pauseRamySong();
            }
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
            if (!ramySong.paused) {
                pauseRamySong();
            }
        }
    }

    /**
     * Toggles play/pause for Ramy Sabry's song.
     */
    function toggleRamySong() {
        if (ramySong.paused) {
            playRamySong();
        } else {
            pauseRamySong();
        }
    }

    /**
     * Plays Ramy Sabry's song and fades out background instrumental.
     */
    function playRamySong() {
        ramySong.play();
        cosmicPlayBtn.querySelector('.cosmic-play-icon').textContent = '❚❚';
        
        // Disable global music button playing state visual
        musicToggle.classList.remove('playing');
        musicToggle.querySelector('.music-icon').textContent = '🔇';
        
        if (!bgMusic.paused) {
            wasBgMusicPlaying = true;
            fadeOutAudio(bgMusic, 800, () => {
                bgMusic.pause();
            });
        }
    }

    /**
     * Pauses Ramy Sabry's song and restores background instrumental if active.
     */
    function pauseRamySong() {
        ramySong.pause();
        cosmicPlayBtn.querySelector('.cosmic-play-icon').textContent = '▶';
        
        if (wasBgMusicPlaying) {
            fadeInAudio(bgMusic, 1200);
            musicToggle.classList.add('playing');
            musicToggle.querySelector('.music-icon').textContent = '🎵';
            wasBgMusicPlaying = false;
        }
    }

    /**
     * Handles Ramy Sabry's song ending.
     */
    function onRamySongEnded() {
        cosmicPlayBtn.querySelector('.cosmic-play-icon').textContent = '▶';
        cosmicProgress.style.width = '0%';
        
        if (wasBgMusicPlaying) {
            fadeInAudio(bgMusic, 1200);
            musicToggle.classList.add('playing');
            musicToggle.querySelector('.music-icon').textContent = '🎵';
            wasBgMusicPlaying = false;
        }
    }

    /**
     * Updates Ramy Sabry progress bar.
     */
    function updateSongProgress() {
        if (ramySong.duration) {
            const percentage = (ramySong.currentTime / ramySong.duration) * 100;
            cosmicProgress.style.width = `${percentage}%`;
        }
    }

    /**
     * Seeks through Ramy Sabry timeline on progress bar click.
     */
    function seekRamySong(e) {
        const rect = cosmicProgressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const seekPercentage = clickX / width;
        
        if (ramySong.duration) {
            ramySong.currentTime = seekPercentage * ramySong.duration;
        }
    }

    /**
     * Smoothly fades in global background audio.
     */
    function fadeInAudio(audio, duration = 1500) {
        audio.volume = 0;
        
        audio.play().then(() => {
            let start = null;
            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const volume = Math.min((progress / duration) * MAX_VOLUME, MAX_VOLUME);
                audio.volume = volume;
                
                if (progress < duration && audio.volume < MAX_VOLUME) {
                    window.requestAnimationFrame(step);
                }
            }
            window.requestAnimationFrame(step);
        }).catch(err => {
            console.log("Audio play deferred until user interaction is registered.", err);
        });
    }

    /**
     * Smoothly fades out global background audio.
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
