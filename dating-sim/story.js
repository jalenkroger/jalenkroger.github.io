// Harvest Hearts: story, scoring and sources.
//
// Two counters run side by side and never touch:
//   - affection: how a suitor feels about you. Only the flirting choices move
//     it. Scored answers never do, so no suitor is a stand-in for a candidate.
//   - the ballot tally: each scored choice carries `side` ('R' or 'O') and a
//     question id `q`. Each scored question has exactly one option per side.

const CAST = {
    kenzie: { name: 'Kenzie' },
    walt: { name: 'Walt', suitor: true },
    rosa: { name: 'Rosa', suitor: true },
    theo: { name: 'Theo', suitor: true },
    june: { name: 'June', suitor: true },
};

const CANDIDATES = {
    R: { name: 'Pete Ricketts', short: 'Ricketts', label: 'Republican incumbent' },
    O: { name: 'Dan Osborn', short: 'Osborn', label: 'Independent challenger' },
};

const SOURCES = {
    flatwater: { label: 'Flatwater Free Press, debate coverage', url: 'https://flatwaterfreepress.org/pete-ricketts-dan-osborn-go-head-to-head-in-nebraska-u-s-senate-debate/' },
    nbc: { label: 'NBC News, debate coverage', url: 'https://www.nbcnews.com/politics/2026-election/gop-sen-pete-ricketts-independent-dan-osborn-clash-fiery-nebraska-sena-rcna595645' },
    rickettsIssues: { label: 'Sen. Ricketts, issues page', url: 'https://www.ricketts.senate.gov/about/issues/' },
    rickettsBorder: { label: 'Sen. Ricketts, statement on Border Patrol and ICE funding', url: 'https://www.ricketts.senate.gov/news/press-releases/ricketts-issues-statement-after-bill-to-fund-border-patrol-and-ice-passes-senate/' },
    osbornPlan: { label: 'Osborn campaign, Nebraska Fairness Plan', url: 'https://www.osbornforsenate.com/nfp-protect-our-paychecks-social-security-and-healthcare' },
    osbornWiki: { label: 'Wikipedia, Dan Osborn', url: 'https://en.wikipedia.org/wiki/Dan_Osborn' },
};

// What each scored answer is actually about, and where each candidate stands.
const ISSUES = {
    independence: {
        title: 'Who you trust to lead',
        R: { text: 'Runs as a Republican and pitches himself as "somebody who\'s delivered for Nebraska for 12 years" as governor and senator.', src: ['flatwater'] },
        O: { text: 'Says "I don\'t need to caucus with either party" and that he\'d "work for the people of Nebraska, not a party boss."', src: ['nbc'] },
    },
    taxes: {
        title: 'Taxes and the size of government',
        R: { text: 'Backed the 2025 federal tax law, saying it avoided "a $2,400 tax increase," and lists "Reining in Big Government" among his priorities.', src: ['flatwater', 'rickettsIssues'] },
        O: { text: 'Says he "would have voted against" that bill in its current form, and argues "families are falling behind" on costs.', src: ['nbc', 'flatwater'] },
    },
    healthcare: {
        title: 'Health care',
        R: { text: 'Defends the recent Medicaid changes as intended to preserve the program for people who qualify.', src: ['flatwater'] },
        O: { text: 'Says the Medicaid changes are "already creating challenges in rural Nebraska," pointing to a dialysis closure in Chadron, and campaigns on protecting health care, Social Security and Medicare.', src: ['flatwater', 'osbornPlan'] },
    },
    trade: {
        title: 'Trade',
        R: { text: 'Defends tariffs, saying other countries "have high tariffs on our products. We have low tariffs on theirs, and it\'s not fair."', src: ['flatwater'] },
        O: { text: 'Says "targeted tariffs can work," but a "blanket tariff policy" is raising costs for things like building materials.', src: ['flatwater'] },
    },
    immigration: {
        title: 'Immigration enforcement',
        R: { text: 'Supports more funding for Border Patrol and ICE, and accuses Osborn of backing policies that would weaken enforcement.', src: ['rickettsBorder', 'flatwater'] },
        O: { text: '"I support a secure border and the removal of violent criminals," he said, while calling for congressional oversight of ICE.', src: ['flatwater'] },
    },
    corporate: {
        title: 'Big companies and the little guy',
        R: { text: 'Lists "Reining in Big Government" among his top priorities, favoring a smaller federal role in the economy.', src: ['rickettsIssues'] },
        O: { text: 'Says he supports capitalism and a "true free market" but opposes monopolies, and says his main goal is getting big money out of politics.', src: ['osbornWiki'] },
    },
    war: {
        title: 'Sending troops',
        R: { text: 'Lists "Maintaining Peace Through Strength" among his priorities and backs continued pressure on Iran.', src: ['rickettsIssues', 'flatwater'] },
        O: { text: 'Agrees Iran shouldn\'t get a nuclear weapon, but says "Congress should reclaim its constitutional authority over decisions involving war."', src: ['flatwater'] },
    },
};


// Every scored question, in the order you'll meet them. Each one is an
// everyday dilemma; `about` is what it stands for, shown only on the results.
const QUESTIONS = {
    q1: { issue: 'independence', moment: 'Kenzie: where to book your first date', about: 'The place with a long track record, or the newcomer who owes nobody.' },
    q2: { issue: 'trade', moment: 'Walt: the neighbor who kept his post driver', about: 'Cut a partner off from everything until they play fair, or push back only on the thing they did wrong.' },
    q3: { issue: 'corporate', moment: 'Rosa: the only tow truck in the county', about: 'When one outfit has no competition and jacks up prices, do you want a competitor or a watchdog?' },
    q4: { issue: 'taxes', moment: 'Theo: the rent cut', about: 'Enjoy a cut you earned, or worry about who ends up covering the difference.' },
    q5: { issue: 'healthcare', moment: 'June: the clinic that loses money', about: 'Keep services lean so they survive for those who qualify, or keep rural care open even when the math is ugly.' },
    q6: { issue: 'independence', moment: 'Walt: two chili feeds, one Walt', about: 'Join the group with the proven record, or go it alone.' },
    q7: { issue: 'war', moment: 'Walt: Duke the dog', about: 'Looking strong keeps trouble away, or nobody picks a fight until everybody agrees.' },
    q8: { issue: 'taxes', moment: 'Rosa: the paperwork', about: 'Shrink the government that makes the forms, or ask who gets the breaks while you get the bill.' },
    q9: { issue: 'immigration', moment: 'Rosa: the new badge scanners', about: 'Enforce the rules evenly, or enforce them with someone watching the enforcers.' },
    q10: { issue: 'trade', moment: 'Theo: Kearney\'s muffins', about: 'Tit-for-tat with a partner who won\'t buy from you, or pressure only on the sticking point.' },
    q11: { issue: 'corporate', moment: 'Theo: the chain by the interstate', about: 'Beat the giant by competing, or watch out for a giant squeezing out the little guy.' },
    q12: { issue: 'healthcare', moment: 'June: running the hospital for a day', about: 'Trim waste so the money reaches patients, or protect access to care out here.' },
    q13: { issue: 'immigration', moment: 'June: searches at the ER door', about: 'Security first, or security that has to answer to somebody.' },
};

const DATES = [
    { who: 'walt', label: 'Walt: "Sunset at the north pasture?"', start: 'walt_date1' },
    { who: 'rosa', label: 'Rosa: "Help me fix a tractor? I\'ll feed you."', start: 'rosa_date1' },
    { who: 'theo', label: 'Theo: "After-hours coffee tasting."', start: 'theo_date1' },
    { who: 'june', label: 'June: "Roof. Break. Bring snacks."', start: 'june_date1' },
];

const SCENES = {
    // ---------------- Arrival ----------------
    intro1: {
        bg: 'porch',
        text: 'Harvest season in Harlan Creek, Nebraska. One stoplight, one grain elevator, 2,140 people.',
        next: 'intro2',
    },
    intro2: {
        bg: 'porch',
        text: 'You\'re home for the fall. Your cousin Kenzie keeps texting about something called Harvest Hearts.',
        next: 'k1',
    },
    k1: {
        bg: 'porch', who: 'kenzie', mood: 'grin',
        text: '{name}! Don\'t be mad. I signed you up for speed dating at the festival tonight.',
        choices: [
            { text: 'Kenzie. No.', reply: 'Yes. It\'s for the library roof. Basically charity.' },
            { text: '...Are they cute?', reply: 'THAT\'S the spirit.' },
        ],
        next: 'k2',
        shuffle: false,
    },
    k2: {
        bg: 'porch', who: 'kenzie',
        text: 'Walt, Rosa, Theo and June. Five minutes each. I vetted everybody.',
        next: 'k3',
    },
    k3: {
        bg: 'porch', who: 'kenzie', mood: 'soft',
        text: 'Last thing. Where should I book your first date?',
        choices: [
            { q: 'q1', side: 'R', text: 'The Hilltop. Same family for forty years. Never lets anyone down.' },
            { q: 'q1', side: 'O', text: 'The Pickup. New owner, doesn\'t owe the old crowd a thing.' },
        ],
        next: 'k4',
    },
    k4: {
        bg: 'porch', who: 'kenzie', mood: 'grin',
        text: 'Love it. Seven o\'clock. Wear something that isn\'t a hoodie.',
        next: 'fest1',
    },

    // ---------------- Speed dating ----------------
    fest1: {
        bg: 'festival',
        text: 'The fairgrounds glow. Kettle corn, a pie auction, and a folding table with a sign: HARVEST HEARTS. BE NICE.',
        next: 'fest2',
    },
    fest2: {
        bg: 'festival', who: 'kenzie',
        text: 'Five minutes each. If anyone brings up Husker bowl odds, you may leave.',
        next: 'walt_meet1',
    },

    walt_meet1: {
        bg: 'festival', who: 'walt',
        text: 'Walt Brandt. I run cattle north of the Loup. Kenzie says you\'re nicer than my last date.',
        choices: [
            { text: 'I\'ll try to live up to that.', aff: 2, reply: 'So far, so good.' },
            { text: 'Nicer than who?', aff: 1, reply: 'She asked if cows were boy horses.' },
            { text: 'Is the hat part of the deal?', aff: 1, reply: 'Not optional.' },
        ],
        next: 'walt_meet2',
    },
    walt_meet2: {
        bg: 'festival', who: 'walt', mood: 'soft',
        text: 'Quick one. My neighbor borrowed my post driver and won\'t give it back. Kenzie says stop lending him anything.',
        choices: [
            { q: 'q2', side: 'R', text: 'She\'s right. Nothing leaves your barn till he plays fair.' },
            { q: 'q2', side: 'O', text: 'Just go get the post driver. No need to feud over everything else.' },
        ],
        next: 'walt_meet3',
    },
    walt_meet3: {
        bg: 'festival', who: 'walt', mood: 'grin',
        text: 'Huh. Good answer. There\'s the bell.',
        next: 'rosa_meet1',
    },

    rosa_meet1: {
        bg: 'festival', who: 'rosa', mood: 'grin',
        text: 'Rosa Delgado. Night mechanic at the cereal plant. Yes, I smell like corn flakes.',
        choices: [
            { text: 'Honestly? Great smell.', aff: 2, reply: 'You\'re sweet. Or hungry.' },
            { text: 'So you\'re why it\'s crunchy.', aff: 2, reply: 'Finally, someone gets it.' },
            { text: 'When do you sleep?', aff: 1, reply: 'I don\'t.' },
        ],
        next: 'rosa_meet2',
    },
    rosa_meet2: {
        bg: 'festival', who: 'rosa', mood: 'worried',
        text: 'The only tow truck in the county just doubled his prices. Guess why.',
        choices: [
            { q: 'q3', side: 'O', text: 'Because he can. Somebody ought to call him on it.' },
            { q: 'q3', side: 'R', text: 'Because nobody\'s competing. Somebody should start a second one.' },
        ],
        next: 'rosa_meet3',
    },
    rosa_meet3: {
        bg: 'festival', who: 'rosa', mood: 'smile',
        text: 'Ha. Good. Go on, Theo\'s been fixing his hair for ten minutes.',
        next: 'theo_meet1',
    },

    theo_meet1: {
        bg: 'festival', who: 'theo', mood: 'grin',
        text: 'Theo Park! I run Prairie Grind on Main. Two years here, still "the new guy."',
        choices: [
            { text: 'Your cold brew is dangerous.', aff: 2, reply: 'Best review I\'ve ever gotten.' },
            { text: 'Only eighteen more years to go.', aff: 2, reply: 'Oh no. You\'re right.' },
            { text: 'Why\'d you leave Omaha?', aff: 1, reply: 'Rent. And the sky. Mostly rent.' },
        ],
        next: 'theo_meet2',
    },
    theo_meet2: {
        bg: 'festival', who: 'theo', mood: 'smile',
        text: 'Weird news. My landlord cut my rent, but raised it on the apartments upstairs.',
        choices: [
            { q: 'q4', side: 'R', text: 'Take the win. You worked hard for that shop.' },
            { q: 'q4', side: 'O', text: 'Hard to celebrate if the folks upstairs are covering it.' },
        ],
        next: 'theo_meet3',
    },
    theo_meet3: {
        bg: 'festival', who: 'theo', mood: 'grin',
        text: 'Interesting. Okay, bell. Come by the shop?',
        next: 'june_meet1',
    },

    june_meet1: {
        bg: 'festival', who: 'june', mood: 'soft',
        text: 'June Halvorsen. Nurse at the county hospital. Sorry, I came straight from a shift.',
        choices: [
            { text: 'You\'re kind of a local hero, you know.', aff: 2, reply: 'Tell that to my feet.' },
            { text: 'You look great for hour twelve.', aff: 2, reply: 'Thirteen. But thank you.' },
            { text: 'Want some kettle corn?', aff: 1, reply: 'Thought you\'d never ask.' },
        ],
        next: 'june_meet2',
    },
    june_meet2: {
        bg: 'festival', who: 'june', mood: 'worried',
        text: 'My mom says if the clinic loses money, it should close. I say some things aren\'t supposed to make money.',
        choices: [
            { q: 'q5', side: 'R', text: 'She\'s half right. Run it lean so it\'s still there for people who need it.' },
            { q: 'q5', side: 'O', text: 'You\'re right. Some things are worth it even when the math is ugly.' },
        ],
        next: 'june_meet3',
    },
    june_meet3: {
        bg: 'festival', who: 'june', mood: 'smile',
        text: 'You actually answered. Most people just say "that\'s hard."',
        next: 'fest3',
    },

    fest3: {
        bg: 'festival', who: 'kenzie', mood: 'grin',
        text: 'Everybody wants your number. EVERYBODY. You have a week of dates, you menace.',
        next: 'hub',
    },

    // The hub lists whichever dates you haven't been on yet.
    hub: {
        bg: 'porch',
        text: (s) => s.done.size === 0
            ? 'Your phone buzzes four times. Four invitations.'
            : s.done.size === DATES.length
                ? 'One more text, from Kenzie: "BARN DANCE. SATURDAY. NO EXCUSES."'
                : 'Another day in Harlan Creek. Who\'s next?',
        choices: (s) => s.done.size === DATES.length
            ? [{ text: 'Head to the barn dance.', next: 'finale1' }]
            : DATES.filter(d => !s.done.has(d.who)).map(d => ({ text: d.label, next: d.start, mark: d.who })),
        shuffle: false,
    },

    // ---------------- Walt's date ----------------
    walt_date1: {
        bg: 'pasture',
        text: 'Walt drives you out to his north pasture at sunset. The windmill\'s still turning.',
        next: 'walt_date2',
    },
    walt_date2: {
        bg: 'pasture', who: 'walt', mood: 'soft',
        text: 'Grandpa put that windmill up in \'61. The cattle don\'t care about the view. I do.',
        choices: [
            { text: 'The sky goes on forever out here.', aff: 2, reply: 'Yeah. It does.' },
            { text: 'Does it still work?', aff: 1, reply: 'Better than my truck.' },
            { text: 'Bring all your dates here?', aff: 1, reply: 'You\'re the first who didn\'t ask to leave.' },
        ],
        next: 'walt_date3',
    },
    walt_date3: {
        bg: 'pasture', who: 'walt',
        text: 'The Lutherans and the Catholics both want me running their chili feed. Or I just throw my own.',
        choices: [
            { q: 'q6', side: 'R', text: 'Go with whoever\'s done it for years. They know how to pull it off.' },
            { q: 'q6', side: 'O', text: 'Throw your own. Then you don\'t owe either of them.' },
        ],
        next: 'walt_date4',
    },
    walt_date4: {
        bg: 'pasture', who: 'walt', mood: 'smile',
        text: 'Figured you\'d say that. Weirdly, it helps.',
        next: 'walt_date5',
    },
    walt_date5: {
        bg: 'pasture', who: 'walt', mood: 'worried',
        text: 'My dog Duke barks at every coyote for a mile. Neighbors hate it. Dad says it\'s why the coyotes stay away.',
        choices: [
            { q: 'q7', side: 'R', text: 'Your dad\'s right. Nothing messes with a place that looks ready.' },
            { q: 'q7', side: 'O', text: 'Maybe. But before Duke goes after anything, the family should agree on it.' },
        ],
        next: 'walt_date6',
    },
    walt_date6: {
        bg: 'pasture', who: 'walt', mood: 'grin',
        text: 'Duke would want more barking. For the record.',
        next: 'walt_date7',
    },
    walt_date7: {
        bg: 'pasture',
        text: 'It\'s getting cold. Walt holds out his jacket.',
        choices: [
            { text: 'Take it and lean on his shoulder.', aff: 2, reply: '...Well. This is nice.', mood: 'grin' },
            { text: 'Take it and point out a shooting star.', aff: 2, reply: 'Make a wish. I did.', mood: 'grin' },
            { text: 'You\'re from here too. You\'re fine.', aff: 0, reply: 'Fair. Stubborn\'s in the water.', mood: 'smile' },
        ],
        replyAs: 'walt',
        next: 'walt_date8',
    },
    walt_date8: {
        bg: 'pasture', who: 'walt', mood: 'smile',
        text: 'I\'d like to do this again. If you would.',
        next: 'hub',
    },

    // ---------------- Rosa's date ----------------
    rosa_date1: {
        bg: 'shop',
        text: 'Rosa\'s shop, her day off. She\'s under a 1978 tractor she\'s fixing up for her dad.',
        next: 'rosa_date2',
    },
    rosa_date2: {
        bg: 'shop', who: 'rosa', mood: 'grin',
        text: 'Hand me the 9/16? The other one. Thanks. Already better than my last date.',
        choices: [
            { text: 'Ask her to teach you something.', aff: 2, reply: 'Oh, you\'re dangerous. Grab this.' },
            { text: 'Admire the tractor.', aff: 1, reply: 'She\'ll be beautiful. Eventually.' },
            { text: 'Ask if there\'s food.', aff: 1, reply: 'Kolaches in the fridge. My tía\'s.' },
        ],
        next: 'rosa_date3',
    },
    rosa_date3: {
        bg: 'shop', who: 'rosa',
        text: 'I fix mowers on the side. I spend more time on forms than on mowers.',
        choices: [
            { q: 'q8', side: 'R', text: 'Nobody should need a lawyer to fix a lawnmower. Cut the forms.' },
            { q: 'q8', side: 'O', text: 'Bet the big dealership gets a break on all that. You get the bill.' },
        ],
        next: 'rosa_date4',
    },
    rosa_date4: {
        bg: 'shop', who: 'rosa', mood: 'smile',
        text: 'Right?! Okay, moving on before I get worked up.',
        next: 'rosa_date5',
    },
    rosa_date5: {
        bg: 'shop', who: 'rosa', mood: 'worried',
        text: 'The plant put in badge scanners. Keeps strangers out. Also walked out a guy with eleven years in when his badge glitched.',
        choices: [
            { q: 'q9', side: 'R', text: 'Rules are rules for everybody. Fix his badge, keep the scanners.' },
            { q: 'q9', side: 'O', text: 'Keep the scanners. But somebody should be watching whoever runs them.' },
        ],
        next: 'rosa_date6',
    },
    rosa_date6: {
        bg: 'shop', who: 'rosa', mood: 'soft',
        text: 'Eleven years. He brought donuts every Friday.',
        next: 'rosa_date7',
    },
    rosa_date7: {
        bg: 'shop',
        text: 'She turns the key. The tractor coughs... and roars. Rosa whoops.',
        choices: [
            { text: 'Hug her, grease and all.', aff: 2, reply: 'New shirt time. Worth it.', mood: 'grin' },
            { text: 'Double high five!', aff: 2, reply: 'YES!', mood: 'grin' },
            { text: 'Ask to drive it.', aff: 1, reply: 'One lap. ONE.', mood: 'grin' },
        ],
        replyAs: 'rosa',
        next: 'rosa_date8',
    },
    rosa_date8: {
        bg: 'shop', who: 'rosa', mood: 'grin',
        text: 'Dad\'s gonna cry. You\'re coming to Sunday dinner. Not a question.',
        next: 'hub',
    },

    // ---------------- Theo's date ----------------
    theo_date1: {
        bg: 'roastery',
        text: 'Prairie Grind, after close. Six tiny bowls of coffee and one very serious spoon.',
        next: 'theo_date2',
    },
    theo_date2: {
        bg: 'roastery', who: 'theo', mood: 'grin',
        text: 'You slurp it. Loudly. It\'s professional, I swear.',
        choices: [
            { text: 'Slurp as loud as humanly possible.', aff: 2, reply: 'PERFECT. A natural.' },
            { text: 'Make him go first.', aff: 1, reply: 'Fine. Don\'t laugh. ...You\'re laughing.' },
            { text: 'Which one\'s your favorite?', aff: 1, reply: 'Third from the left. Don\'t tell the others.' },
        ],
        next: 'theo_date3',
    },
    theo_date3: {
        bg: 'roastery', who: 'theo', mood: 'worried',
        text: 'The café in Kearney won\'t carry my beans. But they want me to sell their muffins.',
        choices: [
            { q: 'q10', side: 'R', text: 'No muffins till they carry your beans. Fair\'s fair.' },
            { q: 'q10', side: 'O', text: 'Sell the muffins if people like them. Just keep pushing on the beans.' },
        ],
        next: 'theo_date4',
    },
    theo_date4: {
        bg: 'roastery', who: 'theo', mood: 'smile',
        text: 'My dad would love you. He argues about muffins too.',
        next: 'theo_date5',
    },
    theo_date5: {
        bg: 'roastery', who: 'theo', mood: 'soft',
        text: 'A big chain opened by the interstate. Cheaper than me. Way cheaper.',
        choices: [
            { q: 'q11', side: 'R', text: 'So be better. People drive for good coffee.' },
            { q: 'q11', side: 'O', text: 'They\'ll undercut you till you close, then raise prices. Watch.' },
        ],
        next: 'theo_date6',
    },
    theo_date6: {
        bg: 'roastery', who: 'theo', mood: 'grin',
        text: 'Okay. That\'s going on the chalkboard.',
        next: 'theo_date7',
    },
    theo_date7: {
        bg: 'roastery',
        text: 'Theo slides a bag across the counter. In his handwriting: {NAME} BLEND (EXPERIMENTAL).',
        choices: [
            { text: 'Sweetest thing ever.', aff: 2, reply: 'Oh no. I\'m blushing.', mood: 'grin' },
            { text: 'What\'s in it?', aff: 1, reply: 'Secret. Mostly Guatemalan.', mood: 'smile' },
            { text: 'Kiss his cheek.', aff: 2, reply: '...Wow. Hi.', mood: 'grin' },
        ],
        replyAs: 'theo',
        next: 'theo_date8',
    },
    theo_date8: {
        bg: 'roastery', who: 'theo', mood: 'smile',
        text: 'Same time next week? New batch. Better jokes. Maybe.',
        next: 'hub',
    },

    // ---------------- June's date ----------------
    june_date1: {
        bg: 'rooftop',
        text: 'June\'s on the hospital roof, sitting on a milk crate, watching the water tower.',
        next: 'june_date2',
    },
    june_date2: {
        bg: 'rooftop', who: 'june', mood: 'grin',
        text: 'You brought Runzas. Marry me. Kidding. Mostly.',
        choices: [
            { text: 'Sit close and hand her one.', aff: 2, reply: 'Best break all month.' },
            { text: 'I\'d consider it.', aff: 2, reply: 'Careful. I\'ll hold you to that.' },
            { text: 'How\'s the shift?', aff: 1, reply: 'A guy swallowed a fishing lure.' },
        ],
        next: 'june_date3',
    },
    june_date3: {
        bg: 'rooftop', who: 'june',
        text: 'Say you ran this place for a day. First thing you\'d fix?',
        choices: [
            { q: 'q12', side: 'R', text: 'The waste. Money should go to patients, not paperwork.' },
            { q: 'q12', side: 'O', text: 'Nobody should have to drive to Denver to see a specialist.' },
        ],
        next: 'june_date4',
    },
    june_date4: {
        bg: 'rooftop', who: 'june', mood: 'smile',
        text: 'Better answer than the board\'s.',
        next: 'june_date5',
    },
    june_date5: {
        bg: 'rooftop', who: 'june', mood: 'worried',
        text: 'New rule: everyone gets searched at the ER door. Safer. It also left an old man waiting in the cold.',
        choices: [
            { q: 'q13', side: 'R', text: 'Keep the searches. Safe comes first. Then fix the line.' },
            { q: 'q13', side: 'O', text: 'Safe, sure. But somebody should answer for leaving him out there.' },
        ],
        next: 'june_date6',
    },
    june_date6: {
        bg: 'rooftop', who: 'june', mood: 'smile',
        text: 'You\'d do fine in our break room.',
        next: 'june_date7',
    },
    june_date7: {
        bg: 'rooftop',
        text: 'The water tower light blinks. A pager goes off downstairs. June sighs.',
        choices: [
            { text: 'I\'ll wait for you after your shift.', aff: 2, reply: 'I\'m off at seven. A.M.', mood: 'grin' },
            { text: 'You\'re the bravest person I know.', aff: 2, reply: 'Nobody\'s said that before.', mood: 'soft' },
            { text: 'Steal her last pickle.', aff: 1, reply: 'Criminal.', mood: 'grin' },
        ],
        replyAs: 'june',
        next: 'june_date8',
    },
    june_date8: {
        bg: 'rooftop', who: 'june', mood: 'smile',
        text: 'Duty calls. Thank you. Really.',
        next: 'hub',
    },

    // ---------------- Finale ----------------
    finale1: {
        bg: 'barn', who: 'kenzie', mood: 'grin',
        text: 'Barn dance! Walt ironed a shirt. Rosa wore earrings. Theo brought a thermos. June got her shift covered.',
        next: 'finale2',
    },
    finale2: {
        bg: 'barn', who: 'kenzie', mood: 'soft',
        text: 'So, {name}. Who are you asking to dance?',
        choices: [
            { text: 'Walt', next: 'end_walt' },
            { text: 'Rosa', next: 'end_rosa' },
            { text: 'Theo', next: 'end_theo' },
            { text: 'June', next: 'end_june' },
            { text: 'Kenzie, obviously.', next: 'end_kenzie' },
        ],
        shuffle: false,
        grid: true,
    },
};

// Endings depend on how warm you were, not on how you answered the big questions.
// Each suitor has three flirting moments worth 0-2 points apiece.
const tier = (aff) => (aff >= 5 ? 'high' : aff >= 4 ? 'mid' : 'low');

const ENDINGS = {
    walt: {
        high: 'I was hoping you\'d pick me. I\'ve got two moves. Let\'s see what comes after this song.',
        mid: 'Not much of a dancer. Glad it\'s you, though. Let\'s take it slow.',
        low: 'I think we\'re better neighbors than sweethearts. Save me some pie.',
    },
    rosa: {
        high: 'Took you long enough. Dad already set you a place for Sunday.',
        mid: 'One dance. Then we\'ll see if you can keep up.',
        low: 'You\'re sweet. But I think we\'re friends. Real ones.',
    },
    theo: {
        high: 'I practiced in the shop after close. Don\'t laugh. Okay, laugh.',
        mid: 'Oh! Yes. I\'m nervous. Dance, then coffee, then... we\'ll see?',
        low: 'I\'d rather be your coffee guy than your guy. Free refills forever.',
    },
    june: {
        high: 'I traded two holiday shifts for tonight. Worth it. Dance with me.',
        mid: 'I don\'t get many nights like this. Glad it\'s with you.',
        low: 'You\'d make a great friend. Come find me on the roof sometime.',
    },
};

for (const who of Object.keys(ENDINGS)) {
    SCENES[`end_${who}`] = {
        bg: 'barn', who,
        mood: (s) => (tier(s.aff[who]) === 'high' ? 'grin' : tier(s.aff[who]) === 'mid' ? 'smile' : 'soft'),
        text: (s) => ENDINGS[who][tier(s.aff[who])],
        next: 'ballot1',
    };
}
SCENES.end_kenzie = {
    bg: 'barn', who: 'kenzie', mood: 'grin',
    text: 'You sap. Fine. I lead.',
    next: 'ballot1',
};

SCENES.ballot1 = {
    bg: 'barn',
    text: 'On your way out, someone hands you a flyer: "Election Day is Nov. 3."',
    next: 'ballot2',
};
SCENES.ballot2 = {
    bg: 'barn',
    text: 'Plot twist: 13 of your answers this week quietly lined up with the two candidates in Nebraska\'s U.S. Senate race.',
    choices: [{ text: 'Show me my match.', results: true }],
};

if (typeof module !== 'undefined') {
    module.exports = { CAST, CANDIDATES, SOURCES, ISSUES, QUESTIONS, DATES, SCENES, ENDINGS, tier };
}
