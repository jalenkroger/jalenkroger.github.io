document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const visualContainer = document.getElementById('graphic-visual');

    // Configuration for each step's visual
    const visuals = {
        1: `
            <div class="visual-content" style="text-align: center;">
                <h3 style="font-size: 4rem; color: var(--accent-red); margin-bottom: 0;">95%</h3>
                <p style="font-size: 1.5rem;">of Nebraska Counties have a shortage</p>
                <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 5px; margin-top: 20px; width: 300px; margin-left: auto; margin-right: auto;">
                    ${Array(93).fill(0).map((_, i) =>
            `<div style="width: 20px; height: 20px; background-color: ${i < 88 ? 'var(--accent-red)' : '#ddd'}; border-radius: 2px; opacity: 0; transform: translateY(-20px);" class="block-rain" data-delay="${Math.random() * 1000}"></div>`
        ).join('')}
                </div>
                <p style="font-size: 0.8rem; margin-top: 10px; color: #666;">Each block represents a county (88 in red)</p>
            </div>
        `,
        2: `
            <div class="visual-content" style="width: 100%;">
                <h3>Suicide Rate (per 100k)</h3>
                <div style="margin-top: 2rem;">
                    <div style="margin-bottom: 1.5rem;">
                        <div class="bar-label" style="text-align: left; width: auto; margin-bottom: 0.5rem; font-size: 1.2rem;">Rural (20.2)</div>
                        <div class="isotype-grid" style="max-width: 800px; gap: 15px;">
                            ${Array(20).fill(0).map(() => `
                                <svg class="icon-person active block-rain" viewBox="0 0 24 24" style="width: 60px; height: 60px; fill: var(--accent-red); opacity: 0; transform: translateY(-20px);" data-delay="${Math.random() * 1000}">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <div class="bar-label" style="text-align: left; width: auto; margin-bottom: 0.5rem; font-size: 1.2rem;">Urban (10.0)</div>
                        <div class="isotype-grid" style="max-width: 800px; gap: 15px;">
                            ${Array(10).fill(0).map(() => `
                                <svg class="icon-person urban block-rain" viewBox="0 0 24 24" style="width: 60px; height: 60px; fill: var(--accent-teal); opacity: 0; transform: translateY(-20px);" data-delay="${Math.random() * 1000}">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `,
        3: `
            <div class="visual-content" style="width: 100%;">
                <h3>Psychiatrists (per 100k)</h3>
                <div class="bar-chart-row" style="margin-top: 2rem;">
                    <div class="bar-label">Rural</div>
                    <div class="bar rural" style="width: 0%;" data-width="15%">3.0</div>
                </div>
                <div class="bar-chart-row">
                    <div class="bar-label">Urban</div>
                    <div class="bar" style="width: 0%;" data-width="60%">11.8</div>
                </div>
                <h3 style="margin-top: 3rem;">Psychologists (per 100k)</h3>
                <div class="bar-chart-row">
                    <div class="bar-label">Rural</div>
                    <div class="bar rural" style="width: 0%;" data-width="30%">8.7</div>
                </div>
                <div class="bar-chart-row">
                    <div class="bar-label">Urban</div>
                    <div class="bar" style="width: 0%;" data-width="90%">27.9</div>
                </div>
            </div>
        `,
        4: `
            <div class="visual-content" style="text-align: center; width: 100%;">
                <h3>The Long Road to Care</h3>
                <div class="map-container">
                    <div class="nebraska-shape"></div>
                    <!-- Random dots for rural towns -->
                    <div class="map-dot" style="top: 30%; left: 20%;"></div>
                    <div class="map-dot" style="top: 70%; left: 15%;"></div>
                    <div class="map-dot" style="top: 40%; left: 80%;"></div>
                    
                    <!-- Clinic in Lincoln/Omaha area -->
                    <div class="map-dot" style="top: 50%; left: 85%; background: var(--accent-teal); width: 15px; height: 15px; z-index: 2;"></div>

                    <!-- Path line -->
                    <div class="map-line" style="top: 30%; left: 20%; width: 65%; transform: rotate(15deg);"></div>
                    
                    <!-- Car -->
                    <div class="car-icon" style="top: 25%; left: 20%;">🚗</div>
                </div>
                <p style="margin-top: 1rem;">Many residents drive hours for a single appointment.</p>
            </div>
        `,
        5: `
            <div class="visual-content" style="text-align: center;">
                <div class="stigma-container">
                    <div class="stigma-blur" id="stigma-text">
                        <h3 style="color: var(--accent-navy); font-size: 2.5rem;">"I can't let them see me."</h3>
                        <p style="font-size: 1.2rem;">Fear of judgment keeps many from seeking help.</p>
                    </div>
                </div>
            </div>
        `,
        6: `
            <div class="visual-content" style="text-align: center;">
                <h3 style="color: var(--accent-teal); font-size: 3rem;">+24%</h3>
                <p>Increase in rural providers</p>
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 2rem;">
                    <div style="background: #e0f7fa; padding: 1rem; border-radius: 8px; flex: 1;">
                        <div style="font-size: 2rem;">💻</div>
                        <h4>Telehealth</h4>
                        <p>Bridging the gap</p>
                    </div>
                    <div style="background: #e0f7fa; padding: 1rem; border-radius: 8px; flex: 1;">
                        <div style="font-size: 2rem;">🏫</div>
                        <h4>Schools</h4>
                        <p>Early intervention</p>
                    </div>
                </div>
            </div>
        `
    };

    // Observer setup
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Trigger when element is in the middle 20% of screen
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepIndex = entry.target.getAttribute('data-step');

                // Update active class
                steps.forEach(s => s.classList.remove('active'));
                entry.target.classList.add('active');

                // Update visual
                updateVisual(stepIndex);
            }
        });
    }, observerOptions);

    steps.forEach(step => observer.observe(step));

    function updateVisual(index) {
        // Fade out
        visualContainer.style.opacity = '0';

        setTimeout(() => {
            // Change content
            if (visuals[index]) {
                visualContainer.innerHTML = visuals[index];

                // Trigger animations

                // 1. Bar Charts
                const bars = visualContainer.querySelectorAll('.bar');
                setTimeout(() => {
                    bars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }, 50);

                // 2. Step 1 Blocks (Rain Effect)
                const blocks = visualContainer.querySelectorAll('.block-rain');
                blocks.forEach(block => {
                    const delay = block.getAttribute('data-delay');
                    setTimeout(() => {
                        block.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        block.style.opacity = '1';
                        block.style.transform = 'translateY(0)';
                    }, delay);
                });

                // 3. Step 4 Car
                const car = visualContainer.querySelector('.car-icon');
                if (car) {
                    setTimeout(() => {
                        car.style.left = '80%';
                    }, 100);
                }

                // 4. Step 5 Stigma
                const stigmaText = document.getElementById('stigma-text');
                if (stigmaText) {
                    setTimeout(() => {
                        stigmaText.classList.add('cleared');
                    }, 500);
                }
            }

            // Fade in
            visualContainer.style.opacity = '1';
        }, 500);
    }
});
