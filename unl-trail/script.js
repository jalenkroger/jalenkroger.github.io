// --- 1. GAME STATE ---
let state = {
    week: 1,
    grades: 90,
    money: 250,
    health: 100,
    gameOver: false
};

// --- 2. DOM ELEMENTS (This is where errors usually happen!) ---
// If the script runs, but these ID's don't exist yet, everything breaks.
// The 'defer' in the HTML <script> tag fixes this.
const elements = {
    week: document.getElementById('stat-week'),
    grades: document.getElementById('stat-grades'),
    money: document.getElementById('stat-money'),
    health: document.getElementById('stat-health'),
    log: document.getElementById('event-log'),
    image: document.getElementById('event-image'),
    
    btnStudy: document.getElementById('btn-study'),
    btnSocialize: document.getElementById('btn-socialize'),
    btnWork: document.getElementById('btn-work'),
    btnRest: document.getElementById('btn-rest'),

    decisionPrompt: document.getElementById('decision-prompt'),
    decisionText: document.getElementById('decision-text'),
    option1Btn: document.getElementById('btn-option1'),
    option2Btn: document.getElementById('btn-option2')
};

// --- 3. SCRIPTED SEMESTER EVENTS (16 Weeks) ---
const semesterEvents = [
    { week: 1, title: "Move-In Day!", text: "You've moved into your dorm (Selleck/Abel/Sandoz). It's hot, and your roommate is blasting music. Welcome to UNL.", image: "" },
    { week: 2, title: "First Day of Classes", text: "You can't find your class in Andrews Hall and end up in the wrong lecture. A classic freshman mistake.", image: "" },
    { week: 3, title: "First Home Game", text: "It's a sea of red. The sounds of 'No Place Like Nebraska' echo from Memorial Stadium. You're deafened by the roar.", image: "" },
    { week: 4, title: "The 'W' Quiz", text: "Your first big quiz is this week. This grade will set the tone for the semester.", image: "" },
    { week: 5, title: "Running Low on Funds", text: "All those trips to Runza and Raising Cane's on 'O' Street are adding up. You're starting to feel broke.", image: "" },
    { week: 6, title: "A Bizarre Smell...", text: "There is an... interesting... agricultural smell wafting from East Campus. You'll get used to it. Maybe.", image: "" },
    { week: 7, title: "The 'Sandoz Flu'", text: "Everyone in your dorm is coughing. You're trying your best not to get sick.", image: "

[Image of tissues]
" },
    { week: 8, title: "MIDTERMS WEEK", text: "This is it. The halfway point. Your grades for the next 7 days are critical. Good luck.", image: "" },
    { week: 9, title: "A Moment of Calm", text: "Midterms are over. You take a walk past the Sheldon Museum to clear your head. It's almost... peaceful.", image: "" },
    { week: 10, title: "Registration Day", text: "You wake up at 7 AM to register for next semester. The class you need is already full. You feel a deep rage.", image: "" },
    { week: 11, title: "It's Freezing.", text: "The wind is howling down 14th street. You severely underestimated the Nebraska winter.", image: "" },
    { week: 12, title: "Homecoming", text: "There's a parade and a lot of school spirit. You feel a sense of belonging.", image: "" },
    { week: 13, title: "The Pre-Thanksgiving Lull", text: "Everyone is just trying to make it to the break. Motivation is at an all-time low.", image: "" },
    { week: 14, title: "Thanksgiving Break", text: "A free week! You go home, eat too much food, and your parents give you $50. You feel human again.", image: "" },
    { week: 15, title: "Dead Week", text: "No more classes, just 1,000 projects due. The library is your new home. You haven't seen the sun in days.", image: "

[Image of coffee cup]
" },
    { week: 16, title: "FINALS WEEK", text: "The final push. Every choice matters. Survive this, and you're free.", image: "" }
];

// --- 4. RANDOM & DECISION EVENTS ---
const randomEvents = {
    study: [
        { text: "A surprise pop quiz!", consequence: () => { updateStat('grades', -10); logEvent("You weren't ready. Your grade takes a hit."); } },
        { text: "You find a great study group!", consequence: () => { updateStat('grades', 10); logEvent("You feel more prepared."); } }
    ],
    socialize: [
        { text: "You run into a friend at the Union!", consequence: () => { updateStat('health', 10); logEvent("A good conversation lifts your spirits."); } },
        { text: "You lose your NCard on O Street!", consequence: () => { updateStat('money', -25); logEvent("You had to pay $25 for a new one."); } }
    ],
    work: [
        { text: "Your boss asks you to cover an extra shift.", consequence: () => { updateStat('money', 30); updateStat('health', -5); logEvent("Extra cash, but you're tired."); } },
        { text: "It's a slow day. You get sent home early.", consequence: () => { updateStat('money', -20); logEvent("You lost out on a few hours' pay."); } }
    ],
    rest: [
        { text: "Your roommate is gone for the weekend.", consequence: () => { updateStat('health', 15); logEvent("You enjoy the peace and quiet. So relaxing."); } },
        { text: "The fire alarm goes off at 3 AM.", consequence: () => { updateStat('health', -10); logEvent("You stand outside in the cold for an hour."); } }
    ]
};

// --- 5. GAME FUNCTIONS ---

// Main game loop, called by the action buttons
function performAction(actionType) {
    if (state.gameOver) return;
    
    // --- A. Clear the log for this week's actions ---
    elements.log.innerHTML = '';
    
    // --- B. Apply Action Consequences ---
    switch (actionType) {
        case 'study':
            updateStat('grades', 10);
            updateStat('health', -5);
            updateStat('money', -5); // Cost of coffee
            logEvent("You hit the books. Your grades improve, but you're a bit tired.");
            if (Math.random() < 0.3) triggerRandomEvent('study');
            break;
        case 'socialize':
            updateStat('health', 15);
            updateStat('grades', -5);
            updateStat('money', -20);
            logEvent("You hang with friends. You feel better, but your wallet is lighter and you missed study time.");
            if (Math.random() < 0.3) triggerRandomEvent('socialize');
            break;
        case 'work':
            updateStat('money', 40);
            updateStat('health', -10);
            updateStat('grades', -5);
            logEvent("You work a shift. You earned $40, but it was tiring and you missed study time.");
            if (Math.random() < 0.3) triggerRandomEvent('work');
            break;
        case 'rest':
            updateStat('health', 20);
            updateStat('grades', -2); // A little bit of coasting
            logEvent("You take it easy and recharge. Your health improves.");
            if (Math.random() < 0.3) triggerRandomEvent('rest');
            break;
    }

    // --- C. Special Week 14 (Thanksgiving) Bonus ---
    if (state.week === 14) {
         logEvent("You're on break! You get some rest and your family gives you cash.");
         updateStat('health', 30);
         updateStat('money', 50);
    } else {
        // --- D. Apply Natural Weekly Decay (except on break) ---
        updateStat('money', -15); // Weekly cost of living
        logEvent("You spent $15 on food and essentials.");
    }

    // --- E. Advance Week ---
    state.week++;
    
    // --- F. Check Win/Lose Conditions & Load Next Event ---
    if (!checkGameOver()) {
        loadWeek(state.week); // Load the *next* week's event
    }
}

// Loads the scripted event for the given week
function loadWeek(weekNumber) {
    if (weekNumber > 16) return; // Game is over, don't load
    
    const event = semesterEvents[weekNumber - 1];
    
    // Add new content to the log (don't clear it)
    logEvent(event.title, 'title');
    logEvent(event.text);
    
    elements.image.textContent = event.image;
    updateUI(); // Update all stats (including the week number)
}

// Triggers a random event from the specified category
function triggerRandomEvent(type) {
    const event = randomEvents[type][Math.floor(Math.random() * randomEvents[type].length)];
    event.consequence();
}

// Helper to log a new message (now logs to the *bottom* for correct order)
function logEvent(message, type = 'normal') {
    elements.log.innerHTML += `<p class="${type}">${message}</p>`;
    // Scroll to the bottom of the log
    elements.log.scrollTop = elements.log.scrollHeight;
}

// Helper to safely update a stat
function updateStat(stat, value) {
    state[stat] += value;
    // Clamp stats
    if (stat === 'health' || stat === 'grades') {
        if (state[stat] > 100) state[stat] = 100;
    }
}

// Update the visual display (NOW INCLUDES WEEK)
function updateUI() {
    elements.week.textContent = state.week;
    elements.grades.textContent = state.grades;
    elements.money.textContent = state.money;
    elements.health.textContent = state.health;

    // Add 'danger' styling
    elements.grades.style.color = state.grades < 60 ? '#D00000' : '#FFF';
    elements.money.style.color = state.money < 0 ? '#D00000' : '#FFF';
    elements.health.style.color = state.health < 30 ? '#D00000' : '#FFF';
}

// Disable all action buttons
function disableActions() {
    elements.btnStudy.disabled = true;
    elements.btnSocialize.disabled = true;
    elements.btnWork.disabled = true;
    elements.btnRest.disabled = true;
}

// Check for win/lose conditions
function checkGameOver() {
    if (state.gameOver) return true;

    let loseMessage = "";
    if (state.grades < 50) {
        loseMessage = "You flunked out! Your GPA was too low.";
    } else if (state.money < -50) {
        loseMessage = "You're broke! You have to drop out and work full-time.";
    } else if (state.health <= 0) {
        loseMessage = "You collapsed from exhaustion and were sent home.";
    }

    if (loseMessage) {
        logEvent(`GAME OVER. ${loseMessage}`);
        disableActions();
        state.gameOver = true;
        return true;
    } else if (state.week > 16) {
        // This is the win condition, so we just update the UI
        updateUI(); // Show week 17 (or 16, depending on order)
        logEvent(`CONGRATULATIONS! You survived the semester with $${state.money} and a ${state.grades}% GPA. Welcome to winter break!`);
        disableActions();
        state.gameOver = true;
        return true;
    }
    
    return false; // Game is not over
}

// --- 6. INITIALIZE GAME ---
// We can now safely run the initialization code because 'defer'
// guarantees the HTML is ready.
elements.log.innerHTML = ''; // Clear hard-coded HTML
loadWeek(1); // Load Week 1

// --- 7. BIND ACTIONS ---
elements.btnStudy.addEventListener('click', () => performAction('study'));
elements.btnSocialize.addEventListener('click', () => performAction('socialize'));
elements.btnWork.addEventListener('click', () => performAction('work'));
elements.btnRest.addEventListener('click', () => performAction('rest'));