/**
 * Simple Confetti Utility
 */
class Confetti {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.particles = [];
        this.animating = false;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y) {
        const colors = ['#D00000', '#FFD700', '#FFFFFF', '#000000'];
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 1) * 10,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            gravity: 0.2,
            drag: 0.99
        };
    }

    explode(x, y, count = 100) {
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(x, y));
        }
        if (!this.animating) {
            this.animating = true;
            this.animate();
        }
    }

    animate() {
        if (this.particles.length === 0) {
            this.animating = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= p.drag;
            p.rotation += p.rotationSpeed;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();

            if (p.y > this.canvas.height) {
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

window.confetti = new Confetti();
