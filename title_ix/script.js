// Extract labels (years)
const labels = unlData.map(d => d.year);

// Setup Chart.js
const ctx = document.getElementById('myChart').getContext('2d');

const dnRed = '#ff2a2a'; // Bright Neon Red
const dnGrey = '#e0e0e0'; // stark off-white/silver replacing dnBlack
const dnDarkGrey = '#333';

// Setup Gradients - Updated for Dark Mode
const redGradient = ctx.createLinearGradient(0, 0, 0, 400);
redGradient.addColorStop(0, 'rgba(255, 42, 42, 0.5)');
redGradient.addColorStop(1, 'rgba(255, 42, 42, 0.0)');

const silverGradient = ctx.createLinearGradient(0, 0, 0, 400);
silverGradient.addColorStop(0, 'rgba(224, 224, 224, 0.4)');
silverGradient.addColorStop(1, 'rgba(224, 224, 224, 0.0)');

const redBarGradient = ctx.createLinearGradient(0, 0, 0, 400);
redBarGradient.addColorStop(0, 'rgba(255, 42, 42, 1)');
redBarGradient.addColorStop(1, 'rgba(150, 0, 0, 0.7)');

const silverBarGradient = ctx.createLinearGradient(0, 0, 0, 400);
silverBarGradient.addColorStop(0, 'rgba(224, 224, 224, 1)');
silverBarGradient.addColorStop(1, 'rgba(120, 120, 120, 0.7)');

// Custom Shadow Plugin for extra visual flair
const shadowPlugin = {
    id: 'shadowPlugin',
    beforeDraw: (chart) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 8;
    },
    afterDraw: (chart) => {
        chart.ctx.restore();
    }
};

// Default empty chart
Chart.register(ChartDataLabels);
let currentChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: []
    },
    plugins: [shadowPlugin],
    options: {
        layout: {
            padding: {
                left: 10,
                right: 60,
                top: 20,
                bottom: 10
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#e0e0e0',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 13,
                        weight: '300'
                    }
                }
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#2a2a2a' /* Dark mode grid lines */
                },
                ticks: {
                    color: '#888'
                }
            },
            x: {
                offset: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: '#888',
                    maxRotation: 45,
                    minRotation: 45,
                    autoSkip: false
                }
            }
        },
        animation: {
            duration: 1200,
            easing: 'easeOutQuart'
        }
    }
});

function updateChart(step, direction) {
    if (!unlData || unlData.length === 0) return;

    // Reset visibility for standard graphics
    if (step !== 13) {
        document.getElementById('chart-container').style.display = 'block';
        setTimeout(() => document.getElementById('chart-container').classList.add('active'), 50);

        let animContainer = document.getElementById('flag-football-anim');
        animContainer.classList.remove('active');
        animContainer.style.display = 'none';
    }

    let newDatasets = [];
    let caption = "";

    let isScatter = false;
    let chartType = 'bar'; // Default

    if (step === 10 || step === 11 || step === 12) {
        isScatter = true;
        chartType = 'scatter';
    } else if (step === 1 || step === 2 || step === 4 || step === 7 || step === 9) {
        chartType = 'line';
    }

    // Since changing fundamentally different chart types (like category vs linear x-axis for scatter)
    // can break Chart.js when just updating, we need to destroy and recreate the chart if switching to/from Scatter
    const wasScatter = currentChart.config.type === 'scatter';
    if (isScatter !== wasScatter) {
        currentChart.destroy();
        const ctx = document.getElementById('myChart').getContext('2d');
        const config = {
            type: chartType,
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                color: '#fff',
                plugins: {
                    legend: {
                        labels: { color: 'white', font: { family: "'Inter', sans-serif" } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: { family: "'Oswald', sans-serif", size: 14 },
                        bodyFont: { family: "'Inter', sans-serif", size: 13 },
                        padding: 10,
                        cornerRadius: 4,
                        displayColors: true
                    },
                    datalabels: {
                        display: false // off by default
                    }
                },
                animation: { duration: 800, easing: 'easeOutQuart' }
            }
        };

        if (!isScatter) {
            config.options.scales = {
                x: { ticks: { color: '#a1a1aa', font: { family: "'Inter', sans-serif" } }, grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { beginAtZero: true, ticks: { color: '#a1a1aa', font: { family: "'Inter', sans-serif" } }, grid: { color: 'rgba(255,255,255,0.05)' } }
            };
        }
        currentChart = new Chart(ctx, config);
    } else {
        currentChart.config.type = chartType;
    }

    // Set default labels for timeline charts
    let newLabels = labels;

    if (step === 1) {
        // Undergrads
        newDatasets = [
            {
                type: 'line',
                label: 'Female Undergraduates',
                data: unlData.map(d => d.female_undergrads),
                borderColor: dnRed,
                backgroundColor: redGradient,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: dnRed,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2
            },
            {
                type: 'line',
                label: 'Male Undergraduates',
                data: unlData.map(d => d.male_undergrads),
                borderColor: dnGrey,
                backgroundColor: silverGradient,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: dnGrey,
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2
            }
        ];
        caption = "Undergraduate female enrollment has steadily outpaced male enrollment over the last 20 years.";
    } else if (step === 2) {
        // Athletics Total
        newDatasets = [
            {
                type: 'line',
                label: "Women's Total Participation",
                data: unlData.map(d => d.women_total),
                borderColor: dnRed,
                backgroundColor: 'rgba(255, 42, 42, 0.1)',
                fill: true,
                tension: 0.3,
                borderWidth: 2
            },
            {
                type: 'line',
                label: "Men's Total Participation",
                data: unlData.map(d => d.men_total),
                borderColor: dnGrey,
                backgroundColor: 'rgba(136, 136, 136, 0.1)',
                fill: true,
                tension: 0.3,
                borderWidth: 2
            }
        ];
        caption = "Total participation opportunities have favored men despite the general student body shifting towards women.";
    } else if (step === 3) {
        // Bar Chart for specific 2023 breakdown
        newLabels = ["2023 Unduplicated Breakdown"];
        let lastYear = unlData[unlData.length - 1];
        newDatasets = [
            {
                type: 'bar',
                label: "Women's Unduplicated",
                data: [lastYear.women_unduplicated],
                backgroundColor: redBarGradient,
                borderRadius: 4
            },
            {
                type: 'bar',
                label: "Men's Unduplicated",
                data: [lastYear.men_unduplicated],
                backgroundColor: silverBarGradient,
                borderRadius: 4
            },
            {
                type: 'bar',
                label: "Track Bump (Women)",
                data: [lastYear.women_total - lastYear.women_unduplicated],
                backgroundColor: 'rgba(136, 0, 0, 0.8)',
                borderRadius: 4
            }
        ];
        caption = "Looking at 2023 as a bar comparison: unique individual athletes vs total participation opportunities.";
    } else if (step === 4) {
        // Inflation: Total vs Unduplicated for Women
        newDatasets = [
            {
                type: 'line',
                label: "Total Women's Participation (On Paper)",
                data: unlData.map(d => d.women_total),
                borderColor: dnRed,
                tension: 0.4,
                fill: '+1',
                backgroundColor: 'rgba(255, 42, 42, 0.25)', // Shaded gap area highlighting the inflation
                pointBackgroundColor: dnRed,
                pointRadius: 4,
                borderWidth: 3
            },
            {
                type: 'line',
                label: "Actual Unique Individuals (Unduplicated)",
                data: unlData.map(d => d.women_unduplicated),
                borderColor: dnGrey,
                borderDash: [5, 5],
                tension: 0.4,
                pointBackgroundColor: '#111',
                pointBorderColor: dnGrey,
                pointBorderWidth: 2,
                pointRadius: 4,
                borderWidth: 2
            }
        ];
        caption = "The shaded red area represents 'inflation'—the gap where a single athlete fills multiple spots across different sport seasons.";
    } else if (step === 5) {
        // Bar Chart: Football vs Everything Else (2023)
        newLabels = ["Men's Roster Breakdown (2023)"];
        let lastYear = unlData[unlData.length - 1];
        newDatasets = [
            {
                type: 'bar',
                label: "Men's Football (2023)",
                data: [lastYear.football_men],
                backgroundColor: silverBarGradient,
                borderRadius: 4
            },
            {
                type: 'bar',
                label: "All Other Men's Sports (2023)",
                data: [lastYear.men_total - lastYear.football_men],
                backgroundColor: 'rgba(100, 100, 100, 0.8)',
                borderRadius: 4
            }
        ];
        caption = "Football accounts for an enormous chunk of all male athletic opportunities.";
    } else if (step === 6) {
        // Removing Football (Total Participation)
        newDatasets = [
            {
                type: 'bar',
                label: "Women's Total Participation",
                data: unlData.map(d => d.women_total),
                backgroundColor: redBarGradient,
                borderRadius: 4
            },
            {
                type: 'bar',
                label: "Men's Total (Without Football)",
                data: unlData.map(d => d.men_total - d.football_men),
                backgroundColor: silverBarGradient,
                borderRadius: 4
            }
        ];
        caption = "Without football, women's sports offer more total participation opportunities than men's.";
    } else if (step === 7) {
        // Track bump
        newDatasets = [
            {
                type: 'line',
                label: "Women's Unduplicated Athletes",
                data: unlData.map(d => d.women_unduplicated),
                borderColor: dnGrey,
                borderDash: [5, 5],
                tension: 0.4,
                borderWidth: 3,
                fill: false,
                pointBackgroundColor: '#111',
                pointBorderColor: dnGrey,
                pointBorderWidth: 2,
                pointRadius: 4
            },
            {
                type: 'bar',
                label: "Women's Track & Field Combinations",
                data: unlData.map(d => d.track_women),
                backgroundColor: redBarGradient,
                borderRadius: 4
            }
        ];
        caption = "Women's track and field teams provide massive participation numbers, offering overlapping seasons for runners.";
    } else if (step === 8) {
        // Removing Football (Unduplicated)
        newDatasets = [
            {
                type: 'bar',
                label: "Women's Unduplicated Count",
                data: unlData.map(d => d.women_unduplicated),
                backgroundColor: 'rgba(255, 42, 42, 0.4)',
                borderRadius: 4
            },
            {
                type: 'bar',
                label: "Men's Unduplicated (Without Football)",
                data: unlData.map(d => d.men_unduplicated - d.football_men),
                backgroundColor: 'rgba(224, 224, 224, 0.4)',
                borderRadius: 4
            }
        ];
        caption = "Even when looking at unique athletes rather than total roster spots, women hold an edge without football.";
    } else if (step === 9) {
        // Sand Volleyball
        newDatasets = [
            {
                type: 'line',
                label: "Total Volleyball Participants (Indoor + Beach)",
                data: unlData.map(d => d.volleyball_women + (d.sand_volleyball_women || 0)),
                borderColor: dnRed,
                tension: 0.4,
                borderWidth: 3,
                fill: '+1',
                backgroundColor: 'rgba(255, 42, 42, 0.15)',
                pointBackgroundColor: dnRed
            },
            {
                type: 'line',
                label: "Unduplicated Volleyball Athletes",
                data: unlData.map(d => d.volleyball_women + ((d.sand_volleyball_women || 0) - (d.overlap_volleyball_women || 0))),
                borderColor: '#ff8888',
                borderDash: [5, 5],
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: '#111',
                pointBorderColor: '#ff8888'
            }
        ];
        caption = "The gap shows how adding beach volleyball provided a new competitive season, largely for existing indoor athletes.";
    } else if (step === 10) {
        // Peer Comparison Total Participation 2023 (Scatter Plot)
        newLabels = []; // Clear traditional labels for scatter
        newDatasets = [
            {
                type: 'scatter',
                label: "Schools",
                data: peerData2023.map(d => ({
                    x: d.unadjusted_men,
                    y: d.unadjusted_women,
                    institution: d.institution // Custom property for tooltips
                })),
                backgroundColor: peerData2023.map(d => d.institution === "University of Nebraska" ? dnRed : '#555555'),
                pointRadius: peerData2023.map(d => d.institution === "University of Nebraska" ? 8 : 5),
                pointHoverRadius: 8
            }
        ];
        caption = "Scatter plot of peer schools: distance from the center diagonal indicates disparity.";
    } else if (step === 11) {
        // Peer Comparison 20 Sponsored Sports 2023 (Scatter Plot)
        newLabels = []; // Clear
        newDatasets = [
            {
                type: 'scatter',
                label: "Schools - Adjusted 20 Sports",
                data: peerData2023.map(d => ({
                    x: d.adjusted_men,
                    y: d.adjusted_women,
                    institution: d.institution
                })),
                backgroundColor: peerData2023.map(d => d.institution === "University of Nebraska" ? dnRed : '#555555'),
                pointRadius: peerData2023.map(d => d.institution === "University of Nebraska" ? 8 : 5),
                pointHoverRadius: 8
            }
        ];
        caption = "After removing niche massive women's sports like Rowing, the pack tightens significantly.";
    } else if (step === 12) {
        // Peer Comparison Unduplicated 2023 (Scatter Plot)
        newLabels = []; // Clear
        newDatasets = [
            {
                type: 'scatter',
                label: "Schools - Unduplicated",
                data: peerData2023.map(d => ({
                    x: d.unduplicated_men,
                    y: d.unduplicated_women,
                    institution: d.institution
                })),
                backgroundColor: peerData2023.map(d => d.institution === "University of Nebraska" ? dnRed : '#555555'),
                borderColor: peerData2023.map(d => d.institution === "University of Nebraska" ? '#ffffff' : 'transparent'),
                borderWidth: 2,
                pointRadius: peerData2023.map(d => d.institution === "University of Nebraska" ? 10 : 6),
                pointHoverRadius: 10
            }
        ];
        caption = "When counting unique individuals across peers, large football rosters still heavily influence the overall totals.";
    } else if (step === 13) {
        // Hide standard chart, show custom animation
        document.getElementById('chart-container').style.display = 'none';
        document.getElementById('chart-container').classList.remove('active');

        let animContainer = document.getElementById('flag-football-anim');
        animContainer.style.display = 'flex';
        // Small delay to allow display:flex to apply before animating opacity/transforms via active class
        setTimeout(() => {
            animContainer.classList.add('active');
        }, 50);

        // Ensure we don't crash chart.js with empty data, though canvas is hidden
        newLabels = [];
        newDatasets = [];
        caption = "Adding a sport like Flag Football brings a significant chunk of new opportunities for women.";
    }

    // Dynamic Chart Options updates based on type
    if (step === 10 || step === 11 || step === 12) {
        // Scatter Plot axes
        currentChart.options.scales = {
            x: {
                display: true,
                type: 'linear',
                position: 'bottom',
                title: { display: true, text: "Men's Count", color: 'white' },
                ticks: { color: '#a1a1aa' },
                grid: { color: 'rgba(255,255,255,0.05)' }
            },
            y: {
                display: true,
                title: { display: true, text: "Women's Count", color: 'white' },
                ticks: { color: '#a1a1aa' },
                grid: { color: 'rgba(255,255,255,0.05)' }
            }
        };

        currentChart.options.plugins.datalabels = {
            display: true,
            color: function (context) {
                return (context.raw && context.raw.institution === "University of Nebraska") ? '#ffffff' : '#888888';
            },
            align: function (context) {
                return (context.raw && context.raw.institution === "University of Nebraska") ? 'top' : 'bottom';
            },
            font: function (context) {
                const isNeb = context.raw && context.raw.institution === "University of Nebraska";
                return {
                    family: "'Inter', sans-serif",
                    size: isNeb ? 14 : 11,
                    weight: isNeb ? 'bold' : '400'
                };
            },
            formatter: function (value, context) {
                if (!context.raw || !context.raw.institution) return '';
                let name = context.raw.institution;
                if (name === "University of Nebraska") return "NEBRASKA";
                return name.replace("University of ", "").replace(" University", "");
            }
        };

        // Define tooltip to show school name
        currentChart.options.plugins.tooltip.callbacks.label = function (context) {
            if (!context.raw) return '';
            const inst = context.raw.institution || 'Unknown';
            return `${inst} (Men: ${context.raw.x}, Women: ${context.raw.y})`;
        };
    } else {
        // Turn off datalabels for non-scatter
        currentChart.options.plugins.datalabels = { display: false };

        // Line/Bar Standard Axes
        currentChart.options.scales = {
            x: {
                display: true,
                type: 'category',
                title: { display: false },
                ticks: { color: '#a1a1aa' },
                grid: { color: 'rgba(255,255,255,0.05)' }
            },
            y: {
                display: true,
                title: { display: false },
                ticks: { color: '#a1a1aa' },
                grid: { color: 'rgba(255,255,255,0.05)' }
            }
        };

        currentChart.options.plugins.tooltip.callbacks.label = function (context) {
            return `${context.dataset.label}: ${context.raw}`;
        };
    }

    currentChart.config.type = (step >= 10 && step <= 12 ? 'scatter' : (step === 1 || step === 2 || step === 4 || step === 7 || step === 9 ? 'line' : 'bar'));
    currentChart.data.labels = newLabels;
    currentChart.data.datasets = newDatasets;
    currentChart.update();
    document.getElementById('additional-info').innerText = caption;
}

// Setup Scrollama
const scroller = scrollama();

scroller
    .setup({
        step: '.step',
        offset: 0.5,
        debug: false
    })
    .onStepEnter(response => {
        // response = { element, index, direction }

        // Remove is-active from all steps
        document.querySelectorAll('.step').forEach(el => el.classList.remove('is-active'));

        // Add to current
        response.element.classList.add('is-active');

        const stepIndex = parseInt(response.element.getAttribute('data-step'));

        const scrollyContainer = document.getElementById('scrolly');
        if (stepIndex % 2 === 0) {
            scrollyContainer.classList.add('alternate');
        } else {
            scrollyContainer.classList.remove('alternate');
        }

        updateChart(stepIndex);
    });

// Handle resize
window.addEventListener("resize", scroller.resize);

// Progress Bar
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Don't error out if height is 0
    if (height > 0) {
        const scrolled = (winScroll / height) * 100;
        document.getElementById('progress-bar').style.width = scrolled + '%';
    }
});


