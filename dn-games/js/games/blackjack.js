/**
 * Blackjack Game Logic
 */


class BlackjackGame {
    constructor() {
        this.deck = new Deck();
        this.playerHand = [];
        this.dealerHand = [];
        this.currentBet = 0;
        this.gameActive = false;

        // DOM Elements
        this.dealerCardsEl = document.getElementById('dealer-cards');
        this.playerCardsEl = document.getElementById('player-cards');
        this.dealerScoreEl = document.getElementById('dealer-score');
        this.playerScoreEl = document.getElementById('player-score');
        this.betInput = document.getElementById('bet-amount');
        this.btnDeal = document.getElementById('btn-deal');
        this.btnHit = document.getElementById('btn-hit');
        this.btnStand = document.getElementById('btn-stand');
        this.btnDouble = document.getElementById('btn-double');
        this.bettingControls = document.getElementById('betting-controls');
        this.actionControls = document.getElementById('action-controls');
        this.messageArea = document.getElementById('message-area');
        this.messageText = document.getElementById('message-text');

        this.bindEvents();
    }

    bindEvents() {
        this.btnDeal.addEventListener('click', () => this.startRound());
        this.btnHit.addEventListener('click', () => this.hit());
        this.btnStand.addEventListener('click', () => this.stand());
        this.btnDouble.addEventListener('click', () => this.doubleDown());
        this.messageArea.addEventListener('click', () => {
            this.messageArea.style.display = 'none';
        });
    }

    getCardValue(card) {
        if (['J', 'Q', 'K'].includes(card.value)) return 10;
        if (card.value === 'A') return 11;
        return parseInt(card.value);
    }

    calculateScore(hand) {
        let score = 0;
        let aces = 0;

        for (let card of hand) {
            score += this.getCardValue(card);
            if (card.value === 'A') aces++;
        }

        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }

        return score;
    }

    renderCard(card, container, hidden = false) {
        const cardEl = document.createElement('div');
        cardEl.className = `card ${['♥', '♦'].includes(card.suit) ? 'red' : 'black'}`;

        if (hidden) {
            cardEl.classList.add('card-back');
        } else {
            cardEl.innerHTML = `
                <div class="card-top">${card.value}${card.suit}</div>
                <div class="card-center">${card.suit}</div>
                <div class="card-bottom" style="transform: rotate(180deg);">${card.value}${card.suit}</div>
            `;
        }
        container.appendChild(cardEl);
    }

    updateUI(showDealerHidden = false) {
        this.dealerCardsEl.innerHTML = '';
        this.playerCardsEl.innerHTML = '';

        this.dealerHand.forEach((card, index) => {
            // Hide first dealer card if round is active and not showing hidden
            this.renderCard(card, this.dealerCardsEl, index === 0 && !showDealerHidden);
        });

        this.playerHand.forEach(card => {
            this.renderCard(card, this.playerCardsEl);
        });

        this.playerScoreEl.textContent = this.calculateScore(this.playerHand);

        if (showDealerHidden) {
            this.dealerScoreEl.textContent = this.calculateScore(this.dealerHand);
        } else {
            // Show value of visible card only
            if (this.dealerHand.length > 1) {
                this.dealerScoreEl.textContent = this.getCardValue(this.dealerHand[1]);
            } else {
                this.dealerScoreEl.textContent = 0;
            }
        }
    }

    startRound() {
        const bet = parseInt(this.betInput.value);
        if (isNaN(bet) || bet <= 0) {
            alert("Please enter a valid bet.");
            return;
        }

        if (!window.bankroll.transaction(-bet)) return;

        this.currentBet = bet;
        this.gameActive = true;
        this.deck.reset(); // Shuffle every hand for simplicity/fairness in this demo
        this.playerHand = [this.deck.deal(), this.deck.deal()];
        this.dealerHand = [this.deck.deal(), this.deck.deal()];

        this.bettingControls.classList.add('hidden');
        this.actionControls.classList.remove('hidden');
        this.messageArea.style.display = 'none';

        this.updateUI();

        // Check for Blackjack immediately
        const playerScore = this.calculateScore(this.playerHand);
        if (playerScore === 21) {
            this.stand(); // Auto-stand on natural 21
        }
    }

    hit() {
        if (!this.gameActive) return;
        this.playerHand.push(this.deck.deal());
        this.updateUI();

        if (this.calculateScore(this.playerHand) > 21) {
            this.endRound('bust');
        }
    }

    doubleDown() {
        if (!this.gameActive) return;
        if (this.playerHand.length !== 2) return;

        if (!window.bankroll.transaction(-this.currentBet)) return;

        this.currentBet *= 2;
        this.playerHand.push(this.deck.deal());
        this.updateUI();

        if (this.calculateScore(this.playerHand) > 21) {
            this.endRound('bust');
        } else {
            this.stand();
        }
    }

    stand() {
        if (!this.gameActive) return;

        // Dealer turn
        let dealerScore = this.calculateScore(this.dealerHand);
        while (dealerScore < 17) {
            this.dealerHand.push(this.deck.deal());
            dealerScore = this.calculateScore(this.dealerHand);
        }

        this.updateUI(true); // Show dealer hole card
        this.determineWinner();
    }

    determineWinner() {
        const playerScore = this.calculateScore(this.playerHand);
        const dealerScore = this.calculateScore(this.dealerHand);

        if (dealerScore > 21) {
            this.endRound('dealer_bust');
        } else if (playerScore > dealerScore) {
            this.endRound('win');
        } else if (playerScore < dealerScore) {
            this.endRound('loss');
        } else {
            this.endRound('push');
        }
    }

    endRound(result) {
        this.gameActive = false;
        let message = '';
        let payout = 0;

        switch (result) {
            case 'bust':
                message = 'Bust! You lose.';
                break;
            case 'dealer_bust':
                message = 'Dealer Busts! You Win!';
                payout = this.currentBet * 2;
                break;
            case 'win':
                message = 'You Win!';
                // Blackjack pays 3:2
                if (this.calculateScore(this.playerHand) === 21 && this.playerHand.length === 2) {
                    message = 'Blackjack! You Win!';
                    payout = this.currentBet * 2.5;
                } else {
                    payout = this.currentBet * 2;
                }
                break;
            case 'loss':
                message = 'Dealer Wins.';
                break;
            case 'push':
                message = 'Push. Bet returned.';
                payout = this.currentBet;
                break;
        }

        if (payout > 0) {
            window.bankroll.transaction(payout);
        }

        this.messageText.textContent = message;
        this.messageArea.style.display = 'block';

        this.bettingControls.classList.remove('hidden');
        this.actionControls.classList.add('hidden');
    }
}

// Initialize game
window.game = new BlackjackGame();
