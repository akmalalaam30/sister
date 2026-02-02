// Game Data
const questions = [
    {
        level: 1,
        question: "What is the prettiest thing in the world?",
        options: ["Moon 🌙", "Diamond 💎", "Greenland ❄️", "Mountains ⛰️"]
    },
    {
        level: 2,
        question: "What shines the brightest without trying too hard?",
        options: ["Sun ☀️", "Stars ✨", "Fire 🔥", "City lights at night 💡"]
    },
    {
        level: 3,
        question: "What can instantly make a bad day better?",
        options: ["Favorite song 🎶", "Coffee ☕", "A good laugh 😂", "First rain after summer 🌧️"]
    },
    {
        level: 4,
        question: "What feels like home, no matter where you are?",
        options: ["Your bed 🛏️", "Your house 🏠", "Your hometown 🌍", "A familiar feeling 💭"]
    },
    {
        level: 5,
        question: "What is rare, priceless, and impossible to replace?",
        options: ["A masterpiece 🖼️", "A perfect gem 💎", "Time ⏳", "A once-in-a-lifetime moment 🌠"]
    }
];

let currentQuestion = 0;

// Start Game
function startGame() {
    playSound('gameMusic');
    switchScreen('startScreen', 'gameScreen');
    loadQuestion();
}

// Load Question
function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showFinalScreen();
        return;
    }

    const q = questions[currentQuestion];
    document.getElementById('currentLevel').textContent = q.level;
    document.getElementById('questionText').textContent = q.question;
    
    const progress = (currentQuestion / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    q.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
        
        // Staggered animation
        setTimeout(() => {
            button.style.animation = 'slideIn 0.5s ease';
        }, index * 100);
    });
}

// Select Answer
function selectAnswer(index) {
    playClickSound();
    
    setTimeout(() => {
        playSound('correctSound');
        showCorrectFeedback();
        
        setTimeout(() => {
            hideCorrectFeedback();
            currentQuestion++;
            loadQuestion();
        }, 1500);
    }, 200);
}

// Show Correct Feedback
function showCorrectFeedback() {
    const feedback = document.getElementById('correctFeedback');
    feedback.classList.add('show');
}

// Hide Correct Feedback
function hideCorrectFeedback() {
    const feedback = document.getElementById('correctFeedback');
    feedback.classList.remove('show');
}

// Show Final Screen
function showFinalScreen() {
    switchScreen('gameScreen', 'finalScreen');
    
    // Stop game music
    const gameMusic = document.getElementById('gameMusic');
    gameMusic.pause();
    
    // Reveal text in sequence
    setTimeout(() => {
        document.querySelector('.line1').classList.add('show');
    }, 500);
    
    setTimeout(() => {
        document.querySelector('.line2').classList.add('show');
    }, 2500);
    
    setTimeout(() => {
        document.querySelector('.line3').classList.add('show');
    }, 4500);
    
    // Show YOU at 7 seconds
    setTimeout(() => {
        document.querySelector('.reveal-answer').classList.add('show');
    }, 7000);
    
    // Show photo right after YOU appears
    setTimeout(() => {
        document.getElementById('photoContainer').classList.add('show');
    }, 8000);
    
    // Start confetti and celebration
    setTimeout(() => {
        playSound('celebrationMusic');
        startConfetti();
    }, 7000);
}

// Switch Screen
function switchScreen(fromScreen, toScreen) {
    document.getElementById(fromScreen).classList.remove('active');
    setTimeout(() => {
        document.getElementById(toScreen).classList.add('active');
    }, 300);
}

// Play Sound
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Play Click Sound (Swoosh)
function playClickSound() {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    
    oscillator.connect(gain);
    gain.connect(audio.destination);
    
    // Rising sweep for swoosh effect
    oscillator.frequency.setValueAtTime(200, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audio.currentTime + 0.15);
    oscillator.type = 'sine';
    
    gain.gain.setValueAtTime(0.2, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.15);
    
    oscillator.start(audio.currentTime);
    oscillator.stop(audio.currentTime + 0.15);
}

// Confetti Animation
function startConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const confettiCount = 150;
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff0000'];
    
    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            
            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }
    
    for (let i = 0; i < confettiCount; i++) {
        confettiPieces.push(new Confetti());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach(confetti => {
            confetti.update();
            confetti.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Handle Window Resize
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti');
    if (canvas.width > 0) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const startScreen = document.getElementById('startScreen');
        if (startScreen.classList.contains('active')) {
            startGame();
        }
    }
});
