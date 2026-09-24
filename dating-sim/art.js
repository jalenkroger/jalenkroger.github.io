// All the art is drawn here in SVG, so the game ships without image files.
// Backgrounds use a 1600x900 canvas cropped to fit and animate with SMIL
// (game.js pauses them for reduced motion). Portraits use 300x400 and are
// rigged into groups that style.css animates: .rig breathes, .head sways,
// .mouth talks, .eyes blink and .pupils glance.

const ART = (() => {
    const svg = (body, viewBox = '0 0 1600 900', fit = 'slice') =>
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="xMidYMax ${fit}">${body}</svg>`;

    // Seeded so the scenery lands in the same place every time
    function rng(seed) {
        return () => {
            seed = (seed * 16807) % 2147483647;
            return (seed - 1) / 2147483646;
        };
    }
    const f = (n) => n.toFixed(1);
    const loop = (dur, begin = 0) => `dur="${f(dur)}s" begin="${f(-begin)}s" repeatCount="indefinite"`;

    // ---------- animated building blocks ----------
    function stars(count, maxY, seed, minX = 0, maxX = 1600) {
        const r = rng(seed);
        let out = '';
        for (let i = 0; i < count; i++) {
            const x = minX + r() * (maxX - minX);
            const y = r() * maxY;
            const size = r() * 1.8 + 0.5;
            const o = r() * 0.5 + 0.3;
            const blink = i % 3 === 0
                ? `<animate attributeName="opacity" values="${f(o)};0.05;${f(o)}" ${loop(2 + r() * 4, r() * 6)}/>`
                : '';
            out += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(size)}" fill="#fff" opacity="${f(o)}">${blink}</circle>`;
        }
        return out;
    }

    function shootingStar(x, y, every, begin) {
        return `<g opacity="0">
            <line x1="${x}" y1="${y}" x2="${x - 120}" y2="${y - 50}" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
            <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.9;0.93;1" ${loop(every, begin)}/>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 0;260 110" keyTimes="0;0.9;1" ${loop(every, begin)}/>
        </g>`;
    }

    function cloud(x, y, s, dur, begin, fill, opacity) {
        return `<g opacity="${opacity}">
            <animateTransform attributeName="transform" type="translate" values="-500 0;2100 0" ${loop(dur, begin)}/>
            <g transform="translate(${x} ${y}) scale(${s})" fill="${fill}">
                <ellipse cx="0" cy="0" rx="90" ry="28"/><ellipse cx="-40" cy="-16" rx="46" ry="30"/>
                <ellipse cx="30" cy="-24" rx="54" ry="36"/><ellipse cx="80" cy="-6" rx="40" ry="22"/>
            </g>
        </g>`;
    }

    function fireflies(n, x0, x1, y0, y1, seed) {
        const r = rng(seed);
        let out = '';
        for (let i = 0; i < n; i++) {
            const x = x0 + r() * (x1 - x0);
            const y = y0 + r() * (y1 - y0);
            const dx = (r() - 0.5) * 80;
            const dy = (r() - 0.5) * 50;
            const d = 5 + r() * 6;
            out += `<g><circle cx="${f(x)}" cy="${f(y)}" r="9" fill="#fff4a3" opacity="0.18"/><circle cx="${f(x)}" cy="${f(y)}" r="3" fill="#fff4a3"/>
                <animateTransform attributeName="transform" type="translate" values="0 0;${f(dx)} ${f(dy)};0 0" ${loop(d, r() * d)}/>
                <animate attributeName="opacity" values="0;1;0.2;1;0" ${loop(d * 0.7, r() * d)}/></g>`;
        }
        return out;
    }

    function motes(n, x0, x1, y0, y1, seed, color = '#fff3cf') {
        const r = rng(seed);
        let out = '';
        for (let i = 0; i < n; i++) {
            const x = x0 + r() * (x1 - x0);
            const y = y0 + r() * (y1 - y0);
            const d = 8 + r() * 10;
            out += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1 + r() * 2)}" fill="${color}" opacity="0">
                <animate attributeName="opacity" values="0;0.7;0" ${loop(d, r() * d)}/>
                <animateTransform attributeName="transform" type="translate" values="0 0;${f((r() - 0.5) * 60)} -120" ${loop(d, r() * d)}/></circle>`;
        }
        return out;
    }

    function steam(x, y, seed, scale = 1) {
        const r = rng(seed);
        let out = '';
        for (let i = 0; i < 3; i++) {
            const d = 3 + r() * 2;
            out += `<path d="M${x + i * 8 - 8} ${y} q-10 -20 0 -40 q10 -20 0 -40" stroke="#fff" stroke-width="${f(4 * scale)}" fill="none" stroke-linecap="round" opacity="0">
                <animate attributeName="opacity" values="0;0.45;0" ${loop(d, r() * d)}/>
                <animateTransform attributeName="transform" type="translate" values="0 10;0 -30" ${loop(d, r() * d)}/></path>`;
        }
        return out;
    }

    function stringLights(x1, x2, y, sag, bulbs, seed, color = '#ffd27a') {
        const r = rng(seed);
        const mid = (x1 + x2) / 2;
        let out = `<path d="M${x1} ${y} Q${mid} ${y + sag * 2} ${x2} ${y}" stroke="#1a1020" stroke-width="2" fill="none"/>`;
        for (let i = 1; i < bulbs; i++) {
            const t = i / bulbs;
            const bx = x1 + (x2 - x1) * t;
            const by = y + 4 * t * (1 - t) * sag + 6;
            const d = 1.5 + r() * 2.5;
            out += `<circle cx="${f(bx)}" cy="${f(by)}" r="16" fill="${color}" opacity="0.2"><animate attributeName="opacity" values="0.25;0.08;0.25" ${loop(d, r() * d)}/></circle>`;
            out += `<circle cx="${f(bx)}" cy="${f(by)}" r="5" fill="${color}"/>`;
        }
        return out;
    }

    function ferrisWheel(cx, cy, r) {
        const colors = ['#e0668a', '#e8a33d', '#6fb3a8', '#f6d58e'];
        let spokes = '';
        let cars = '';
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2;
            const x = cx + Math.cos(a) * r;
            const y = cy + Math.sin(a) * r;
            spokes += `<line x1="${cx}" y1="${cy}" x2="${f(x)}" y2="${f(y)}" stroke="#2a1934" stroke-width="3"/>`;
            spokes += `<circle cx="${f(x)}" cy="${f(y)}" r="4" fill="#ffd27a"><animate attributeName="fill" values="#ffd27a;#e0668a;#ffd27a" ${loop(2, i * 0.17)}/></circle>`;
            // Each car counter-rotates around its hook so it hangs level
            cars += `<g><animateTransform attributeName="transform" type="rotate" values="0 ${f(x)} ${f(y)};-360 ${f(x)} ${f(y)}" ${loop(60)}/>
                <line x1="${f(x)}" y1="${f(y)}" x2="${f(x)}" y2="${f(y + 8)}" stroke="#2a1934" stroke-width="2"/>
                <rect x="${f(x - 15)}" y="${f(y + 8)}" width="30" height="20" rx="6" fill="${colors[i % 4]}"/></g>`;
        }
        return `
            <path d="M${cx - r * 0.7} 900 L${cx} ${cy} L${cx + r * 0.7} 900" stroke="#2a1934" stroke-width="10" fill="none"/>
            <g>
                <animateTransform attributeName="transform" type="rotate" values="0 ${cx} ${cy};360 ${cx} ${cy}" ${loop(60)}/>
                <circle cx="${cx}" cy="${cy}" r="${r}" stroke="#2a1934" stroke-width="7" fill="none"/>
                <circle cx="${cx}" cy="${cy}" r="${r * 0.62}" stroke="#2a1934" stroke-width="3" fill="none"/>
                ${spokes}${cars}
            </g>
            <circle cx="${cx}" cy="${cy}" r="14" fill="#2a1934"/>`;
    }

    function firework(x, y, color, every, begin) {
        let rays = '';
        for (let i = 0; i < 14; i++) {
            const a = (i / 14) * Math.PI * 2;
            rays += `<line x1="${x}" y1="${y}" x2="${f(x + Math.cos(a) * 70)}" y2="${f(y + Math.sin(a) * 70)}" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-dasharray="8 62"/>`;
        }
        return `<g opacity="0">
            ${rays}
            <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.7;0.75;1" ${loop(every, begin)}/>
            <animate attributeName="stroke-dashoffset" values="0;0;-58" keyTimes="0;0.7;1" ${loop(every, begin)}/>
        </g>`;
    }

    function tent(x, w, h, a, b) {
        const stripes = 6;
        let out = '';
        for (let i = 0; i < stripes; i++) {
            const x0 = x + (w / stripes) * i;
            const x1 = x + (w / stripes) * (i + 1);
            out += `<path d="M${x + w / 2} ${780 - h} L${x0} 780 L${x1} 780Z" fill="${i % 2 ? a : b}"/>`;
        }
        out += `<rect x="${x}" y="780" width="${w}" height="70" fill="${a}" opacity="0.85"/>`;
        out += `<path d="M${x + w / 2 - 30} 850 L${x + w / 2} 800 L${x + w / 2 + 30} 850Z" fill="#1a0f1f"/>`;
        // Pennant on top, fluttering
        out += `<line x1="${x + w / 2}" y1="${780 - h}" x2="${x + w / 2}" y2="${740 - h}" stroke="#1a0f1f" stroke-width="3"/>
            <path d="M${x + w / 2} ${740 - h} q15 2 30 8 q-15 2 -30 8Z" fill="${b}">
                <animate attributeName="d" values="M${x + w / 2} ${740 - h} q15 2 30 8 q-15 2 -30 8Z;M${x + w / 2} ${740 - h} q15 -2 28 6 q-13 6 -28 10Z;M${x + w / 2} ${740 - h} q15 2 30 8 q-15 2 -30 8Z" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" ${loop(2.6, x / 300)}/></path>`;
        return out;
    }

    function crowd(n, y, seed, fill) {
        const r = rng(seed);
        let out = '';
        for (let i = 0; i < n; i++) {
            const x = (i / n) * 1700 - 50 + r() * 40;
            const s = 0.8 + r() * 0.5;
            out += `<g transform="translate(${f(x)} ${y}) scale(${f(s)})"><g>
                <animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" ${loop(0.8 + r() * 1.2, r() * 2)}/>
                <circle cx="0" cy="-70" r="16" fill="${fill}"/><path d="M-26 0 Q-26 -50 0 -52 Q26 -50 26 0Z" fill="${fill}"/></g></g>`;
        }
        return out;
    }

    // A far-off bird: two curved wings that ease up and down, drifting across the sky
    function crane(x, y, s, dur, begin) {
        const up = 'M-26 -4 Q-14 -14 0 0 Q14 -14 26 -4';
        const mid = 'M-26 1 Q-13 -5 0 0 Q13 -5 26 1';
        const down = 'M-24 9 Q-12 5 0 0 Q12 5 24 9';
        const ease = 'calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1"';
        return `<g><animateTransform attributeName="transform" type="translate" values="-200 30;900 -10;1900 20" ${loop(dur, begin)}/>
            <g transform="translate(${x} ${y}) scale(${s})">
                <g><animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" ${loop(3.2, begin * 2)}/>
                    <path d="${up}" stroke="#5a2f2a" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <animate attributeName="d" values="${up};${mid};${down};${mid};${up}" ${ease} ${loop(1.4, begin)}/>
                    </path>
                    <ellipse cx="0" cy="1" rx="5" ry="3" fill="#5a2f2a"/>
                </g>
            </g></g>`;
    }

    function wheat(x0, x1, y, seed, color) {
        const r = rng(seed);
        let out = '';
        for (let x = x0; x < x1; x += 14 + r() * 10) {
            const h = 60 + r() * 50;
            const d = 3 + r() * 2;
            out += `<g><animateTransform attributeName="transform" type="rotate" values="-3 ${f(x)} ${y};3 ${f(x)} ${y};-3 ${f(x)} ${y}" ${loop(d, r() * d)}/>
                <path d="M${f(x)} ${y} Q${f(x + 4)} ${f(y - h / 2)} ${f(x + 2)} ${f(y - h)}" stroke="${color}" stroke-width="3" fill="none"/>
                <ellipse cx="${f(x + 2)}" cy="${f(y - h - 8)}" rx="4" ry="12" fill="${color}"/></g>`;
        }
        return out;
    }

    function cow(x, y, s, flip, seed) {
        const r = rng(seed);
        return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})" fill="#1f1a2e">
            <rect x="-40" y="-30" width="80" height="34" rx="14"/>
            <rect x="-34" y="0" width="8" height="24"/><rect x="24" y="0" width="8" height="24"/>
            <g><animateTransform attributeName="transform" type="rotate" values="0 -40 -20;18 -40 -20;18 -40 -20;0 -40 -20" ${loop(6 + r() * 4, r() * 6)}/>
                <rect x="-66" y="-30" width="30" height="20" rx="8"/></g>
            <path d="M40 -24 q12 10 6 26" stroke="#1f1a2e" stroke-width="3" fill="none">
                <animateTransform attributeName="transform" type="rotate" values="-10 40 -24;14 40 -24;-10 40 -24" ${loop(1.8, r() * 2)}/></path>
        </g>`;
    }

    function dancer(x, s, fill, seed) {
        const r = rng(seed);
        const d = 1.2 + r() * 0.6;
        return `<g transform="translate(${x} 760) scale(${s})" fill="${fill}"><g>
            <animateTransform attributeName="transform" type="rotate" values="-6 0 0;6 0 0;-6 0 0" ${loop(d, r())}/>
            <circle cx="-22" cy="-150" r="18"/><path d="M-50 0 L-40 -110 Q-22 -128 -4 -110 L6 0Z"/>
            <circle cx="24" cy="-160" r="18"/><path d="M4 0 L8 -120 Q24 -138 40 -120 L46 0Z"/>
            <path d="M-8 -104 Q10 -118 18 -108" stroke="${fill}" stroke-width="10" fill="none"/>
        </g></g>`;
    }

    const backgrounds = {
        festival: () => svg(`
            <defs>
                <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#241640"/>
                    <stop offset="0.45" stop-color="#6d3563"/>
                    <stop offset="0.78" stop-color="#d8744c"/>
                    <stop offset="1" stop-color="#f2b25c"/>
                </linearGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#fsky)"/>
            ${stars(70, 320, 7)}
            ${firework(360, 200, '#f6d58e', 7, 0)}
            ${firework(820, 150, '#e0668a', 9, 3)}
            ${firework(560, 260, '#6fb3a8', 8, 5.5)}
            ${cloud(0, 260, 1.2, 140, 20, '#8a4a72', 0.5)}
            <path d="M0 700 Q300 640 600 690 T1200 670 T1600 690 V900 H0Z" fill="#43264d"/>
            ${ferrisWheel(1230, 430, 230)}
            ${tent(120, 260, 200, '#c9485f', '#f3e3c3')}
            ${tent(430, 200, 150, '#3f7f78', '#f3e3c3')}
            ${tent(1450, 220, 170, '#e8a33d', '#f3e3c3')}
            <g transform="translate(700 780)">
                <rect x="0" y="-60" width="130" height="80" fill="#f3e3c3"/>
                <path d="M-10 -60 L140 -60 L130 -86 L0 -86Z" fill="#c9485f"/>
                <text x="65" y="-24" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="17" fill="#8e2f2a">KETTLE CORN</text>
                ${steam(65, -90, 5, 1.2)}
            </g>
            <rect y="840" width="1600" height="60" fill="#1d1226"/>
            ${crowd(22, 900, 3, '#140c1a')}
            ${stringLights(-40, 560, 110, 70, 12, 1)}
            ${stringLights(560, 1100, 110, 60, 10, 2)}
            ${stringLights(1100, 1650, 110, 70, 11, 3)}
            <rect y="898" width="1600" height="900" fill="#1d1226"/>
        `),

        porch: () => svg(`
            <defs>
                <linearGradient id="psky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#e9734a"/>
                    <stop offset="0.55" stop-color="#f7c46c"/>
                    <stop offset="1" stop-color="#fbe3a8"/>
                </linearGradient>
                <radialGradient id="sunglow"><stop offset="0" stop-color="#fff6d8" stop-opacity="0.9"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#psky)"/>
            <circle cx="480" cy="560" r="260" fill="url(#sunglow)"><animate attributeName="r" values="240;280;240" ${loop(6)}/></circle>
            <circle cx="480" cy="560" r="110" fill="#fff1c9"/>
            ${cloud(0, 180, 1.4, 120, 10, '#fbd9a6', 0.8)}
            ${cloud(0, 300, 0.9, 90, 60, '#f7b98a', 0.7)}
            ${cloud(0, 120, 0.7, 160, 100, '#fde7c2', 0.6)}
            ${crane(0, 260, 1.2, 38, 0)}${crane(40, 240, 1, 38, 0.6)}${crane(80, 280, 1.1, 38, 1.2)}${crane(-40, 290, 0.9, 38, 1.8)}
            <g fill="#6b3e2e">
                <rect x="1080" y="300" width="70" height="330"/>
                <rect x="1155" y="300" width="70" height="330"/>
                <rect x="1230" y="300" width="70" height="330"/>
                <path d="M1070 300 L1190 230 L1310 300Z"/>
                <rect x="1170" y="170" width="40" height="70"/>
                <rect x="1310" y="420" width="140" height="210"/>
                <path d="M1300 420 L1380 380 L1460 420Z"/>
            </g>
            <circle cx="1190" cy="176" r="6" fill="#ff5a5a"><animate attributeName="opacity" values="1;0.1;1" ${loop(2)}/></circle>
            <path d="M0 620 H1600 V900 H0Z" fill="#c88a3a"/>
            <g stroke="#a86d2a" stroke-width="3">
                ${Array.from({ length: 14 }, (_, i) => `<line x1="800" y1="620" x2="${-600 + i * 200}" y2="900"/>`).join('')}
            </g>
            <g transform="translate(260 640)">
                <line x1="0" y1="0" x2="600" y2="0" stroke="#8a5a2a" stroke-width="4"/>
                ${[0, 150, 300, 450, 600].map(x => `<path d="M${x} 0 l-12 20 h24z" fill="#8a5a2a"/>`).join('')}
                <g opacity="0.5">${[60, 210, 360, 510].map((x, i) => `<path d="M${x} 4 q4 12 0 20" stroke="#dff1ff" stroke-width="3" fill="none"><animate attributeName="opacity" values="0;1;0" ${loop(1.5, i * 0.4)}/></path>`).join('')}</g>
            </g>
            ${wheat(0, 1600, 700, 12, '#d9a441')}
            <rect y="690" width="1600" height="26" fill="#5a3322"/>
            <rect y="860" width="1600" height="40" fill="#5a3322"/>
            ${Array.from({ length: 17 }, (_, i) => `<rect x="${i * 100 + 20}" y="716" width="16" height="144" fill="#6b3e2e"/>`).join('')}
            <rect y="898" width="1600" height="900" fill="#5a3322"/>
        `),

        pasture: () => svg(`
            <defs>
                <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#1d2350"/>
                    <stop offset="0.55" stop-color="#6b4c86"/>
                    <stop offset="0.85" stop-color="#e38b76"/>
                    <stop offset="1" stop-color="#f6c68a"/>
                </linearGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#dsky)"/>
            ${stars(130, 440, 11)}
            ${shootingStar(500, 120, 9, 2)}
            ${shootingStar(1100, 80, 13, 8)}
            <circle cx="260" cy="170" r="40" fill="#f7efd6" opacity="0.9"/>
            ${cloud(0, 330, 1.3, 150, 30, '#8e6a9e', 0.45)}
            <path d="M0 650 Q250 560 520 630 T1050 600 T1600 620 V900 H0Z" fill="#5c5a7a"/>
            ${cow(700, 620, 0.8, false, 1)}${cow(820, 628, 0.7, true, 2)}${cow(430, 640, 0.6, false, 3)}
            <path d="M0 720 Q350 640 760 700 T1600 690 V900 H0Z" fill="#3c3d5a"/>
            <g stroke="#1f1a2e" stroke-width="7" fill="none">
                <path d="M1180 700 L1230 360 L1280 700"/>
                <path d="M1195 600 H1265 M1205 500 H1255 M1215 420 H1245"/>
            </g>
            <g>
                <animateTransform attributeName="transform" type="rotate" values="0 1230 350;360 1230 350" ${loop(6)}/>
                ${Array.from({ length: 16 }, (_, i) => `<rect x="1224" y="255" width="12" height="80" fill="#1f1a2e" transform="rotate(${i * 22.5} 1230 350)"/>`).join('')}
            </g>
            <circle cx="1230" cy="350" r="14" fill="#1f1a2e"/>
            <path d="M1250 350 L1350 330 L1340 370Z" fill="#1f1a2e"/>
            ${fireflies(18, 0, 1600, 640, 820, 5)}
            <path d="M0 820 Q800 780 1600 810 V900 H0Z" fill="#23233a"/>
            ${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 145 + 30}" y="${740 + (i % 3) * 4}" width="12" height="110" fill="#17142a"/>`).join('')}
            <path d="M0 770 L1600 780 M0 810 L1600 818" stroke="#17142a" stroke-width="2"/>
            ${wheat(0, 1600, 900, 8, '#17142a')}
            <rect y="898" width="1600" height="900" fill="#23233a"/>
        `),

        shop: () => svg(`
            <defs>
                <pattern id="plank" width="120" height="900" patternUnits="userSpaceOnUse">
                    <rect width="120" height="900" fill="#6a4a36"/>
                    <rect width="4" height="900" fill="#553a2a"/>
                </pattern>
                <pattern id="peg" width="30" height="30" patternUnits="userSpaceOnUse">
                    <rect width="30" height="30" fill="#b98a5a"/>
                    <circle cx="15" cy="15" r="3" fill="#7d5a38"/>
                </pattern>
                <radialGradient id="lamp" cx="0.5" cy="0" r="1">
                    <stop offset="0" stop-color="#ffe2a0" stop-opacity="0.55"/>
                    <stop offset="1" stop-color="#ffe2a0" stop-opacity="0"/>
                </radialGradient>
                <clipPath id="shopwin"><rect x="980" y="140" width="420" height="300"/></clipPath>
            </defs>
            <rect width="1600" height="900" fill="url(#plank)"/>
            <g clip-path="url(#shopwin)">
                <rect x="980" y="140" width="420" height="300" fill="#f2a55c"/>
                ${cloud(600, 230, 0.6, 60, 10, '#fbd0a0', 0.8)}
                ${cloud(600, 300, 0.4, 45, 30, '#fbd0a0', 0.6)}
                <path d="M980 380 Q1100 330 1190 370 T1400 350 V440 H980Z" fill="#b8643a"/>
            </g>
            <rect x="980" y="140" width="420" height="300" fill="none" stroke="#3d2a1f" stroke-width="16"/>
            <path d="M1190 140 V440 M980 290 H1400" stroke="#3d2a1f" stroke-width="10"/>
            <rect x="200" y="150" width="600" height="340" fill="url(#peg)" stroke="#3d2a1f" stroke-width="8"/>
            <g fill="#3a3a44">
                <rect x="250" y="200" width="18" height="140" rx="4"/>
                <rect x="300" y="200" width="14" height="110" rx="4"/>
                <path d="M360 200 h40 v30 h-12 v110 h-16 v-110 h-12z"/>
                <circle cx="520" cy="270" r="50" fill="none" stroke="#3a3a44" stroke-width="12"/>
                <rect x="620" y="200" width="120" height="16" rx="4"/>
                <rect x="640" y="240" width="90" height="16" rx="4"/>
                <rect x="660" y="280" width="60" height="16" rx="4"/>
            </g>
            <g>
                <animateTransform attributeName="transform" type="rotate" values="-4 720 0;4 720 0;-4 720 0" ${loop(5)}/>
                <path d="M720 0 V70" stroke="#222" stroke-width="6"/>
                <path d="M660 110 L720 70 L780 110Z" fill="#2d2d2d"/>
                <circle cx="720" cy="112" r="10" fill="#ffe8b0"/>
                <path d="M660 110 L300 900 H1140 L780 110Z" fill="url(#lamp)"><animate attributeName="opacity" values="1;1;0.75;1;1" keyTimes="0;0.8;0.82;0.84;1" ${loop(7)}/></path>
            </g>
            ${motes(30, 420, 1000, 300, 800, 9)}
            <g transform="translate(100 190)">
                <circle r="56" fill="#2f2f33"/>
                <g><animateTransform attributeName="transform" type="rotate" values="0;360" ${loop(0.8)}/>
                    ${[0, 120, 240].map(a => `<ellipse cx="0" cy="-28" rx="12" ry="26" fill="#8a8f99" transform="rotate(${a})"/>`).join('')}</g>
                <circle r="8" fill="#5a5a60"/>
            </g>
            <rect y="620" width="1600" height="30" fill="#3d2a1f"/>
            <rect y="650" width="1600" height="250" fill="#4a3a30"/>
            <g transform="translate(900 575)">
                <rect x="0" y="0" width="110" height="46" rx="8" fill="#b43b2c"/>
                <circle cx="30" cy="23" r="15" fill="#3a2418"/><rect x="58" y="12" width="40" height="8" rx="3" fill="#f3e3c3"/>
                <line x1="90" y1="0" x2="110" y2="-40" stroke="#222" stroke-width="3"/>
                ${[0, 1, 2].map(i => `<text x="${50 + i * 18}" y="-10" font-size="26" fill="#f6d58e" opacity="0">&#9834;
                    <animate attributeName="opacity" values="0;1;0" ${loop(3, i)}/>
                    <animateTransform attributeName="transform" type="translate" values="0 0;${10 - i * 10} -60" ${loop(3, i)}/></text>`).join('')}
            </g>
            <circle cx="120" cy="690" r="210" fill="#1c1c1f"/>
            <circle cx="120" cy="690" r="120" fill="#b43b2c"/>
            <circle cx="120" cy="690" r="40" fill="#e6c14b"/>
            ${Array.from({ length: 16 }, (_, i) => `<rect x="112" y="480" width="16" height="36" fill="#2a2a2e" transform="rotate(${i * 22.5} 120 690)"/>`).join('')}
            <rect x="1250" y="560" width="300" height="80" fill="#8e2f2a"/>
            <rect x="1250" y="560" width="300" height="12" fill="#b43b2c"/>
            <rect y="898" width="1600" height="900" fill="#4a3a30"/>
        `),

        roastery: () => svg(`
            <defs>
                <pattern id="brick" width="80" height="40" patternUnits="userSpaceOnUse">
                    <rect width="80" height="40" fill="#8e4a36"/>
                    <path d="M0 0 H80 M0 20 H80 M40 0 V20 M0 20 V40 M80 20 V40" stroke="#6e3526" stroke-width="3"/>
                </pattern>
                <linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#1c2448"/>
                    <stop offset="1" stop-color="#3b3a66"/>
                </linearGradient>
                <clipPath id="roastwin"><rect x="80" y="130" width="440" height="420"/></clipPath>
            </defs>
            <rect width="1600" height="900" fill="url(#brick)"/>
            <g clip-path="url(#roastwin)">
                <rect x="80" y="130" width="440" height="420" fill="url(#win)"/>
                <g fill="#f6d58e" opacity="0.7"><rect x="120" y="440" width="30" height="110"/><rect x="180" y="410" width="40" height="140"/><rect x="340" y="430" width="36" height="120"/><rect x="420" y="400" width="50" height="150"/></g>
                <g><animateTransform attributeName="transform" type="translate" values="-200 0;700 0" ${loop(6, 1)}/>
                    <circle cx="0" cy="520" r="30" fill="#fff4c7" opacity="0.35"/><circle cx="0" cy="520" r="6" fill="#fff4c7"/></g>
                ${Array.from({ length: 30 }, (_, i) => {
                    const r = rng(i + 90);
                    const x = 80 + r() * 440;
                    const d = 0.6 + r() * 0.5;
                    return `<line x1="${f(x)}" y1="0" x2="${f(x - 8)}" y2="30" stroke="#b9c4ff" stroke-width="2" opacity="0.5"><animateTransform attributeName="transform" type="translate" values="0 100;-20 580" ${loop(d, r() * d)}/></line>`;
                }).join('')}
            </g>
            <rect x="80" y="130" width="440" height="420" fill="none" stroke="#2b1b14" stroke-width="16"/>
            <path d="M300 130 V550" stroke="#2b1b14" stroke-width="10"/>
            <rect x="640" y="120" width="420" height="260" rx="8" fill="#2c3330" stroke="#6b4a2e" stroke-width="14"/>
            <text x="850" y="195" text-anchor="middle" font-family="Georgia, serif" font-size="46" font-weight="700" fill="#f3ead8">PRAIRIE GRIND</text>
            <g font-family="Georgia, serif" font-size="26" fill="#d7ceb8">
                <text x="690" y="255">Drip ........... 2.50</text>
                <text x="690" y="295">Cold brew ...... 4.00</text>
                <text x="690" y="335">Runza &amp; a cup .. 7.00</text>
            </g>
            ${[440, 540].map(y => `
                <rect x="1150" y="${y}" width="380" height="14" fill="#4b2e1e"/>
                ${[0, 1, 2, 3, 4].map(i => `<path d="M${1165 + i * 72} ${y} v-70 q0 -12 12 -12 h40 q12 0 12 12 v70z" fill="${['#c9a36b', '#e8d4ae', '#b8743a', '#d9c49a', '#a45a32'][i]}"/>`).join('')}
            `).join('')}
            ${[480, 1000, 1400].map((x, i) => `
                <g><animateTransform attributeName="transform" type="rotate" values="-2 ${x} 0;2 ${x} 0;-2 ${x} 0" ${loop(4 + i, i)}/>
                    <path d="M${x} 0 V90" stroke="#1f1712" stroke-width="3"/><path d="M${x - 34} 120 Q${x} 70 ${x + 34} 120Z" fill="#1f1712"/>
                    <circle cx="${x}" cy="124" r="10" fill="#ffd27a"/>
                    <circle cx="${x}" cy="130" r="70" fill="#ffd27a" opacity="0.12"><animate attributeName="r" values="64;76;64" ${loop(3, i)}/></circle></g>`).join('')}
            <g transform="translate(1280 560)">
                <rect x="0" y="0" width="200" height="80" rx="10" fill="#b9bec7"/>
                <rect x="10" y="-24" width="180" height="30" rx="8" fill="#8a8f99"/>
                <rect x="40" y="80" width="14" height="30" fill="#3a3a44"/><rect x="146" y="80" width="14" height="30" fill="#3a3a44"/>
                ${steam(100, -24, 4, 1.4)}
            </g>
            <rect y="640" width="1600" height="40" fill="#3a2418"/>
            <rect y="680" width="1600" height="220" fill="#5a3825"/>
            ${[0, 1, 2, 3, 4, 5].map(i => `<ellipse cx="${360 + i * 180}" cy="636" rx="40" ry="10" fill="#f3ead8"/><ellipse cx="${360 + i * 180}" cy="632" rx="30" ry="6" fill="#4a2a17"/>${steam(360 + i * 180, 620, 20 + i, 0.8)}`).join('')}
            <rect y="898" width="1600" height="900" fill="#5a3825"/>
        `),

        rooftop: () => svg(`
            <defs>
                <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#0d1030"/>
                    <stop offset="0.7" stop-color="#27285a"/>
                    <stop offset="1" stop-color="#4b3a6e"/>
                </linearGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#nsky)"/>
            ${stars(200, 580, 19)}
            ${shootingStar(700, 90, 8, 3)}
            ${shootingStar(1400, 200, 12, 9)}
            <circle cx="1320" cy="150" r="54" fill="#f7efd6"/>
            <circle cx="1342" cy="138" r="50" fill="#0f1234"/>
            ${cloud(0, 170, 1.1, 100, 40, '#3a3b6a', 0.7)}
            ${cloud(0, 320, 0.8, 130, 90, '#2e2f5a', 0.6)}
            <g fill="#15142c">
                <rect x="360" y="330" width="16" height="300"/>
                <rect x="470" y="330" width="16" height="300"/>
                <path d="M368 480 L478 400 M368 400 L478 480" stroke="#15142c" stroke-width="6"/>
                <ellipse cx="423" cy="300" rx="120" ry="70"/>
                <path d="M303 300 Q423 200 543 300"/>
                <rect x="419" y="200" width="8" height="40"/>
            </g>
            <text x="423" y="312" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="30" fill="#4a4a80">HARLAN CREEK</text>
            <circle cx="423" cy="200" r="22" fill="#ff5a5a" opacity="0.3"><animate attributeName="opacity" values="0.4;0;0.4" ${loop(2)}/></circle>
            <circle cx="423" cy="200" r="7" fill="#ff5a5a"><animate attributeName="opacity" values="1;0.2;1" ${loop(2)}/></circle>
            <path d="M0 640 H1600 V900 H0Z" fill="#1a1a36"/>
            ${Array.from({ length: 90 }, (_, i) => {
                const r = rng(i + 40);
                const o = 0.4 + r() * 0.6;
                const tw = i % 4 === 0 ? `<animate attributeName="opacity" values="${f(o)};0.1;${f(o)}" ${loop(3 + r() * 3, r() * 5)}/>` : '';
                return `<rect x="${f(r() * 1600)}" y="${f(650 + r() * 60)}" width="4" height="4" fill="#ffd27a" opacity="${f(o)}">${tw}</rect>`;
            }).join('')}
            <g><animateTransform attributeName="transform" type="translate" values="-100 0;1800 0" ${loop(14)}/>
                <circle cx="0" cy="722" r="4" fill="#fff4c7"/><circle cx="12" cy="722" r="4" fill="#fff4c7"/></g>
            <g><animateTransform attributeName="transform" type="translate" values="1700 0;-200 0" ${loop(18, 6)}/>
                <circle cx="0" cy="730" r="3" fill="#ff6a6a"/><circle cx="10" cy="730" r="3" fill="#ff6a6a"/></g>
            <rect y="740" width="1600" height="40" fill="#3a3b52"/>
            <rect y="780" width="1600" height="120" fill="#2b2c40"/>
            <rect x="200" y="700" width="90" height="60" fill="#3a3b52"/>
            ${steam(245, 700, 30, 1.6)}
            <circle cx="1180" cy="560" r="170" fill="#ff5a6a" opacity="0.08"><animate attributeName="opacity" values="0.1;0.03;0.1" ${loop(4)}/></circle>
            <g transform="translate(1180 560)">
                <rect x="-70" y="-70" width="140" height="140" rx="12" fill="#b3293a"/>
                <text y="40" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="120" fill="#fff">H</text>
                <rect x="-6" y="70" width="12" height="110" fill="#3a3b52"/>
            </g>
            <rect y="898" width="1600" height="900" fill="#2b2c40"/>
        `),

        barn: () => svg(`
            <defs>
                <pattern id="barnwall" width="90" height="900" patternUnits="userSpaceOnUse">
                    <rect width="90" height="900" fill="#8a3b2c"/>
                    <rect width="5" height="900" fill="#6d2a1f"/>
                </pattern>
                <radialGradient id="glow" cx="0.5" cy="0.35" r="0.7">
                    <stop offset="0" stop-color="#ffd98a" stop-opacity="0.4"/>
                    <stop offset="1" stop-color="#ffd98a" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#barnwall)"/>
            <path d="M0 0 L800 -60 L1600 0 V120 L800 60 L0 120Z" fill="#4a2018"/>
            ${[200, 600, 1000, 1400].map(x => `<rect x="${x - 14}" y="60" width="28" height="700" fill="#5a2a1d"/>`).join('')}
            <path d="M0 230 H1600" stroke="#5a2a1d" stroke-width="26"/>
            <rect x="620" y="300" width="360" height="200" fill="#1c0d0a" opacity="0.5"/>
            <text x="800" y="410" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="44" fill="#f6d58e" opacity="0.85">HARVEST HEARTS</text>
            ${stringLights(-40, 420, 250, 60, 9, 4)}
            ${stringLights(420, 820, 250, 50, 8, 5)}
            ${stringLights(820, 1220, 250, 50, 8, 6)}
            ${stringLights(1220, 1650, 250, 60, 9, 7)}
            ${[300, 1300].map((x, i) => `<g><animateTransform attributeName="transform" type="rotate" values="-5 ${x} 230;5 ${x} 230;-5 ${x} 230" ${loop(3.5, i)}/>
                <line x1="${x}" y1="230" x2="${x}" y2="330" stroke="#2a1510" stroke-width="3"/>
                <rect x="${x - 20}" y="330" width="40" height="54" rx="8" fill="#2a1510"/><rect x="${x - 13}" y="338" width="26" height="38" rx="5" fill="#ffd27a"/>
                <circle cx="${x}" cy="357" r="50" fill="#ffd27a" opacity="0.15"/></g>`).join('')}
            <rect width="1600" height="900" fill="url(#glow)"/>
            ${motes(30, 100, 1500, 300, 700, 13, '#ffe7a8')}
            <rect y="720" width="1600" height="180" fill="#6b4a2c"/>
            ${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 140}" y1="720" x2="${i * 140 - 60}" y2="900" stroke="#57391f" stroke-width="3"/>`).join('')}
            ${dancer(260, 0.9, '#3a1a12', 1)}${dancer(520, 0.8, '#3a1a12', 2)}${dancer(1100, 0.85, '#3a1a12', 3)}${dancer(1360, 0.95, '#3a1a12', 4)}
            ${[[20, 660], [150, 680], [1380, 660], [1500, 680], [1450, 600]].map(([x, y]) => `<rect x="${x}" y="${y}" width="150" height="80" rx="8" fill="#d9ad5a"/><path d="M${x + 10} ${y + 20} H${x + 140} M${x + 10} ${y + 45} H${x + 140}" stroke="#b8893c" stroke-width="4"/>`).join('')}
            <rect y="898" width="1600" height="900" fill="#6b4a2c"/>
        `),
    };

    // ---------- portraits ----------
    const mouths = {
        smile: '<path d="M133 206 Q150 222 167 206" stroke="#5b2a24" stroke-width="4" fill="none" stroke-linecap="round"/>',
        grin: '<path d="M130 203 Q150 232 170 203 Q150 210 130 203Z" fill="#6b2a28"/><path d="M136 206 Q150 211 164 206 L162 210 Q150 214 138 210Z" fill="#fff"/>',
        soft: '<path d="M139 210 Q150 216 161 210" stroke="#5b2a24" stroke-width="4" fill="none" stroke-linecap="round"/>',
        worried: '<path d="M137 214 Q150 206 163 214" stroke="#5b2a24" stroke-width="4" fill="none" stroke-linecap="round"/>',
    };
    const brows = {
        smile: 'M114 146 Q128 139 140 145 M160 145 Q172 139 186 146',
        grin: 'M114 143 Q128 134 140 141 M160 141 Q172 134 186 143',
        soft: 'M116 148 Q128 144 140 147 M160 147 Q172 144 184 148',
        worried: 'M116 146 Q128 147 140 141 M160 141 Q172 147 184 146',
    };

    function face({ skin, shade, browColor = '#3a2418', mood = 'smile', blush = 0.22 }) {
        const b = mood === 'grin' ? blush + 0.12 : blush;
        return `
            <ellipse cx="92" cy="172" rx="11" ry="17" fill="${shade}"/>
            <ellipse cx="208" cy="172" rx="11" ry="17" fill="${shade}"/>
            <ellipse cx="150" cy="165" rx="58" ry="68" fill="${skin}"/>
            <g class="eyes">
                <ellipse cx="128" cy="170" rx="7.5" ry="8.5" fill="#fff" opacity="0.9"/>
                <ellipse cx="172" cy="170" rx="7.5" ry="8.5" fill="#fff" opacity="0.9"/>
                <g class="pupils">
                    <ellipse cx="128" cy="171" rx="5.5" ry="6.5" fill="#2a1d17"/>
                    <ellipse cx="172" cy="171" rx="5.5" ry="6.5" fill="#2a1d17"/>
                    <circle cx="130" cy="168" r="1.8" fill="#fff"/>
                    <circle cx="174" cy="168" r="1.8" fill="#fff"/>
                </g>
            </g>
            <g class="brows"><path d="${brows[mood] || brows.smile}" stroke="${browColor}" stroke-width="4.5" fill="none" stroke-linecap="round"/></g>
            <path d="M150 176 Q145 191 153 194" stroke="${shade}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
            <g class="blush">
                <ellipse cx="114" cy="196" rx="12" ry="7" fill="#e0668a" opacity="${b}"/>
                <ellipse cx="186" cy="196" rx="12" ry="7" fill="#e0668a" opacity="${b}"/>
            </g>
            <g class="mouth">${mouths[mood] || mouths.smile}</g>`;
    }

    const neck = (shade) => `<path d="M126 220 V272 Q150 288 174 272 V220Z" fill="${shade}"/>`;
    const shoulders = (fill) => `<path d="M30 400 C30 310 80 272 150 272 C220 272 270 310 270 400Z" fill="${fill}"/>`;

    // Each person is drawn in three layers so the head can move on its own:
    // back (behind the body, moves with the head), body, and head.
    const people = {
        walt: (mood) => {
            const skin = '#e3b38e', shade = '#c8916b';
            return {
                back: '',
                body: `
                    ${neck(shade)}
                    ${shoulders('#4e6e9e')}
                    <path d="M118 276 L150 330 L182 276 L168 272 L150 300 L132 272Z" fill="#b8312f"/>
                    <path d="M100 290 L140 280 L150 320 Z M200 290 L160 280 L150 320Z" fill="#6a8bbb"/>
                    <path d="M150 330 V400" stroke="#3d5a86" stroke-width="3"/>
                    ${[345, 372].map(y => `<circle cx="150" cy="${y}" r="4" fill="#f3ead8"/>`).join('')}
                    <rect x="70" y="330" width="44" height="30" rx="4" fill="none" stroke="#3d5a86" stroke-width="3"/>
                    <rect x="186" y="330" width="44" height="30" rx="4" fill="none" stroke="#3d5a86" stroke-width="3"/>`,
                head: `
                    ${face({ skin, shade, mood, browColor: '#5a3a22' })}
                    <path d="M100 124 Q98 140 101 152 L106 150 L106 124Z M200 124 Q202 140 199 152 L194 150 L194 124Z" fill="#6a4428"/>
                    <path d="M104 196 Q150 250 196 196 Q190 232 150 236 Q110 232 104 196Z" fill="#6a4428" opacity="0.18"/>
                    <g class="hat">
                        <ellipse cx="150" cy="120" rx="104" ry="18" fill="#7b5636"/>
                        <path d="M100 122 Q100 60 150 58 Q200 60 200 122Z" fill="#6b4a2e"/>
                        <path d="M150 62 Q142 80 150 96 Q158 80 150 62Z" fill="#5a3d24"/>
                        <rect x="100" y="104" width="100" height="12" fill="#3b2616"/>
                    </g>`,
            };
        },
        rosa: (mood) => {
            const skin = '#b77b55', shade = '#9a6140';
            return {
                back: `
                    <path d="M88 150 Q80 250 100 280 L200 280 Q220 250 212 150Z" fill="#241713"/>
                    <g class="pony"><path d="M200 100 Q260 70 250 150 Q244 200 226 230 Q236 160 204 130Z" fill="#241713"/></g>`,
                body: `
                    ${neck(shade)}
                    ${shoulders('#2f3e5c')}
                    <path d="M112 280 L150 306 L188 280 L176 274 L150 290 L124 274Z" fill="#253149"/>
                    <rect x="186" y="318" width="58" height="30" rx="14" fill="#f3ead8"/>
                    <text x="215" y="339" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="17" fill="#b8312f">Rosa</text>
                    <path d="M40 360 Q60 340 100 350 L96 400 L34 400Z" fill="#253149"/>
                    <path d="M60 372 q20 -6 34 4" stroke="#3a4a6e" stroke-width="3" fill="none"/>`,
                head: `
                    ${face({ skin, shade, mood, browColor: '#1c120e', blush: 0.3 })}
                    <path d="M92 150 Q96 88 150 86 Q208 88 208 150 Q190 118 150 116 Q116 118 108 150Z" fill="#241713"/>
                    <path d="M96 118 Q150 76 204 118 L204 132 Q150 96 96 132Z" fill="#c9372f"/>
                    <path d="M200 116 l26 -16 l-4 22 l18 6 l-26 6Z" fill="#c9372f"/>
                    ${[112, 126].map((y, i) => `<circle cx="${110 + i * 16}" cy="${y}" r="2.5" fill="#fff" opacity="0.8"/>`).join('')}
                    <g class="earring-l"><circle cx="92" cy="196" r="8" fill="none" stroke="#e8a33d" stroke-width="3"/></g>
                    <g class="earring-r"><circle cx="208" cy="196" r="8" fill="none" stroke="#e8a33d" stroke-width="3"/></g>`,
            };
        },
        theo: (mood) => {
            const skin = '#ecc59c', shade = '#d4a57a';
            return {
                back: '',
                body: `
                    ${neck(shade)}
                    ${shoulders('#efe6d2')}
                    <path d="M116 276 L150 304 L184 276 L170 272 L150 290 L130 272Z" fill="#ddd2ba"/>
                    <path d="M86 300 L112 290 L150 312 L188 290 L214 300 L208 400 L92 400Z" fill="#b5562f"/>
                    <path d="M112 290 L124 400 M188 290 L176 400" stroke="#8e3f20" stroke-width="3"/>
                    <rect x="126" y="340" width="48" height="34" rx="4" fill="#8e3f20"/>
                    <text x="150" y="362" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="14" fill="#f3ead8">PG</text>`,
                head: `
                    ${face({ skin, shade, mood, browColor: '#15110f' })}
                    <path d="M92 158 Q84 90 150 84 Q220 86 210 150 Q204 124 186 116 Q170 132 124 118 Q104 128 100 162Z" fill="#15110f"/>
                    <g class="swoop"><path d="M120 116 Q160 70 212 108 Q176 100 150 124Z" fill="#221c19"/></g>
                    <g fill="none" stroke="#3b2f2a" stroke-width="4">
                        <circle cx="128" cy="170" r="17"/>
                        <circle cx="172" cy="170" r="17"/>
                        <path d="M145 168 Q150 163 155 168 M111 166 L94 160 M189 166 L206 160"/>
                    </g>
                    <g class="glint" stroke="#fff" stroke-width="3" stroke-linecap="round">
                        <path d="M120 164 L128 156"/><path d="M164 164 L172 156"/>
                    </g>`,
            };
        },
        june: (mood) => {
            const skin = '#7c4f36', shade = '#643d28';
            return {
                back: '',
                body: `
                    ${neck(shade)}
                    ${shoulders('#2e8b8b')}
                    <path d="M118 274 L150 322 L182 274" stroke="#1f6c6c" stroke-width="6" fill="#643d28"/>
                    <rect x="190" y="330" width="42" height="36" rx="3" fill="none" stroke="#1f6c6c" stroke-width="3"/>
                    <rect x="198" y="320" width="4" height="26" fill="#3a3a44"/>
                    <rect x="208" y="322" width="4" height="22" fill="#e0668a"/>
                    <path d="M112 280 Q98 330 118 350 Q140 366 150 340" stroke="#8a8f99" stroke-width="5" fill="none"/>
                    <path d="M188 280 Q200 316 172 340" stroke="#8a8f99" stroke-width="5" fill="none"/>
                    <g class="steth"><circle cx="150" cy="344" r="11" fill="#b9bec7" stroke="#8a8f99" stroke-width="3"/></g>
                    <rect x="64" y="320" width="34" height="46" rx="4" fill="#f3ead8" transform="rotate(-8 81 343)"/>
                    <text x="81" y="348" text-anchor="middle" font-size="11" font-weight="700" fill="#2e8b8b" transform="rotate(-8 81 343)">RN</text>`,
                head: `
                    ${face({ skin, shade, mood, browColor: '#150c08', blush: 0.14 })}
                    <path d="M90 170 Q82 96 150 90 Q218 96 210 170 Q200 124 150 120 Q100 124 90 170Z" fill="#1c110b"/>
                    <g class="bun">${[[150, 58, 30], [126, 66, 20], [174, 66, 20], [150, 38, 18], [136, 46, 16], [164, 46, 16]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#1c110b"/>`).join('')}</g>
                    ${[[104, 110], [196, 110], [96, 136], [204, 136]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#1c110b"/>`).join('')}
                    <circle cx="94" cy="190" r="3.5" fill="#f6d58e"/>
                    <circle cx="206" cy="190" r="3.5" fill="#f6d58e"/>`,
            };
        },
        kenzie: (mood) => {
            const skin = '#f3cfb0', shade = '#dcaa86';
            const curls = [[92, 150], [86, 190], [96, 230], [208, 150], [214, 190], [204, 230], [110, 102], [150, 88], [190, 102]];
            return {
                back: `<g class="curls">${curls.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="28" fill="#c4502a"/>`).join('')}</g>`,
                body: `
                    ${neck(shade)}
                    <path d="M96 290 Q150 250 204 290 L200 310 Q150 280 100 310Z" fill="#a50d26"/>
                    ${shoulders('#c8102e')}
                    <text x="150" y="378" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="64" fill="#f3ead8">N</text>
                    <g class="strings"><path d="M136 290 L134 330 M164 290 L166 330" stroke="#f3ead8" stroke-width="3"/></g>`,
                head: `
                    ${face({ skin, shade, mood, browColor: '#8e3a1c', blush: 0.3 })}
                    ${[[118, 186], [124, 192], [112, 192], [182, 186], [176, 192], [188, 192]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#b96a45"/>`).join('')}
                    <path d="M94 140 Q100 86 150 84 Q200 86 206 140 Q186 110 160 124 Q150 104 130 122 Q110 110 94 140Z" fill="#c4502a"/>
                    <g class="curls">${[[112, 100], [138, 90], [164, 90], [190, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="18" fill="#d15e33"/>`).join('')}</g>`,
            };
        },
    };

    function portrait(who, mood) {
        const draw = people[who];
        if (!draw) return '';
        const p = draw(mood);
        return svg(`
            <ellipse cx="150" cy="398" rx="120" ry="10" fill="#000" opacity="0.25"/>
            <g class="rig">
                <g class="head">${p.back}</g>
                <g class="body">${p.body}</g>
                <g class="head">${p.head}</g>
            </g>`, '0 0 300 400', 'meet');
    }

    return { backgrounds, portrait };
})();
