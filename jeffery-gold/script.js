/**
 * THE BUDGET PARADOX: Immersive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollytelling();
    initHeroParallax();
    initLeadershipHover();
    initPeerChart();
});

function initHeroParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(${1 + scrolled * 0.0005})`;
        }
    });
}

function initScrollytelling() {
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.parentElement.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
                entry.target.classList.add('active');

                const step = entry.target.getAttribute('data-step');
                updateVisualization(step);
            }
        });
    }, observerOptions);

    const steps = document.querySelectorAll('.step');
    steps.forEach(step => observer.observe(step));
}

function initLeadershipHover() {
    const blocks = document.querySelectorAll('.totem-block');
    const revealCard = document.getElementById('reveal-card');
    const revealContent = revealCard ? revealCard.querySelector('.reveal-content') : null;

    blocks.forEach(block => {
        block.addEventListener('mouseenter', () => {
            if (revealCard && revealContent) {
                const text = block.getAttribute('data-reveal');
                revealContent.innerText = text;
                revealCard.classList.add('active');
            }
        });
        block.addEventListener('mouseleave', () => {
            if (revealCard && revealContent) {
                revealContent.innerText = "Hover to investigate the disparity";
                revealCard.classList.remove('active');
            }
        });
    });
}

// -------------------------------------------------------------
// LOGIC: Graphic 5 - Peer Comparison
// -------------------------------------------------------------
function initPeerChart() {
    const chartContainer = document.getElementById('peer-chart');
    if (!chartContainer) return;

    // Ordered by competitive position / spend
    const peerData = [
        { name: "Ohio State", value: 100, label: "$1,400,000", gradValue: 68, gradLabel: "68% Grad Rate", isTarget: false },
        { name: "University of Missouri", value: 81, label: "$1,135,867", gradValue: 56, gradLabel: "56% Grad Rate", isTarget: false },
        { name: "University of Nebraska", value: 76, label: "$1,062,573", gradValue: 46, gradLabel: "46% Grad Rate", isTarget: true },
        { name: "University of Minnesota", value: 70, label: "$975,000", gradValue: 71, gradLabel: "71% Grad Rate", isTarget: false },
        { name: "University of Illinois", value: 66, label: "$916,770", gradValue: 73, gradLabel: "73% Grad Rate", isTarget: false },
        { name: "University of Colorado", value: 65, label: "$910,520", gradValue: 62, gradLabel: "62% Grad Rate", isTarget: false },
        { name: "Indiana University", value: 64, label: "$896,128", gradValue: 71, gradLabel: "71% Grad Rate", isTarget: false },
        { name: "University of Kansas", value: 64, label: "$895,000", gradValue: 54, gradLabel: "54% Grad Rate", isTarget: false },
        { name: "Purdue University", value: 60, label: "$838,400", gradValue: 68, gradLabel: "68% Grad Rate", isTarget: false },
        { name: "University of Iowa", value: 54, label: "$760,000", gradValue: 66, gradLabel: "66% Grad Rate", isTarget: false }
    ];

    peerData.forEach(peer => {
        const row = document.createElement('div');
        row.className = `bar-row ${peer.isTarget ? 'highlight' : ''}`;

        row.innerHTML = `
            <div class="bar-label" title="${peer.name}">${peer.name}</div>
            <div class="bar-track">
                <div class="bar-fill" 
                    data-salary-width="${peer.value}%" 
                    data-salary-label="${peer.label}"
                    data-grad-width="${peer.gradValue}%"
                    data-grad-label="${peer.gradLabel}">
                </div>
            </div>
            <div class="bar-tooltip">${peer.label}</div>
        `;
        chartContainer.appendChild(row);
    });
}

function updateVisualization(step) {
    // 1. The Budget Pipeline (Polished SVG Flow)
    const svgFaculty = document.getElementById('svg-faculty');
    const svgAdjunct = document.getElementById('svg-adjunct');
    const svgAdmin = document.getElementById('svg-admin');
    const dataFacultySvg = document.getElementById('data-faculty-svg');
    const dataAdjunctSvg = document.getElementById('data-adjunct-svg');
    const dataAdminSvg = document.getElementById('data-admin-svg');

    // 2. Leadership Totem (2-Pillar Animation)
    const pillarFacultyDyna = document.getElementById('pillar-faculty-dyna');
    const facultyInflationShadow = document.getElementById('faculty-inflation-shadow');
    const facultyLabel = document.getElementById('faculty-label');

    const pillarPresidentDyna = document.getElementById('pillar-president-dyna');
    const presidentInflationShadow = document.getElementById('president-inflation-shadow');
    const presidentLabel = document.getElementById('president-label');
    const presidentBadge = document.getElementById('president-badge');

    // 3. Divergence Chart
    const lineTuition = document.getElementById('line-tuition');
    const lineAid = document.getElementById('line-aid');
    const lineInflation = document.getElementById('line-inflation');
    const tuitionSpark = document.getElementById('tuition-spark');
    const deadZone = document.getElementById('dead-zone');
    const heatGlow = document.querySelector('.heat-glow');
    const deadZoneLabel = document.getElementById('dead-zone-label');

    // -------------------------------------------------------------
    // LOGIC: Graphic 1 - Pipeline
    // -------------------------------------------------------------
    if (step === 'pipe-intro') {
        if (svgFaculty) {
            svgFaculty.style.strokeWidth = '60px';
            svgAdmin.style.strokeWidth = '40px';
            svgAdmin.classList.remove('pulse');
            svgAdjunct.style.strokeWidth = '0px';
            svgAdjunct.style.opacity = '0';
            dataFacultySvg.style.opacity = '0';
            dataAdjunctSvg.style.opacity = '0';
            dataAdminSvg.style.opacity = '0';
        }
    }

    if (step === 'pipe-shift') {
        if (svgFaculty) {
            svgFaculty.style.strokeWidth = '30px';
            svgAdmin.style.strokeWidth = '40px';
            svgAdmin.classList.remove('pulse');
            svgAdjunct.style.strokeWidth = '0px';
            svgAdjunct.style.opacity = '0';
            dataFacultySvg.style.opacity = '1';
            dataAdjunctSvg.style.opacity = '0';
            dataAdminSvg.style.opacity = '0';
        }
    }

    if (step === 'pipe-adjuncts') {
        if (svgFaculty) {
            svgFaculty.style.strokeWidth = '30px';
            svgAdjunct.style.strokeWidth = '30px';
            svgAdjunct.style.opacity = '1';
            svgAdmin.style.strokeWidth = '40px';
            svgAdmin.classList.remove('pulse');
            dataFacultySvg.style.opacity = '1';
            dataAdjunctSvg.style.opacity = '1';
            dataAdminSvg.style.opacity = '0';
        }
    }

    if (step === 'pipe-admin') {
        if (svgFaculty) {
            svgFaculty.style.strokeWidth = '30px';
            svgAdjunct.style.strokeWidth = '30px';
            svgAdjunct.style.opacity = '1';
            svgAdmin.style.strokeWidth = '80px';
            svgAdmin.classList.add('pulse');
            dataFacultySvg.style.opacity = '1';
            dataAdjunctSvg.style.opacity = '1';
            dataAdminSvg.style.opacity = '1';
        }
    }

    // -------------------------------------------------------------
    // LOGIC: Graphic 2 - Cost of Leadership
    // -------------------------------------------------------------
    if (step === 'salary-intro') {
        if (pillarPresidentDyna) {
            const maxVal = 1500000; // Increased headroom
            pillarPresidentDyna.style.height = `${(250000 / maxVal) * 100}%`;
            if (presidentInflationShadow) presidentInflationShadow.style.opacity = '0';
            if (presidentBadge) presidentBadge.style.opacity = '0';
            presidentLabel.innerHTML = '$250,000<br><span>(2000 Salary)</span>';

            pillarFacultyDyna.style.height = `${(68000 / maxVal) * 100}%`;
            if (facultyInflationShadow) facultyInflationShadow.style.opacity = '0';
            facultyLabel.innerHTML = '$68,000<br><span>(2000 Salary)</span>';
        }
    }

    if (step === 'salary-inflation') {
        if (pillarPresidentDyna) {
            const maxVal = 1500000;
            const targetH_pres = (430000 / maxVal) * 100;
            const targetH_fac = (118000 / maxVal) * 100;

            pillarPresidentDyna.style.height = `${targetH_pres}%`;
            if (presidentInflationShadow) {
                presidentInflationShadow.style.height = `${targetH_pres}%`;
                presidentInflationShadow.style.opacity = '1';
            }
            if (presidentBadge) presidentBadge.style.opacity = '0';
            presidentLabel.innerHTML = '$430,000<br><span>(Adjusted for Inflation)</span>';

            pillarFacultyDyna.style.height = `${targetH_fac}%`;
            if (facultyInflationShadow) {
                facultyInflationShadow.style.height = `${targetH_fac}%`;
                facultyInflationShadow.style.opacity = '1';
            }
            facultyLabel.innerHTML = '$118,000<br><span>(Adjusted for Inflation)</span>';
        }
    }

    if (step === 'salary-compare') {
        if (pillarPresidentDyna) {
            const maxVal = 1500000;
            const presSalary = 1062573;
            const facSalary = 108712;
            const inflationH_pres = (430000 / maxVal) * 100;
            const inflationH_fac = (118000 / maxVal) * 100;

            pillarPresidentDyna.style.height = `${(presSalary / maxVal) * 100}%`;
            if (presidentInflationShadow) {
                presidentInflationShadow.style.height = `${inflationH_pres}%`;
                presidentInflationShadow.style.opacity = '1';
            }
            if (presidentBadge) presidentBadge.style.opacity = '1';
            presidentLabel.innerHTML = '$1,062,573<br><span>(2024 Salary)</span>';

            pillarFacultyDyna.style.height = `${(facSalary / maxVal) * 100}%`;
            if (facultyInflationShadow) {
                facultyInflationShadow.style.height = `${inflationH_fac}%`;
                facultyInflationShadow.style.opacity = '1';
            }
            facultyLabel.innerHTML = '$108,712<br><span>(2024 Salary)</span>';
        }
    }

    // Reset logic for Graphic 4
    if (step === 'pipe-admin' || step === 'salary-intro') {
        if (lineInflation) lineInflation.style.opacity = '0';
        if (lineTuition) lineTuition.style.strokeDashoffset = '1000';
        if (lineAid) lineAid.style.strokeDashoffset = '1000';
    }

    if (step === 'tuition-start') {
        if (lineInflation) lineInflation.style.opacity = '1';
        if (lineTuition) lineTuition.style.strokeDashoffset = '0';
        lineAid.style.strokeDashoffset = '1000'; // Make sure aid is hidden initially
        tuitionSpark.classList.add('active');
        deadZone.style.opacity = '0';
        if (deadZoneLabel) deadZoneLabel.style.opacity = '0';
        if (heatGlow) heatGlow.style.opacity = '0';
    }

    if (step === 'aid-drop') {
        lineInflation.style.strokeDashoffset = '0';
        lineTuition.style.strokeDashoffset = '0';
        lineAid.style.strokeDashoffset = '0';
        deadZone.style.opacity = '1';
        if (deadZoneLabel) deadZoneLabel.style.opacity = '1';
        if (heatGlow) heatGlow.style.opacity = '1';
    }

    if (step === 'peer-intro') {
        const barFills = document.querySelectorAll('.bar-fill');
        barFills.forEach(fill => {
            const val = fill.getAttribute('data-salary-width');
            const label = fill.closest('.bar-row').querySelector('.bar-tooltip');
            const targetLabel = fill.getAttribute('data-salary-label');
            if (label) label.innerText = targetLabel;
            fill.style.width = val;
            fill.style.background = fill.closest('.bar-row').classList.contains('highlight') ?
                'linear-gradient(90deg, #800 0%, var(--accent-red) 100%)' : '#444';
        });
    }

    if (step === 'peer-efficiency') {
        const barFills = document.querySelectorAll('.bar-fill');
        barFills.forEach(fill => {
            const val = fill.getAttribute('data-grad-width');
            const label = fill.closest('.bar-row').querySelector('.bar-tooltip');
            const targetLabel = fill.getAttribute('data-grad-label');
            if (label) label.innerText = targetLabel;
            fill.style.width = val;
            // Highlight shift to emphasize performance gap
            if (fill.closest('.bar-row').classList.contains('highlight')) {
                fill.style.background = 'var(--accent-gold)';
            } else {
                fill.style.background = '#666';
            }
        });
    }
}

/**
 * Utility for count-up animation
 */
function animateValue(obj, start, end, duration) {
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        obj.innerHTML = current.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
