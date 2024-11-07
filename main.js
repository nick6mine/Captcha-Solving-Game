document.addEventListener('DOMContentLoaded', () => {
    const welcomeMenu = document.getElementById('welcomeMenu');
    const gameContainer = document.getElementById('gameContainer');
    const startButton = document.getElementById('startButton');
    const canvas = document.getElementById('captchaCanvas');
    const ctx = canvas.getContext('2d');
    const timerDisplay = document.getElementById('timer');
    const streakDisplay = document.getElementById('streakCount');
    const captchaInput = document.getElementById('captchaInput');
    const submitButton = document.getElementById('submitButton');
    const errorMessage = document.getElementById('errorMessage');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const finalStreakDisplay = document.getElementById('finalStreak');
    const playAgainButton = document.getElementById('playAgainButton');

    let currentCaptcha = '';
    let timeLeft = 7;
    let timerInterval;
    let streak = 0;

    startButton.addEventListener('click', startNewGame);
    playAgainButton.addEventListener('click', startNewGame);

    function startNewGame() {
        welcomeMenu.style.display = 'none';
        gameContainer.style.display = 'block';
        gameOverMessage.style.display = 'none';
        playAgainButton.style.display = 'none';
        streak = 0;
        streakDisplay.textContent = streak;
        startGame();
    }

    function generateCaptcha() {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return captcha;
    }

    function drawCaptcha(text) {
        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add noise (dots)
        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`;
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height, 2, 2
            );
        }

        // Draw text with more distortion
        ctx.font = 'bold 30px Poppins';
        for (let i = 0; i < text.length; i++) {
            ctx.save();
            ctx.translate(30 + i * 25, 35);
            ctx.rotate((Math.random() - 0.5) * 0.5); // More rotation
            ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.8)`; // More transparent
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }

        // Draw multiple confusing lines
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(0, Math.random() * canvas.height);
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.2 + Math.random() * 0.2})`;
            ctx.lineWidth = 1 + Math.random() * 2;
            
            for (let x = 0; x < canvas.width; x += 10) {
                ctx.lineTo(x, Math.sin(x/15) * 15 + canvas.height/2 + (Math.random() - 0.5) * 20);
            }
            
            ctx.stroke();
        }
    }

    function startTimer() {
        timeLeft = 7;
        timerDisplay.textContent = timeLeft;
        
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                showGameOver();
            }
        }, 1000);
    }

    function showGameOver() {
        finalStreakDisplay.textContent = streak;
        gameOverMessage.style.display = 'block';
        playAgainButton.style.display = 'inline-block';
        captchaInput.disabled = true;
        submitButton.disabled = true;
    }

    function checkCaptcha() {
        if (captchaInput.value.toUpperCase() === currentCaptcha) {
            streak++;
            streakDisplay.textContent = streak;
            captchaInput.value = '';
            errorMessage.style.display = 'none';
            startNewCaptcha();
        } else {
            errorMessage.style.display = 'block';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 2000);
            captchaInput.value = '';
        }
        captchaInput.focus();
    }

    function startNewCaptcha() {
        currentCaptcha = generateCaptcha();
        drawCaptcha(currentCaptcha);
        timeLeft = 7;
        timerDisplay.textContent = timeLeft;
    }

    function startGame() {
        captchaInput.disabled = false;
        submitButton.disabled = false;
        currentCaptcha = generateCaptcha();
        drawCaptcha(currentCaptcha);
        startTimer();
        captchaInput.value = '';
        captchaInput.focus();
    }

    captchaInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });

    submitButton.addEventListener('click', checkCaptcha);
    captchaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkCaptcha();
        }
    });
});
