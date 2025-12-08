/**
 * Video Poker Logic (Jacks or Better)
 */

const PAYTABLE = [
    { name: 'Royal Flush', multiplier: 250 },
    { name: 'Straight Flush', multiplier: 50 },
    { name: 'Four of a Kind', multiplier: 25 },
    { name: 'Full House', multiplier: 9 },
    { name: 'Flush', multiplier: 6 },
    { name: 'Straight', multiplier: 4 },
    { name: 'Three of a Kind', multiplier: 3 },
    { name: 'Two Pair', multiplier: 2 },
    { name: 'Jacks or Better', multiplier: 1 }
];

class VideoPoker {
    constructor() {
        this.deck = new Deck();
        this.hand = [];
        this.held = [false, false, false, false, false];
        this.stage = 'deal'; // 'deal' or 'draw'
        this.currentBet = 0;

        this.cardsArea = document.getElementById('cards-area');
        this.paytableEl = document.getElementById('paytable');
        this.messageEl = document.getElementById('message-display');
        this.btnDeal = document.getElementById('btn-deal');
        this.betInput = document.getElementById('bet-amount');

        this.initUI();
        this.bindEvents();
    }

    initUI() {
        // Render Paytable
        this.paytableEl.innerHTML = '';
        PAYTABLE.forEach(item => {
            this.paytableEl.innerHTML += `
                <div class="paytable-row" id="pay-${item.name.replace(/\s+/g, '-')}">
                    <span>${item.name}</span>
                    <span>x${item.multiplier}</span>
                </div>
            `;
        });

        // Render empty card slots
        this.renderCards(true);
    }

    bindEvents() {
        this.btnDeal.addEventListener('click', () => this.handleAction());
    }

    handleAction() {
        if (this.stage === 'deal') {
            this.deal();
        } else {
            this.draw();
        }
    }

    deal() {
        const bet = parseInt(this.betInput.value);
        if (isNaN(bet) || bet <= 0) return;
        if (!window.bankroll.transaction(-bet)) return;

        this.currentBet = bet;
        this.deck.reset();
        this.hand = [];
        this.held = [false, false, false, false, false];

        for (let i = 0; i < 5; i++) {
            this.hand.push(this.deck.deal());
        }

        this.stage = 'draw';
        this.btnDeal.textContent = 'DRAW';
        this.messageEl.textContent = 'Select cards to hold';
        this.renderCards();
        this.highlightPaytable(null);
    }

    draw() {
        // Replace unheld cards
        for (let i = 0; i < 5; i++) {
            if (!this.held[i]) {
                this.hand[i] = this.deck.deal();
            }
        }

        this.renderCards();
        const result = this.evaluateHand(this.hand);

        if (result) {
            const winAmount = this.currentBet * result.multiplier;
            window.bankroll.transaction(winAmount);
            this.messageEl.textContent = `${result.name}! You won $${winAmount}`;
            this.highlightPaytable(result.name);
        } else {
            this.messageEl.textContent = 'Game Over';
        }

        this.stage = 'deal';
        this.btnDeal.textContent = 'DEAL';
    }

    toggleHold(index) {
        if (this.stage !== 'draw') return;
        this.held[index] = !this.held[index];
        this.renderCards();
    }

    renderCards(empty = false) {
        this.cardsArea.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'card-wrapper';

            const cardEl = document.createElement('div');
            if (empty) {
                cardEl.className = 'card card-back';
            } else {
                const card = this.hand[i];
                cardEl.className = `card ${['♥', '♦'].includes(card.suit) ? 'red' : 'black'}`;
                cardEl.innerHTML = `
                    <div class="card-top">${card.value}${card.suit}</div>
                    <div class="card-center">${card.suit}</div>
                    <div class="card-bottom" style="transform: rotate(180deg);">${card.value}${card.suit}</div>
                `;
            }

            const holdBtn = document.createElement('button');
            holdBtn.className = `btn-hold ${this.held[i] ? 'held' : ''}`;
            holdBtn.textContent = this.held[i] ? 'HELD' : 'HOLD';
            holdBtn.onclick = () => this.toggleHold(i);
            if (empty || this.stage === 'deal') holdBtn.disabled = true;

            wrapper.appendChild(cardEl);
            wrapper.appendChild(holdBtn);
            this.cardsArea.appendChild(wrapper);
        }
    }

    highlightPaytable(name) {
        document.querySelectorAll('.paytable-row').forEach(el => el.classList.remove('active'));
        if (name) {
            const id = `pay-${name.replace(/\s+/g, '-')}`;
            const el = document.getElementById(id);
            if (el) el.classList.add('active');
        }
    }

    // Hand Evaluation Logic
    evaluateHand(hand) {
        // Sort by value
        const values = hand.map(c => this.getValueRank(c.value)).sort((a, b) => a - b);
        const suits = hand.map(c => c.suit);

        const isFlush = suits.every(s => s === suits[0]);
        const isStraight = this.checkStraight(values);
        const counts = this.getValueCounts(values);

        // Royal Flush
        if (isFlush && isStraight && values[0] === 10) return PAYTABLE.find(p => p.name === 'Royal Flush');

        // Straight Flush
        if (isFlush && isStraight) return PAYTABLE.find(p => p.name === 'Straight Flush');

        // 4 of a Kind
        if (counts.includes(4)) return PAYTABLE.find(p => p.name === 'Four of a Kind');

        // Full House
        if (counts.includes(3) && counts.includes(2)) return PAYTABLE.find(p => p.name === 'Full House');

        // Flush
        if (isFlush) return PAYTABLE.find(p => p.name === 'Flush');

        // Straight
        if (isStraight) return PAYTABLE.find(p => p.name === 'Straight');

        // 3 of a Kind
        if (counts.includes(3)) return PAYTABLE.find(p => p.name === 'Three of a Kind');

        // Two Pair
        if (counts.filter(c => c === 2).length === 2) return PAYTABLE.find(p => p.name === 'Two Pair');

        // Jacks or Better
        if (this.checkJacksOrBetter(hand)) return PAYTABLE.find(p => p.name === 'Jacks or Better');

        return null;
    }

    getValueRank(value) {
        const map = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
        return map[value];
    }

    checkStraight(sortedValues) {
        // Special case: A-2-3-4-5
        if (sortedValues.join(',') === '2,3,4,5,14') return true;

        for (let i = 0; i < sortedValues.length - 1; i++) {
            if (sortedValues[i + 1] !== sortedValues[i] + 1) return false;
        }
        return true;
    }

    getValueCounts(values) {
        const counts = {};
        values.forEach(v => counts[v] = (counts[v] || 0) + 1);
        return Object.values(counts);
    }

    checkJacksOrBetter(hand) {
        const counts = {};
        hand.forEach(c => {
            const rank = this.getValueRank(c.value);
            counts[rank] = (counts[rank] || 0) + 1;
        });

        for (let rank in counts) {
            if (counts[rank] === 2 && parseInt(rank) >= 11) return true;
        }
        return false;
    }
}

window.game = new VideoPoker();
