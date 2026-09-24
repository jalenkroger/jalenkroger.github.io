// Harvest Hearts engine. Story data lives in story.js, art in art.js.

document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id);
    const el = {
        bgs: [$('bg-a'), $('bg-b')],
        hud: $('hud'),
        danceCard: $('dance-card'),
        stage: $('stage'),
        portrait: $('portrait'),
        dialogue: $('dialogue'),
        nameTag: $('name-tag'),
        text: $('text'),
        choices: $('choices'),
        title: $('title-screen'),
        form: $('start-form'),
        nameInput: $('player-name'),
        results: $('results'),
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const suitors = Object.keys(CAST).filter(k => CAST[k].suitor);

    let state;
    function newState(name) {
        return {
            name,
            aff: Object.fromEntries(suitors.map(k => [k, 0])),
            met: new Set(),
            answers: {},
            done: new Set(),
        };
    }

    // ---------- helpers ----------
    const resolve = (v) => (typeof v === 'function' ? v(state) : v);
    const fill = (str) => str.replaceAll('{name}', state.name).replaceAll('{NAME}', state.name.toUpperCase());
    const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function shuffle(list) {
        const a = list.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // ---------- background ----------
    let currentBg = null;
    let bgIndex = 0;
    function setBackground(name) {
        if (!name || name === currentBg) return;
        currentBg = name;
        const next = el.bgs[1 - bgIndex];
        const prev = el.bgs[bgIndex];
        next.innerHTML = ART.backgrounds[name]();
        if (reducedMotion) next.querySelector('svg')?.pauseAnimations();
        next.classList.add('on');
        prev.classList.remove('on');
        // Drop the old scene once it has faded so its animations stop running
        setTimeout(() => { if (!prev.classList.contains('on')) prev.innerHTML = ''; }, 1000);
        bgIndex = 1 - bgIndex;
    }

    // ---------- portrait ----------
    let currentWho = null;
    let currentMood = null;
    let enterFromLeft = false;

    function react(name) {
        if (reducedMotion) return;
        el.portrait.classList.remove('react-hop', 'react-sigh', 'react-swoon', 'enter-l', 'enter-r');
        void el.portrait.offsetWidth;
        el.portrait.classList.add(name);
    }
    el.portrait.addEventListener('animationend', (e) => {
        if (e.target === el.portrait) el.portrait.classList.remove('react-hop', 'react-sigh', 'react-swoon', 'enter-l', 'enter-r');
    });

    function setPortrait(who, mood = 'smile') {
        if (who === currentWho && mood === currentMood) return;
        const newPerson = who !== currentWho;
        const swap = () => {
            el.portrait.innerHTML = who ? ART.portrait(who, mood) : '';
            el.portrait.dataset.mood = mood;
            el.portrait.classList.toggle('on', !!who);
            if (!who) return;
            if (newPerson) {
                enterFromLeft = !enterFromLeft;
                react(enterFromLeft ? 'enter-l' : 'enter-r');
            } else if (mood === 'grin') {
                react('react-hop');
            } else if (mood === 'worried') {
                react('react-sigh');
            }
        };
        if (newPerson && currentWho && !reducedMotion) {
            el.portrait.classList.remove('on');
            setTimeout(swap, 250);
        } else {
            swap();
        }
        currentWho = who;
        currentMood = mood;
    }

    function heartPop() {
        react('react-swoon');
        if (reducedMotion) return;
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('span');
            heart.className = 'heart-pop';
            heart.textContent = '\u2665';
            heart.style.marginLeft = `${(i - 1) * 46}px`;
            heart.style.animationDelay = `${i * 0.12}s`;
            heart.style.fontSize = `${1.5 + (i % 2) * 0.8}rem`;
            el.stage.appendChild(heart);
            setTimeout(() => heart.remove(), 1500);
        }
    }

    // ---------- HUD ----------
    function renderHud() {
        el.hud.hidden = state.met.size === 0;
        el.danceCard.innerHTML = suitors.map(k => {
            const filled = Math.min(3, Math.round(state.aff[k] / 2));
            const hearts = '♥'.repeat(filled) + `<span class="off">${'♥'.repeat(3 - filled)}</span>`;
            const met = state.met.has(k);
            return `<li class="${met ? 'met' : ''}">${CAST[k].name} <span class="hearts" aria-label="${met ? filled + ' of 3 hearts' : 'not met yet'}">${met ? hearts : ''}</span></li>`;
        }).join('');
    }

    // ---------- typewriter ----------
    let typing = null;
    function typeText(str, onDone) {
        if (typing) clearInterval(typing.timer);
        el.text.textContent = '';
        if (reducedMotion) {
            el.text.textContent = str;
            onDone();
            return;
        }
        let i = 0;
        el.portrait.classList.add('talking');
        const finish = () => {
            clearInterval(typing.timer);
            typing = null;
            el.portrait.classList.remove('talking');
            el.text.textContent = str;
            onDone();
        };
        typing = {
            finish,
            timer: setInterval(() => {
                i += 2;
                el.text.textContent = str.slice(0, i);
                if (i >= str.length) finish();
            }, 22),
        };
    }
    el.text.addEventListener('click', () => typing && typing.finish());

    // ---------- scenes ----------
    function show(scene) {
        const who = scene.who || null;
        if (who && CAST[who].suitor && !state.met.has(who)) {
            state.met.add(who);
            renderHud();
        }
        setBackground(scene.bg);
        setPortrait(who, resolve(scene.mood) || 'smile');

        el.nameTag.hidden = !who;
        el.nameTag.textContent = who ? CAST[who].name : '';
        el.text.classList.toggle('narration', !who);
        el.choices.innerHTML = '';
        el.dialogue.scrollTop = 0;

        typeText(fill(resolve(scene.text)), () => renderChoices(scene));
    }

    function goto(id) {
        const scene = SCENES[id];
        if (!scene) {
            console.error(`Scene "${id}" not found`);
            return;
        }
        show(scene);
    }

    function renderChoices(scene) {
        let choices = resolve(scene.choices);
        if (!choices) {
            el.choices.classList.remove('grid');
            addButton('Continue', () => goto(scene.next), true);
            return;
        }
        if (scene.shuffle !== false) choices = shuffle(choices);
        el.choices.classList.toggle('grid', !!scene.grid);
        choices.forEach(choice => addButton(fill(choice.text), () => choose(scene, choice)));
        el.choices.querySelector('button')?.focus({ preventScroll: true });
    }

    function addButton(label, onClick, isContinue = false) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn choice' + (isContinue ? ' continue' : '');
        const n = el.choices.children.length + 1;
        btn.innerHTML = isContinue ? `${label} &rsaquo;` : `<span class="key">${n}</span><span>${escapeHtml(label)}</span>`;
        btn.addEventListener('click', onClick, { once: true });
        el.choices.appendChild(btn);
        if (isContinue) btn.focus({ preventScroll: true });
    }

    function choose(scene, choice) {
        const target = scene.who || scene.replyAs;
        if (choice.q) state.answers[choice.q] = { side: choice.side, text: choice.text };
        if (choice.aff && target && CAST[target].suitor) {
            state.aff[target] += choice.aff;
            if (choice.aff >= 2) heartPop();
            renderHud();
        }
        if (choice.mark) state.done.add(choice.mark);
        if (choice.results) return showResults();

        const next = choice.next || scene.next;
        if (choice.reply) {
            show({ bg: scene.bg, who: target, mood: choice.mood || 'grin', text: choice.reply, next });
        } else {
            goto(next);
        }
    }

    // Number keys pick choices; Enter/space skips the typewriter.
    document.addEventListener('keydown', (e) => {
        if (el.dialogue.hidden || e.target.tagName === 'INPUT') return;
        if (typing && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            typing.finish();
            return;
        }
        const n = parseInt(e.key, 10);
        if (n >= 1) el.choices.children[n - 1]?.click();
    });

    // ---------- results ----------
    function tally() {
        const counts = { R: 0, O: 0 };
        Object.values(state.answers).forEach(a => counts[a.side]++);
        return counts;
    }

    function sourceLinks(keys) {
        return keys.map(k => `<a href="${SOURCES[k].url}" target="_blank" rel="noopener">${SOURCES[k].label}</a>`).join(' &middot; ');
    }

    function showResults() {
        const counts = tally();
        const total = counts.R + counts.O;
        const lead = counts.R === counts.O ? null : counts.R > counts.O ? 'R' : 'O';
        const pctR = total ? (counts.R / total) * 100 : 50;

        const headline = lead
            ? `Your answers lined up more often with <span style="color:var(${lead === 'R' ? '--ricketts' : '--osborn'})">${CANDIDATES[lead].name}</span>.`
            : 'Your answers split right down the middle.';
        const lede = lead
            ? `On ${counts[lead]} of ${total} questions, what you told your dates matched the stated position of ${CANDIDATES[lead].name}, the ${CANDIDATES[lead].label.toLowerCase()}. The other ${counts[lead === 'R' ? 'O' : 'R']} matched ${CANDIDATES[lead === 'R' ? 'O' : 'R'].name}.`
            : `You matched Pete Ricketts and Dan Osborn on exactly the same number of questions. Look at which issues matter most to you below.`;

        const rows = Object.entries(QUESTIONS).map(([qid, q]) => {
            const answer = state.answers[qid];
            if (!answer) return '';
            const issue = ISSUES[q.issue];
            const matchVar = answer.side === 'R' ? '--ricketts' : '--osborn';
            const pos = (side) => `
                <div class="pos ${answer.side === side ? 'matched' : ''}">
                    <strong class="${side === 'R' ? 'r-name' : 'o-name'}">${CANDIDATES[side].name}${answer.side === side ? ' (your match)' : ''}</strong>
                    ${issue[side].text}<br>${sourceLinks(issue[side].src)}
                </div>`;
            return `
                <article class="issue" style="--match:var(${matchVar})">
                    <h4>${issue.title}</h4>
                    <p class="moment">${q.moment}</p>
                    <p class="about">What it was really asking: ${q.about}</p>
                    <p class="you">You said: “${escapeHtml(fill(answer.text))}”<br><b>Matches ${CANDIDATES[answer.side].short}</b></p>
                    <div class="positions">${pos('R')}${pos('O')}</div>
                </article>`;
        }).join('');

        el.results.innerHTML = `
            <div class="results-inner">
                <p class="kicker">Harvest Hearts &middot; Your ballot match</p>
                <h2>${headline}</h2>
                <p class="lede">${lede}</p>
                <div class="tally" role="img" aria-label="Ricketts ${counts.R}, Osborn ${counts.O}">
                    <div class="r" style="flex:${Math.max(pctR, 0.001)}">${counts.R ? counts.R : ''}</div>
                    <div class="o" style="flex:${Math.max(100 - pctR, 0.001)}">${counts.O ? counts.O : ''}</div>
                </div>
                <div class="tally-legend"><span>Pete Ricketts (R), incumbent</span><span>Dan Osborn (I), challenger</span></div>

                <h3>Every answer, and what it was really about</h3>
                <p>None of the suitors stood for a candidate. Each everyday dilemma was a stand-in for a real issue in the race, and each answer lined up with one candidate's stated 2026 position.</p>
                ${rows}

                <div class="note">
                    <strong>Read this before you vote.</strong>
                    This is a class project, not an endorsement, and it isn't affiliated with either campaign. Thirteen questions across seven issues can't capture everything a senator does, and it leaves out issues where the candidates mostly agree or where their positions weren't clear from reliable sources. Use it to start reading, not to finish.
                    <ul>
                        <li>Nebraska's general election is <b>Tuesday, Nov. 3, 2026</b>.</li>
                        <li>Check your registration, polling place and ID requirements with the <a href="https://sos.nebraska.gov/elections" target="_blank" rel="noopener">Nebraska Secretary of State</a>.</li>
                        <li>Learn more about <a href="https://ballotpedia.org/Pete_Ricketts" target="_blank" rel="noopener">Pete Ricketts</a> and <a href="https://ballotpedia.org/Dan_Osborn" target="_blank" rel="noopener">Dan Osborn</a> on Ballotpedia.</li>
                    </ul>
                </div>

                <div class="results-actions">
                    <button type="button" class="btn primary" id="play-again">Play again</button>
                </div>
            </div>`;

        el.dialogue.hidden = true;
        el.hud.hidden = true;
        el.results.hidden = false;
        el.results.scrollTop = 0;
        $('play-again').addEventListener('click', () => {
            el.results.hidden = true;
            el.title.hidden = false;
            setPortrait(null);
            setBackground('festival');
            el.nameInput.focus();
        });
    }

    // ---------- start ----------
    setBackground('festival');
    el.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = el.nameInput.value.trim().replace(/\s+/g, ' ');
        if (!name) return;
        state = newState(name);
        renderHud();
        el.nameInput.blur();
        el.title.hidden = true;
        el.dialogue.hidden = false;
        goto('intro1');
    });
});
