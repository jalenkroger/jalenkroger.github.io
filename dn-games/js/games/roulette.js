/**
 * Roulette Game Logic
 */

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

class RouletteGame {
    constructor() {
        this.bets = []; // { type: 'number'|'color'|'parity', value: any, amount: number, element: HTMLElement }
        this.isSpinning = false;

        this.wheel = document.getElementById('wheel');
        this.board = document.getElementById('betting-board');
        this.resultDisplay = document.getElementById('result-display');
        this.totalBetEl = document.getElementById('total-bet');
        this.btnSpin = document.getElementById('btn-spin');
        this.btnClear = document.getElementById('btn-clear');
        this.chipSelect = document.getElementById('chip-value');

        this.initBoard();
        this.bindEvents();
    }

    initBoard() {
        // Generate numbers 1-36
        // Grid is 3 columns. 
        // Row 1: 1, 2, 3
        // Row 2: 4, 5, 6 ...

        // We need to insert them in order. 
        // The grid-auto-flow is row by default.

        // However, standard roulette board is:
        // 3 6 9 ...
        // 2 5 8 ...
        // 1 4 7 ...
        // But for simplicity in CSS Grid, we'll just do 1-36 in order 
        // and users can map it mentally. Or we can use `order` property.
        // Let's stick to 1-36 sequential for this implementation to match the loop easily.

        for (let i = 1; i <= 36; i++) {
            const cell = document.createElement('div');
            const isRed = RED_NUMBERS.includes(i);
            cell.className = `bet-cell ${isRed ? 'red' : 'black'}`;
            cell.textContent = i;
            cell.dataset.type = 'number';
            cell.dataset.value = i;
            cell.onclick = (e) => this.placeBet(e.target, 'number', i);
            this.board.appendChild(cell);
        }

        // Add Outside Bets (simplified row at bottom)
        const outsideBets = [
            { label: 'EVEN', type: 'parity', value: 'even' },
            { label: 'RED', type: 'color', value: 'red', class: 'red' },
            { label: 'BLACK', type: 'color', value: 'black', class: 'black' },
            { label: 'ODD', type: 'parity', value: 'odd' }
        ];

        outsideBets.forEach(bet => {
            const cell = document.createElement('div');
            cell.className = `bet-cell ${bet.class || ''}`;
            cell.style.gridColumn = 'span 1'; // Span 1 column each? No, we have 3 cols.
            // Let's make them span nicely.
            // Actually, let's just append them and let CSS grid handle wrapping if needed
            // or force them to take up a full row.
            cell.textContent = bet.label;
            cell.dataset.type = bet.type;
            cell.dataset.value = bet.value;
            cell.onclick = (e) => this.placeBet(e.target, bet.type, bet.value);
            this.board.appendChild(cell);
        });
    }

    bindEvents() {
        this.btnSpin.addEventListener('click', () => this.spin());
        this.btnClear.addEventListener('click', () => this.clearBets());

        // Bind 0 click
        const zero = document.querySelector('.bet-cell.zero');
        if (zero) {
            zero.onclick = (e) => this.placeBet(e.target, 'number', 0);
        }
    }

    placeBet(element, type, value) {
        if (this.isSpinning) return;

        const amount = parseInt(this.chipSelect.value);
        if (window.bankroll.getBalance() < amount) {
            alert("Insufficient funds");
            return;
        }

        // Deduct immediately (casino style)
        window.bankroll.transaction(-amount);

        // Add chip visual
        const chip = document.createElement('div');
        chip.className = 'chip';
        element.appendChild(chip);

        this.bets.push({ type, value, amount, element });
        this.updateTotalBet();
    }

    updateTotalBet() {
        const total = this.bets.reduce((sum, bet) => sum + bet.amount, 0);
        this.totalBetEl.textContent = total;
    }

    clearBets() {
        if (this.isSpinning) return;

        // Refund all bets
        const total = this.bets.reduce((sum, bet) => sum + bet.amount, 0);
        window.bankroll.transaction(total);

        // Remove chips
        document.querySelectorAll('.chip').forEach(el => el.remove());
        this.bets = [];
        this.updateTotalBet();
    }

    spin() {
        if (this.bets.length === 0) {
            alert("Place a bet first!");
            return;
        }
        if (this.isSpinning) return;

        this.isSpinning = true;
        this.resultDisplay.style.display = 'none';

        // Random result 0-36
        const result = Math.floor(Math.random() * 37);

        // Calculate rotation
        // 37 segments. 360 / 37 = ~9.73 degrees per segment.
        // We need to align the result to the top (marker).
        // Let's just do a random spin for visual, then snap to result?
        // Or calculate exact rotation.
        // For this simple CSS gradient wheel, the numbers aren't actually visible on the wheel segments easily
        // without complex CSS.
        // So we will just spin it wildly and then show the number in the center.

        const rotations = 5 * 360; // 5 full spins
        const randomOffset = Math.random() * 360;
        const totalRotation = rotations + randomOffset;

        this.wheel.style.transform = `rotate(${totalRotation}deg)`;

        setTimeout(() => {
            this.resolveSpin(result);
        }, 4000); // Match CSS transition time
    }

    resolveSpin(result) {
        this.isSpinning = false;
        this.resultDisplay.textContent = result;
        this.resultDisplay.style.display = 'block';

        // Calculate winnings
        let winnings = 0;
        const isRed = RED_NUMBERS.includes(result);
        const isBlack = !isRed && result !== 0;
        const isEven = result !== 0 && result % 2 === 0;
        const isOdd = result !== 0 && result % 2 !== 0;

        this.bets.forEach(bet => {
            let won = false;
            let multiplier = 0;

            if (bet.type === 'number' && bet.value === result) {
                won = true;
                multiplier = 35;
            } else if (bet.type === 'color') {
                if (bet.value === 'red' && isRed) won = true;
                if (bet.value === 'black' && isBlack) won = true;
                multiplier = 1;
            } else if (bet.type === 'parity') {
                if (bet.value === 'even' && isEven) won = true;
                if (bet.value === 'odd' && isOdd) won = true;
                multiplier = 1;
            }

            if (won) {
                // Return original bet + winnings
                winnings += bet.amount + (bet.amount * multiplier);
            }
        });

        if (winnings > 0) {
            setTimeout(() => {
                alert(`You won $${winnings}!`);
                window.bankroll.transaction(winnings);
            }, 500);
        }

        // Clear board for next round? Or leave chips?
        // Usually casinos leave winning chips. 
        // For simplicity, we'll clear all chips after a round.
        setTimeout(() => {
            document.querySelectorAll('.chip').forEach(el => el.remove());
            this.bets = [];
            this.updateTotalBet();
        }, 2000);
    }
}

window.game = new RouletteGame();
