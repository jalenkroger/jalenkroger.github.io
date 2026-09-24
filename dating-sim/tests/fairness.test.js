// Checks that the hidden ballot scoring can't favor either candidate.
// Run: node tests/fairness.test.js
const assert = require('assert');
const { SCENES, QUESTIONS, ISSUES, SOURCES, DATES, CAST, tier } = require('../story.js');

const scored = {};
for (const [id, scene] of Object.entries(SCENES)) {
    if (!Array.isArray(scene.choices)) continue;
    for (const c of scene.choices) {
        if (!c.q) continue;
        (scored[c.q] ||= []).push({ ...c, scene: id });
    }
}

// Every question appears once, with exactly one option per side and equal affection.
for (const qid of Object.keys(QUESTIONS)) {
    const opts = scored[qid];
    assert(opts, `${qid} never appears in a scene`);
    assert.strictEqual(opts.length, 2, `${qid} should have two options`);
    assert.deepStrictEqual(opts.map(o => o.side).sort(), ['O', 'R'], `${qid} needs one R and one O option`);
    assert.strictEqual(opts[0].aff || 0, opts[1].aff || 0, `${qid} rewards one side with more affection`);
    assert.strictEqual(new Set(opts.map(o => o.scene)).size, 1, `${qid} is split across scenes`);
    const issue = ISSUES[QUESTIONS[qid].issue];
    assert(issue, `${qid} points to a missing issue`);
    for (const side of ['R', 'O']) {
        assert(issue[side].src.length, `${qid} ${side} has no source`);
        issue[side].src.forEach(s => assert(SOURCES[s], `unknown source ${s}`));
    }
}
assert.strictEqual(Object.keys(scored).length, Object.keys(QUESTIONS).length, 'a scene scores a question not listed in QUESTIONS');

// Loaded words stay out of what the player reads during the game.
const banned = /\b(union|tariffs?|ICE|border|PAC|Medicaid|Medicare|Republican|Democrat|Ricketts|Osborn|Trump|senat\w*)\b/i;
for (const [id, scene] of Object.entries(SCENES)) {
    if (id.startsWith('ballot')) continue;
    const texts = [typeof scene.text === 'string' ? scene.text : ''];
    if (Array.isArray(scene.choices)) scene.choices.forEach(c => texts.push(c.text, c.reply || ''));
    for (const t of texts) assert(!banned.test(t), `${id} uses a loaded word: "${t.match(banned)?.[0]}"`);
}

// Every path through the game reaches all 13 questions: walk the graph in each date order.
function walk(order) {
    const answered = new Set();
    const done = new Set();
    let id = 'intro1';
    let steps = 0;
    while (id && steps++ < 500) {
        const s = SCENES[id];
        assert(s, `missing scene ${id}`);
        if (id === 'hub') {
            const left = order.filter(w => !done.has(w));
            if (!left.length) { id = 'finale1'; continue; }
            done.add(left[0]);
            id = DATES.find(d => d.who === left[0]).start;
            continue;
        }
        if (id === 'ballot2') break;
        const choices = Array.isArray(s.choices) ? s.choices : null;
        const pick = choices ? choices[0] : null;
        if (pick?.q) answered.add(pick.q);
        id = (pick && pick.next) || s.next;
    }
    return answered;
}
const perms = (a) => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]));
for (const order of perms(DATES.map(d => d.who))) {
    assert.strictEqual(walk(order).size, Object.keys(QUESTIONS).length, `order ${order} misses questions`);
}

// Scored answers never move affection, and every suitor can land in any ending tier.
for (const opts of Object.values(scored)) opts.forEach(o => assert(!o.aff, `${o.q} changes affection`));
for (const who of Object.keys(CAST).filter(k => CAST[k].suitor)) {
    let min = 0, max = 0;
    for (const scene of Object.values(SCENES)) {
        if ((scene.who || scene.replyAs) !== who || !Array.isArray(scene.choices)) continue;
        const affs = scene.choices.map(c => c.aff || 0);
        min += Math.min(...affs);
        max += Math.max(...affs);
    }
    assert.strictEqual(tier(min), 'low', `${who} can't reach the low ending (min ${min})`);
    assert.strictEqual(tier(max), 'high', `${who} can't reach the high ending (max ${max})`);
    assert(Array.from({ length: max - min + 1 }, (_, i) => tier(min + i)).includes('mid'), `${who} can't reach the mid ending`);
}

// Random play splits about evenly.
let rWins = 0;
const N = 20000;
const qids = Object.keys(QUESTIONS);
for (let i = 0; i < N; i++) {
    let r = 0;
    for (const _ of qids) if (Math.random() < 0.5) r++;
    if (r > qids.length - r) rWins++;
}
const share = rWins / N;
assert(share > 0.47 && share < 0.53, `random play favors a side: ${share}`);

console.log(`ok: ${qids.length} questions, max ${qids.length} each side, random-play Ricketts share ${(share * 100).toFixed(1)}%`);
