/**
 * Sports Book Logic
 */

const MOCK_GAMES = [
    { id: 1, home: 'Nebraska Cornhuskers', away: 'Iowa Hawkeyes', sport: 'NCAA Football', homeOdds: -150, awayOdds: +130 },
    { id: 2, home: 'Kansas City Chiefs', away: 'Buffalo Bills', sport: 'NFL', homeOdds: -120, awayOdds: +100 },
    { id: 3, home: 'Los Angeles Lakers', away: 'Golden State Warriors', sport: 'NBA', homeOdds: +110, awayOdds: -130 },
    { id: 4, home: 'Creighton Bluejays', away: 'UConn Huskies', sport: 'NCAA Basketball', homeOdds: +140, awayOdds: -160 }
];

class SportsBook {
    constructor() {
        this.gamesList = document.getElementById('games-list');
        this.activeSlip = document.getElementById('active-slip');
        this.emptySlipMsg = document.getElementById('empty-slip-msg');
        this.slipMatch = document.getElementById('slip-match');
        this.slipSelection = document.getElementById('slip-selection');
        this.stakeInput = document.getElementById('stake-input');
        this.potentialWinEl = document.getElementById('potential-win');
        this.btnPlaceBet = document.getElementById('btn-place-bet');
        this.betHistory = document.getElementById('bet-history');
        this.btnSimulate = document.getElementById('btn-simulate');

        this.currentSelection = null; // { gameId, team, odds, type: 'home'|'away' }
        this.activeBets = []; // { id, selection, stake, potentialWin, status }

        this.initGames();
        this.bindEvents();
    }

    initGames() {
        this.gamesList.innerHTML = '';
        MOCK_GAMES.forEach(game => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.innerHTML = `
                <div class="teams">
                    <div style="font-size: 0.8rem; color: #888;">${game.sport}</div>
                    <div class="team">${game.away}</div>
                    <div class="team">${game.home}</div>
                </div>
                <div class="odds-buttons">
                    <button class="btn-odds" onclick="game.selectBet(${game.id}, 'away')">
                        ${game.awayOdds > 0 ? '+' + game.awayOdds : game.awayOdds}
                    </button>
                    <button class="btn-odds" onclick="game.selectBet(${game.id}, 'home')">
                        ${game.homeOdds > 0 ? '+' + game.homeOdds : game.homeOdds}
                    </button>
                </div>
            `;
            this.gamesList.appendChild(card);
        });
    }

    bindEvents() {
        this.stakeInput.addEventListener('input', () => this.updatePotentialWin());
        this.btnPlaceBet.addEventListener('click', () => this.placeBet());
        this.btnSimulate.addEventListener('click', () => this.simulateResults());
    }

    selectBet(gameId, type) {
        const game = MOCK_GAMES.find(g => g.id === gameId);
        if (!game) return;

        // Visual selection
        document.querySelectorAll('.btn-odds').forEach(btn => btn.classList.remove('selected'));
        // Note: In a real app we'd target the specific button more precisely, 
        // but for this demo clicking it again triggers this, so we'd need event bubbling or passing `this`.
        // For simplicity, we won't highlight the button persistently here without more complex DOM logic,
        // but we will update the slip.

        const team = type === 'home' ? game.home : game.away;
        const odds = type === 'home' ? game.homeOdds : game.awayOdds;

        this.currentSelection = { game, team, odds, type };

        this.emptySlipMsg.style.display = 'none';
        this.activeSlip.style.display = 'block';

        this.slipMatch.textContent = `${game.away} @ ${game.home}`;
        this.slipSelection.textContent = `${team} (${odds > 0 ? '+' + odds : odds})`;

        this.updatePotentialWin();
    }

    updatePotentialWin() {
        if (!this.currentSelection) return;
        const stake = parseFloat(this.stakeInput.value) || 0;
        const multiplier = this.getMultiplier(this.currentSelection.odds);
        const win = stake * multiplier; // Total return (stake + profit)? 
        // American odds usually calculate PROFIT.
        // If odds +150, bet 100 -> profit 150. Total 250.
        // If odds -150, bet 150 -> profit 100. Total 250.

        const profit = this.calculateProfit(stake, this.currentSelection.odds);
        this.potentialWinEl.textContent = `$${(stake + profit).toFixed(2)}`;
    }

    calculateProfit(stake, odds) {
        if (odds > 0) {
            return stake * (odds / 100);
        } else {
            return stake * (100 / Math.abs(odds));
        }
    }

    placeBet() {
        if (!this.currentSelection) return;
        const stake = parseFloat(this.stakeInput.value);

        if (isNaN(stake) || stake <= 0) {
            alert("Invalid stake");
            return;
        }

        if (!window.bankroll.transaction(-stake)) return;

        const profit = this.calculateProfit(stake, this.currentSelection.odds);

        const bet = {
            id: Date.now(),
            selection: this.currentSelection,
            stake: stake,
            potentialReturn: stake + profit,
            status: 'pending'
        };

        this.activeBets.push(bet);
        this.renderHistory();

        // Reset slip
        this.currentSelection = null;
        this.activeSlip.style.display = 'none';
        this.emptySlipMsg.style.display = 'block';
    }

    renderHistory() {
        this.betHistory.innerHTML = '';
        this.activeBets.slice().reverse().forEach(bet => {
            const el = document.createElement('div');
            el.className = 'bet-history-item';
            el.innerHTML = `
                <div><strong>${bet.selection.team}</strong></div>
                <div>${bet.selection.game.away} vs ${bet.selection.game.home}</div>
                <div style="display:flex; justify-content:space-between; margin-top:4px;">
                    <span>Bet: $${bet.stake}</span>
                    <span class="bet-status ${bet.status}">${bet.status}</span>
                </div>
            `;
            this.betHistory.appendChild(el);
        });
    }

    simulateResults() {
        let winnings = 0;
        let settledCount = 0;

        this.activeBets.forEach(bet => {
            if (bet.status !== 'pending') return;

            // 50/50 chance for simulation
            const win = Math.random() > 0.5;

            if (win) {
                bet.status = 'won';
                winnings += bet.potentialReturn;
            } else {
                bet.status = 'lost';
            }
            settledCount++;
        });

        if (settledCount > 0) {
            this.renderHistory();
            if (winnings > 0) {
                window.bankroll.transaction(winnings);
                alert(`Simulation Complete. You won $${winnings.toFixed(2)}!`);
            } else {
                alert("Simulation Complete. Better luck next time.");
            }
        } else {
            alert("No pending bets to simulate.");
        }
    }
}

window.game = new SportsBook();
