/**
 * DN Games - Main Logic
 * Handles Bankroll management and shared utilities.
 */

const STORAGE_KEY = 'dn_games_bankroll';
const INITIAL_BALANCE = 1000;

class Bankroll {
    constructor() {
        this.balance = this.loadBalance();
        this.updateDisplay();
    }

    loadBalance() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? parseInt(stored, 10) : INITIAL_BALANCE;
    }

    saveBalance() {
        localStorage.setItem(STORAGE_KEY, this.balance);
        this.updateDisplay();
    }

    getBalance() {
        return this.balance;
    }

    /**
     * Update balance by amount (positive or negative)
     * @param {number} amount 
     * @returns {boolean} true if transaction successful, false if insufficient funds
     */
    transaction(amount) {
        if (this.balance + amount < 0) {
            alert("Insufficient funds! Visit the lobby to reset.");
            return false;
        }
        this.balance += amount;
        this.saveBalance();
        return true;
    }

    reset() {
        this.balance = INITIAL_BALANCE;
        this.saveBalance();
    }

    updateDisplay() {
        const display = document.getElementById('bankroll-display');
        if (display) {
            display.textContent = `$${this.balance.toLocaleString()}`;
        }
    }
}

// Initialize global bankroll instance
window.bankroll = new Bankroll();

// Add reset functionality if on lobby
document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-bankroll');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if(confirm("Reset your bankroll to $1,000?")) {
                window.bankroll.reset();
            }
        });
    }
});
