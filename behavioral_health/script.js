document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const visualContainer = document.getElementById('graphic-visual');

    // Configuration for each step's visual
    const visuals = {
        1: `
            <div class="visual-content" style="width: 100%; display: flex; justify-content: flex-end; padding-right: 5%;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <h3 style="font-size: 6rem; color: var(--accent-red); margin-bottom: 0;">95%</h3>
                        <p style="font-size: 2rem;">of Nebraska Counties have a shortage</p>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 5px; width: 300px;">
                        ${Array(93).fill(0).map((_, i) =>
            `<div style="width: 20px; height: 20px; background-color: ${i < 88 ? 'var(--accent-red)' : '#ddd'}; border-radius: 2px; opacity: 0; transform: translateY(-20px);" class="block-rain" data-delay="${Math.random() * 1000}"></div>`
        ).join('')}
                        <p style="font-size: 0.8rem; margin-top: 10px; color: #666; grid-column: 1 / -1; text-align: center;">Each block represents a county (88 in red)</p>
                    </div>
                </div>
            </div>
        `,
        2: `
            <div class="visual-content" style="width: 100%;">
                <h3 style="font-size: 3rem; font-weight: 800; color: var(--accent-navy); border-bottom: 4px solid var(--accent-red); display: inline-block; padding-bottom: 10px; margin-bottom: 2rem;">Suicide Rate (per 100k)</h3>
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
                    <div class="bar-label" style="font-size: 1.2rem;">Rural</div>
                    <div class="bar rural" style="width: 0%; height: 50px; font-size: 1.2rem;" data-width="15%">3.0</div>
                </div>
                <div class="bar-chart-row">
                    <div class="bar-label" style="font-size: 1.2rem;">Urban</div>
                    <div class="bar" style="width: 0%; height: 50px; font-size: 1.2rem;" data-width="60%">11.8</div>
                </div>
                <h3 style="margin-top: 3rem;">Psychologists (per 100k)</h3>
                <div class="bar-chart-row">
                    <div class="bar-label" style="font-size: 1.2rem;">Rural</div>
                    <div class="bar rural" style="width: 0%; height: 50px; font-size: 1.2rem;" data-width="30%">8.7</div>
                </div>
                <div class="bar-chart-row">
                    <div class="bar-label" style="font-size: 1.2rem;">Urban</div>
                    <div class="bar" style="width: 0%; height: 50px; font-size: 1.2rem;" data-width="90%">27.9</div>
                </div>
            </div>
        `,
        4: `
            <div class="visual-content" style="text-align: center; width: 100%; max-width: 1200px; margin: 0 auto; pointer-events: auto; position: relative; z-index: 10;">
                <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
                    <div style="flex: 1; min-width: 300px;">
                        <iframe title="Behavioral health providers by county" aria-label="Choropleth map" id="datawrapper-chart-8FpCA" src="https://datawrapper.dwcdn.net/8FpCA/2/" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="429" data-external="1"></iframe>
                    </div>
                    <div style="flex: 1; min-width: 300px;">
                        <iframe title="Behavioral health provider ratio by county" aria-label="Choropleth map" id="datawrapper-chart-IIf5E" src="https://datawrapper.dwcdn.net/IIf5E/1/" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="411" data-external="1"></iframe>
                    </div>
                </div>
            </div>
        `,
        5: `
            <div class="visual-content" style="text-align: center;">
                <div style="font-size: 5rem; margin-bottom: 1rem;">💰</div>
                <h3 style="color: var(--accent-red);">The Cost of Travel</h3>
                <div class="clicker-container" style="display: flex; flex-direction: column; gap: 15px; max-width: 300px; margin: 2rem auto;">
                    <button class="toggle-btn" data-option="gas">
                        <span class="toggle-label">Gas Money</span>
                        <div class="toggle-switch"></div>
                    </button>
                    <button class="toggle-btn" data-option="time">
                        <span class="toggle-label">Time Off Work</span>
                        <div class="toggle-switch"></div>
                    </button>
                    <button class="toggle-btn" data-option="vehicle">
                        <span class="toggle-label">Reliable Vehicle</span>
                        <div class="toggle-switch"></div>
                    </button>
                </div>
                <p id="clicker-feedback" style="margin-top: 1rem; height: 1.5rem; font-style: italic; color: var(--accent-red); opacity: 0; transition: opacity 0.3s;">You can't have it all.</p>
            </div>
        `,
        6: `
            <div class="visual-content" style="text-align: left; width: 100%; display: flex; flex-direction: column; justify-content: center; height: 100%; padding-left: 5%;">
                <blockquote style="font-family: 'Playfair Display', serif; font-size: 3.5rem; line-height: 1.3; color: var(--accent-navy); margin: 0; padding: 2rem; position: relative; max-width: 600px;">
                    <span style="font-size: 8rem; position: absolute; top: -30px; left: -20px; opacity: 0.2; font-family: sans-serif;">“</span>
                    I’m from here. That’s the biggest thing. I came home.
                    <span style="font-size: 8rem; position: absolute; bottom: -50px; right: -20px; opacity: 0.2; font-family: sans-serif;">”</span>
                </blockquote>
                <p style="margin-top: 2rem; font-style: italic; color: #666; font-size: 1.5rem; opacity: 0; transform: translateY(20px); transition: all 1s ease 0.5s;" class="quote-author">— Dr. Cate Jones-Hazledine</p>
            </div>
        `,
        7: `
            <div class="visual-content" style="text-align: right; width: 100%; max-width: 800px; margin: 0 0 0 auto; padding-right: 5%;">
                <iframe title="[ Insert title here ]" aria-label="Locator map" id="datawrapper-chart-eJiGz" src="https://datawrapper.dwcdn.net/eJiGz/1/" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="483" data-external="1"></iframe>
            </div>
        `,
        8: `
            <div class="visual-content" style="text-align: left; padding-left: 5%; display: flex; justify-content: flex-start; align-items: flex-start; width: 100%;">
                <div class="ios-message" style="background: #007AFF; color: white; padding: 25px 35px; border-radius: 35px; display: inline-block; position: relative; min-width: 320px; max-width: 450px; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 28px; line-height: 1.4; margin-right: auto;">
                    <span id="typing-text"></span><span class="cursor" style="border-right: 2px solid white; animation: blink 1s infinite;">&nbsp;</span>
                    <div style="position: absolute; bottom: 0; right: -6px; width: 20px; height: 20px; background: #007AFF; border-bottom-left-radius: 16px; clip-path: polygon(0 0, 0% 100%, 100% 100%);"></div>
                </div>
            </div>
        `,
        9: `
            <div class="visual-content" style="text-align: right; width: 100%; max-width: 800px; margin: 0 0 0 auto; padding-right: 5%;">
                 <blockquote style="font-family: 'Playfair Display', serif; font-size: 2rem; line-height: 1.5; color: var(--accent-navy); border-right: 5px solid var(--accent-red); padding-right: 2rem; text-align: right;">
                    “Lewandowski said participants in focus groups described parking their vehicles a few blocks away from their therapist’s office to avoid being seen by others.”
                </blockquote>
            </div>
        `,
        10: `
            <div class="visual-content" style="text-align: left; width: 100%; display: flex; flex-direction: column; align-items: flex-start; padding-left: 5%;">
                <h3 style="font-size: 2.5rem; color: var(--accent-teal); text-align: left; margin-bottom: 1rem;">"Live up to a different kind of strength."</h3>
                <p style="font-size: 1.8rem; margin-top: 1rem; text-align: left;">The strength to ask for help.</p>
            </div>
        `,
        11: `
            <div class="visual-content" style="width: 100%; display: flex; justify-content: flex-end; padding-right: 5%;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div class="growth-container" style="position: relative; width: 300px; height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end;">
                        <div class="plant" style="font-size: 8rem; transform: scale(0); transform-origin: bottom center; transition: transform 2s cubic-bezier(0.34, 1.56, 0.64, 1);">🌻</div>
                        <div class="book" style="font-size: 8rem; z-index: 2;">📖</div>
                    </div>
                    <h3 style="margin-top: 2rem; text-align: center;">Growth from Education</h3>
                    <p style="text-align: center;">Cultivating mental wellness in schools.</p>
                </div>
            </div>
        `,
        12: `
            <div class="visual-content" style="text-align: center;">
                <div class="loading-screen" style="background: #f0f0f0; width: 300px; height: 200px; margin: 0 auto; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <div class="spinner" style="width: 40px; height: 40px; border: 4px solid #ddd; border-top: 4px solid var(--accent-teal); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="margin-top: 20px; color: #333; font-weight: 500;">Connecting to Provider...</p>
                    <div class="progress-bar" style="width: 200px; height: 6px; background: #ddd; border-radius: 3px; margin-top: 15px; overflow: hidden;">
                        <div class="progress-fill" style="width: 0%; height: 100%; background: var(--accent-teal); transition: width 3s ease-out;"></div>
                    </div>
                    <p class="error-message" style="color: var(--accent-red); font-size: 0.9rem; margin-top: 10px; opacity: 0; transition: opacity 0.5s;">Connection Unstable</p>
                </div>
                <h3 style="margin-top: 2rem;">Gaps Remain</h3>
                <p>Technology helps, but it isn't a perfect fix.</p>
            </div>
        `,
        13: ``, // Placeholder, will reuse Step 12 visual
        14: `
            <div class="visual-content" style="text-align: left; width: 100%; padding-left: 5%;">
                <h3 style="color: var(--accent-teal); font-size: 2rem; margin-bottom: 2rem; text-align: left;">Workforce Increases</h3>
                <div style="display: flex; flex-direction: column; gap: 20px; max-width: 600px;">
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong>Rural Providers</strong>
                            <span style="color: var(--accent-teal); font-weight: bold;">+24%</span>
                        </div>
                        <div style="background: #e0f7fa; height: 30px; border-radius: 15px; width: 100%;">
                            <div class="growth-bar" data-width="24%" style="background: var(--accent-teal); height: 100%; border-radius: 15px; width: 0%; transition: width 1.5s ease-out;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong>Psychiatric PAs</strong>
                            <span style="color: var(--accent-teal); font-weight: bold;">+267%</span>
                        </div>
                        <div style="background: #e0f7fa; height: 30px; border-radius: 15px; width: 100%;">
                            <div class="growth-bar" data-width="100%" style="background: var(--accent-teal); height: 100%; border-radius: 15px; width: 0%; transition: width 1.5s ease-out;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <strong>LIMHPs</strong>
                            <span style="color: var(--accent-teal); font-weight: bold;">+225%</span>
                        </div>
                        <div style="background: #e0f7fa; height: 30px; border-radius: 15px; width: 100%;">
                            <div class="growth-bar" data-width="85%" style="background: var(--accent-teal); height: 100%; border-radius: 15px; width: 0%; transition: width 1.5s ease-out;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `,
        15: `
            <div class="visual-content" style="text-align: center;">
                <div class="sunrise-container" style="width: 300px; height: 300px; margin: 0 auto; position: relative; overflow: hidden; border-radius: 50%; background: linear-gradient(to bottom, #0d1b2a, #1b263b);">
                    <div class="sun" style="width: 60px; height: 60px; background: #ffcc00; border-radius: 50%; position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%); box-shadow: 0 0 40px #ffcc00;"></div>
                    <div class="horizon" style="width: 100%; height: 20%; background: #2c3e50; position: absolute; bottom: 0;"></div>
                </div>
                <h3 style="margin-top: 2rem;">Hope for the Future</h3>
                <p>A new day for behavioral health in Nebraska.</p>
            </div>
        `
    };

    // Observer setup
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Trigger when element is in the middle 20% of screen
        threshold: 0
    };

    let currentVisualIndex = -1;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepIndex = parseInt(entry.target.getAttribute('data-step'));

                // Update active class
                steps.forEach(s => s.classList.remove('active'));
                entry.target.classList.add('active');

                // Update visual
                updateVisual(stepIndex);
            }
        });
    }, observerOptions);

    steps.forEach(step => observer.observe(step));

    // Global state for clicker to persist selection
    let clickerState = [];

    function updateVisual(index) {
        // Special case for Step 13 (reuse Step 12)
        if (index === 13 && currentVisualIndex === 12) {
            currentVisualIndex = index;
            return; // Do nothing, keep existing visual
        }

        // If scrolling back up from 14 to 13, we need to restore Step 12 visual
        if (index === 13 && currentVisualIndex !== 12) {
            // Treat it as Step 12 visual
            index = 12;
        }

        currentVisualIndex = index;

        // Fade out
        visualContainer.style.opacity = '0';

        setTimeout(() => {
            // Change content
            if (visuals[index]) {
                visualContainer.innerHTML = visuals[index];

                // Trigger animations

                // 1. Bar Charts (Step 3)
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

                // 3. Step 5 Impossible Clicker
                if (index == 5) {
                    const buttons = visualContainer.querySelectorAll('.toggle-btn');
                    // Removed feedback logic

                    // Restore state
                    clickerState.forEach(opt => {
                        const btn = visualContainer.querySelector(`.toggle-btn[data-option="${opt}"]`);
                        if (btn) btn.classList.add('active');
                    });

                    buttons.forEach(btn => {
                        btn.addEventListener('click', () => {
                            const option = btn.dataset.option;
                            if (clickerState.includes(option)) {
                                clickerState = clickerState.filter(item => item !== option);
                                btn.classList.remove('active');
                            } else {
                                if (clickerState.length >= 2) {
                                    const removed = clickerState.shift();
                                    const removedBtn = visualContainer.querySelector(`.toggle-btn[data-option="${removed}"]`);
                                    if (removedBtn) removedBtn.classList.remove('active');
                                }
                                clickerState.push(option);
                                btn.classList.add('active');
                            }
                        });
                    });
                }

                // 4. Step 6 Quote
                const quoteAuthor = visualContainer.querySelector('.quote-author');
                if (quoteAuthor) {
                    setTimeout(() => {
                        quoteAuthor.style.opacity = '1';
                        quoteAuthor.style.transform = 'translateY(0)';
                    }, 100);
                }

                // 5. Step 8 Typing Animation
                if (index == 8) {
                    const typingText = visualContainer.querySelector('#typing-text');
                    const text1 = "I need help";
                    const text2 = "I'm fine";
                    let i = 0;

                    // Type "I need help"
                    const type1 = setInterval(() => {
                        typingText.textContent += text1.charAt(i);
                        i++;
                        if (i > text1.length) {
                            clearInterval(type1);
                            // Wait then delete
                            setTimeout(() => {
                                const delete1 = setInterval(() => {
                                    typingText.textContent = typingText.textContent.slice(0, -1);
                                    if (typingText.textContent === "") {
                                        clearInterval(delete1);
                                        // Type "I'm fine"
                                        i = 0;
                                        setTimeout(() => {
                                            const type2 = setInterval(() => {
                                                typingText.textContent += text2.charAt(i);
                                                i++;
                                                if (i > text2.length) clearInterval(type2);
                                            }, 100);
                                        }, 500);
                                    }
                                }, 100);
                            }, 1000);
                        }
                    }, 100);
                }

                // 6. Step 11 Growth Animation
                if (index == 11) {
                    const plant = visualContainer.querySelector('.plant');
                    setTimeout(() => {
                        plant.style.transform = 'scale(1)';
                    }, 500);
                }

                // 7. Step 12 Loading Animation
                if (index == 12) {
                    const progressFill = visualContainer.querySelector('.progress-fill');
                    const errorMsg = visualContainer.querySelector('.error-message');

                    setTimeout(() => {
                        progressFill.style.width = '80%'; // Get stuck at 80%
                    }, 100);

                    setTimeout(() => {
                        errorMsg.style.opacity = '1';
                    }, 2500);
                }

                // 8. Step 14 Growth Bars
                if (index == 14) {
                    const growthBars = visualContainer.querySelectorAll('.growth-bar');
                    setTimeout(() => {
                        growthBars.forEach(bar => {
                            bar.style.width = bar.getAttribute('data-width');
                        });
                    }, 100);
                }

                // 9. Step 15 Sunrise Animation
                if (index == 15) {
                    const sun = visualContainer.querySelector('.sun');
                    const container = visualContainer.querySelector('.sunrise-container');

                    setTimeout(() => {
                        sun.style.transition = 'bottom 3s ease-out';
                        sun.style.bottom = '50px';

                        container.style.transition = 'background 3s ease-out';
                        container.style.background = 'linear-gradient(to bottom, #87CEEB, #E0F7FA)';
                    }, 100);
                }
            }

            // Fade in
            visualContainer.style.opacity = '1';
        }, 500);
    }
});

window.addEventListener("message", function (a) { if (void 0 !== a.data["datawrapper-height"]) { var e = document.querySelectorAll("iframe"); for (var t in a.data["datawrapper-height"]) for (var r, i = 0; r = e[i]; i++)if (r.contentWindow === a.source) { var d = a.data["datawrapper-height"][t] + "px"; r.style.height = d } } });
