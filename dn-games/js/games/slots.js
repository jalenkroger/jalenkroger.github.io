/**
 * Slots Game Logic
 */

const SYMBOLS = ['🍒', '🔔', '🍋', '💎', '7️⃣', '🍇'];
const PAYOUTS = {
    '7️⃣': 50,
    '💎': 25,
    '🔔': 15,
    '🍒': 10,
    '🍋': 5,
    '🍇': 5
};

class SlotsGame {
    constructor() {
        this.reels = [
            document.getElementById('reel-1'),
            document.getElementById('reel-2'),
            document.getElementById('reel-3')
        ];
        this.btnSpin = document.getElementById('btn-spin');
        this.betSelect = document.getElementById('bet-amount');
        this.winMessage = document.getElementById('win-message');

        this.isSpinning = false;
        this.bindEvents();
    }

    bindEvents() {
        this.btnSpin.addEventListener('click', () => this.spin());
    }

    spin() {
        if (this.isSpinning) return;

        const bet = parseInt(this.betSelect.value);
        if (!window.bankroll.transaction(-bet)) return;

        this.isSpinning = true;
        this.winMessage.style.display = 'none';
        this.btnSpin.disabled = true;

        // Start spinning animation
        this.reels.forEach(reel => reel.classList.add('spinning'));

        // Determine results
        const results = [
            this.getRandomSymbol(),
            this.getRandomSymbol(),
            this.getRandomSymbol()
        ];

        // Stop reels one by one
        this.reels.forEach((reel, index) => {
            setTimeout(() => {
                reel.classList.remove('spinning');
                reel.textContent = results[index];

                if (index === 2) {
                    this.resolveSpin(results, bet);
                }
            }, 1000 + (index * 500));
        });
    }

    getRandomSymbol() {
        return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }

    resolveSpin(results, bet) {
        this.isSpinning = false;
        this.btnSpin.disabled = false;

        let multiplier = 0;

        // Check for 3 of a kind
        if (results[0] === results[1] && results[1] === results[2]) {
            multiplier = PAYOUTS[results[0]];
        }
        // Check for any pair
        else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
            multiplier = 2;
        }

        if (multiplier > 0) {
            const winnings = bet * multiplier;
            window.bankroll.transaction(winnings);
            this.showWin(winnings, multiplier === 50); // Jackpot if 50x
        }
    }

    showWin(amount, isJackpot) {
        this.winMessage.textContent = isJackpot ? `JACKPOT! $${amount}` : `WIN! $${amount}`;
        this.winMessage.style.display = 'block';

        // Simple pulse animation
        this.winMessage.animate([
            { transform: 'translate(-50%, -50%) scale(0.8)' },
            { transform: 'translate(-50%, -50%) scale(1.1)' },
            { transform: 'translate(-50%, -50%) scale(1)' }
        ], {
            duration: 300,
            easing: 'ease-out'
        });
    }
}

window.game = new SlotsGame();
