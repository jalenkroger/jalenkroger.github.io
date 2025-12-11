document.addEventListener('DOMContentLoaded', () => {
    let districtData = [];
    const searchInput = document.getElementById('districtSearch');
    const suggestionsBox = document.getElementById('suggestions');
    const resultSection = document.getElementById('resultSection');
    const districtNameDisplay = document.getElementById('districtNameDisplay');
    const ctx = document.getElementById('absenteeChart').getContext('2d');
    let chartInstance = null;

    // Load and Parse CSV
    Papa.parse('district_data.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            districtData = results.data;
            console.log('Data loaded:', districtData.length, 'districts');
        },
        error: function (err) {
            console.error('Error loading CSV:', err);
        }
    });

    // Search Input Event
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            suggestionsBox.classList.remove('show');
            return;
        }

        const matches = districtData.filter(row =>
            row.clean_name && row.clean_name.toLowerCase().includes(query)
        );

        showSuggestions(matches);
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.classList.remove('show');
        }
    });

    function showSuggestions(matches) {
        suggestionsBox.innerHTML = '';
        if (matches.length === 0) {
            suggestionsBox.classList.remove('show');
            return;
        }

        matches.slice(0, 10).forEach(match => { // Limit to 10 suggestions
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = match.clean_name;
            div.addEventListener('click', () => {
                selectDistrict(match);
            });
            suggestionsBox.appendChild(div);
        });

        suggestionsBox.classList.add('show');
    }

    function selectDistrict(district) {
        searchInput.value = district.clean_name;
        suggestionsBox.classList.remove('show');
        displayResult(district);
    }

    function displayResult(district) {
        resultSection.classList.remove('hidden');
        // Small delay to allow display:block to apply before adding opacity class for transition
        setTimeout(() => {
            resultSection.classList.add('visible');
        }, 10);

        districtNameDisplay.textContent = district.clean_name;

        // Prepare Data
        // Headers: clean_name,20242025,20232024,20222023,20212022,20202021,20192020
        // We want chronological order on Chart: 2019-2020 -> 2024-2025

        const rawKeys = ['20192020', '20202021', '20212022', '20222023', '20232024', '20242025'];
        const formatLabel = (key) => `${key.substring(0, 4)}-${key.substring(4)}`;

        const labels = rawKeys.map(formatLabel);
        const dataPoints = rawKeys.map(key => {
            const val = district[key];
            return val === 'NA' || val === '' ? null : parseFloat(val);
        });

        updateChart(labels, dataPoints, district.clean_name);
    }

    function updateChart(labels, data, districtName) {
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Chronic Absenteeism Rate (%)',
                    data: data,
                    borderColor: '#2563eb', // Primary Blue
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#2563eb',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    fill: true,
                    tension: 0.3 // Smooth curves
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 12,
                        titleFont: {
                            family: 'Outfit',
                            size: 14
                        },
                        bodyFont: {
                            family: 'Outfit',
                            size: 14,
                            weight: 'bold'
                        },
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return `Rate: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#e2e8f0',
                            borderDash: [5, 5]
                        },
                        ticks: {
                            font: {
                                family: 'Outfit'
                            },
                            callback: function (value) {
                                return value + '%';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Absentee Rate (%)',
                            font: {
                                family: 'Outfit',
                                weight: 500
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Outfit'
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
});
