document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Stories ---
    const stories = [
      {
        title: "Husker Football",
        lines: [
          "Nebraska lost 21-17 to No. 23 USC, extending its losing",
          "streak against ranked teams. The Blackshirts held USC",
          "to a season low 21 points, but it was not enough.",
          "The Husker offense looked balanced in the first half with",
          "quarterback Dylan Raiola and running back Emmett Johnson.",
          "That changed when Raiola left with a right leg injury."
        ]
      },
      {
        title: "UNL Budget",
        lines: [
          "The University of Nebraska-Lincoln is proposing to cut",
          "meteorology and five other programs to address a $27.5",
          "million budget deficit. The university used a 'data-driven",
          "approach' with 18 metrics to identify programs.",
          "Faculty from the statistics department called the metrics",
          "flawed, like comparing 'apples to pumpkins'."
        ]
      },
      {
        title: "Cannabis Loopholes",
        lines: [
          "Recreational marijuana is illegal in Nebraska. However,",
          "dispensaries like Grateful Green are legally selling THC",
          "products by using a loophole in the 2019 Nebraska Hemp",
          "Farming Act. The law allows the sale of hemp products",
          "with less than 0.03% delta-9 THC. Shops sell THCA,",
          "which is below this legal limit when dry. The loophole",
          "is that THCA turns into THC when heated."
        ]
      }
    ];

    // --- 2. Get HTML Elements ---
    const gameContainer = document.getElementById('game-container');
    const countdownEl = document.getElementById('countdown');
    const gameContent = document.getElementById('game-content');
    const resultsScreen = document.getElementById('results-screen');
    
    const textToTypeEl = document.getElementById('text-to-type');
    const typingArea = document.getElementById('typing-area'); 
    const startBtn = document.getElementById('start-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    const timerEl = document.getElementById('timer').querySelector('strong');
    const wpmEl = document.getElementById('wpm').querySelector('strong');

    const resultsWpm = document.getElementById('results-wpm');
    const resultsAccuracy = document.getElementById('results-accuracy');
    const resultsAdjWPM = document.getElementById('results-adj-wpm');
    const resultsChars = document.getElementById('results-chars');
    const resultsErrors = document.getElementById('results-errors');
    const resultsTime = document.getElementById('results-time');
    const resultsMessage = document.getElementById('results-message');

    // --- 3. Game State Variables ---
    let timer;
    let time = 0;
    let gameStarted = false;
    let currentStory;
    
    let lineErrors = 0;
    let totalStoryErrors = 0;
    let totalStoryChars = 0;
    let totalCharsCompleted = 0; 
    let currentLineText = '';

    // --- 4. Game Functions ---

    function prepareGame() {
        gameStarted = false;
        time = 0;
        lineErrors = 0;
        totalStoryErrors = 0;
        totalStoryChars = 0;
        totalCharsCompleted = 0;
        
        // --- FIX: Simple logic ---
        resultsScreen.classList.add('hidden');
        gameContent.classList.remove('hidden');
        // --- End of fix ---

        countdownEl.style.display = 'none';
        
        startBtn.innerText = 'Start';
        startBtn.disabled = false;
        typingArea.disabled = true;
        typingArea.value = '';
        typingArea.classList.remove('error');
        
        timerEl.innerText = '0s';
        wpmEl.innerText = '0';
        
        textToTypeEl.innerHTML = ''; 
        
        currentStory = stories[Math.floor(Math.random() * stories.length)];
        totalStoryChars = currentStory.lines.reduce((acc, line) => acc + line.length, 0);
        
        loadNewStory();
    }

    function loadNewStory() {
        textToTypeEl.innerHTML = ''; 
        
        currentStory.lines.forEach((line, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.classList.add('line');
            
            line.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.classList.add('char');
                charSpan.innerText = char;
                lineDiv.appendChild(charSpan);
            });
            
            if (index === 0) {
                lineDiv.classList.add('current-line');
                currentLineText = line;
                const firstChar = lineDiv.querySelector('.char');
                if (firstChar) {
                    firstChar.classList.add('current-letter');
                }
            }
            textToTypeEl.appendChild(lineDiv);
        });
    }

    function startCountdown() {
        startBtn.disabled = true;
        countdownEl.style.display = 'flex';
        let count = 3;
        countdownEl.innerText = count;

        const countdownTimer = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.innerText = count;
            } else if (count === 0) {
                countdownEl.innerText = 'GO!';
            } else {
                clearInterval(countdownTimer);
                countdownEl.style.display = 'none';
                beginTypingTest(); 
            }
        }, 800);
    }

    function beginTypingTest() {
        gameStarted = true;
        typingArea.disabled = false;
        typingArea.focus();
        timer = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        time++;
        timerEl.innerText = `${time}s`;
        
        const typedWords = (totalCharsCompleted / 5); 
        const minutes = time / 60;
        
        if (minutes > 0) {
            const wpm = (typedWords / minutes).toFixed(0);
            wpmEl.innerText = wpm;
        }
    }

    function checkTyping() {
        if (!gameStarted) return;
        
        const currentLineEl = textToTypeEl.querySelector('.current-line');
        if (!currentLineEl) return;
        
        const storyChars = currentLineEl.querySelectorAll('.char');
        const typedText = typingArea.value;
        const typedLength = typedText.length;
        
        let hasError = false;
        let lastKeystrokeError = false;
        lineErrors = 0; 

        storyChars.forEach((charSpan, index) => {
            const typedChar = typedText[index];
            charSpan.classList.remove('correct', 'incorrect', 'current-letter');
            
            if (typedChar == null) {
            } else if (typedChar === charSpan.innerText) {
                charSpan.classList.add('correct');
            } else {
                charSpan.classList.add('incorrect');
                hasError = true;
                lineErrors++;
                if (index === typedLength - 1) { 
                    lastKeystrokeError = true;
                }
            }
        });

        if (typedLength < storyChars.length) {
            storyChars[typedLength].classList.add('current-letter');
        }
        
        if (hasError) {
            typingArea.classList.add('error');
            if (lastKeystrokeError) {
                gameContainer.classList.add('shake-error');
                setTimeout(() => {
                    gameContainer.classList.remove('shake-error');
                }, 200);
            }
        } else {
            typingArea.classList.remove('error');
        }

        if (!hasError && typedLength === storyChars.length) {
            moveToNextLine();
        }
    }
    
    function moveToNextLine() {
        totalCharsCompleted += currentLineText.length;
        totalStoryErrors += lineErrors;
        lineErrors = 0; 

        const currentLineEl = textToTypeEl.querySelector('.current-line');
        currentLineEl.classList.remove('current-line');
        currentLineEl.classList.add('completed');
        
        const nextLineEl = currentLineEl.nextElementSibling;
        
        if (nextLineEl) {
            nextLineEl.classList.add('current-line');
            currentLineText = nextLineEl.innerText; 
            
            const firstChar = nextLineEl.querySelector('.char');
            if (firstChar) {
                firstChar.classList.add('current-letter');
            }
            
            nextLineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            typingArea.value = ''; 
            typingArea.classList.remove('error');
        } else {
            finishGame();
        }
    }

    function finishGame() {
        clearInterval(timer);
        gameStarted = false;
        typingArea.disabled = true;
        
        const grossWPM = parseInt(wpmEl.innerText);
        const correctChars = totalStoryChars - totalStoryErrors;
        const minutes = time / 60;
        
        let accuracy = ((correctChars / totalStoryChars) * 100);
        accuracy = (accuracy < 0 ? 0 : accuracy).toFixed(1);
        
        let adjustedWPM = 0;
        if (minutes > 0) {
            adjustedWPM = Math.floor((correctChars / 5) / minutes);
        }
        adjustedWPM = (adjustedWPM < 0 ? 0 : adjustedWPM);

        resultsWpm.innerText = grossWPM;
        resultsAccuracy.innerText = accuracy;
        resultsAdjWPM.innerText = adjustedWPM;
        resultsChars.innerText = totalStoryChars;
        resultsErrors.innerText = totalStoryErrors;
        resultsTime.innerText = time;
        
        resultsMessage.innerText = getMotivationalMessage(adjustedWPM);
        
        // --- FIX: Simple logic ---
        gameContent.classList.add('hidden');
        resultsScreen.classList.remove('hidden'); 
        // --- End of fix ---
    }

    function getMotivationalMessage(wpm) {
        if (wpm < 30) return "Good start! Keep practicing!";
        else if (wpm < 50) return "Solid speed! You're getting fast.";
        else if (wpm < 70) return "Impressive! That's fast typing!";
        else return "Woah! Are you a robot?! 🤖";
    }
    
    // --- 5. Event Listeners ---
    startBtn.addEventListener('click', startCountdown); 
    playAgainBtn.addEventListener('click', prepareGame); 
    typingArea.addEventListener('input', checkTyping);

    // --- 6. Initial Setup ---
    prepareGame(); 
});