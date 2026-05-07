const historicalAverages = [37, 36, 93, 128, 124, 115, 53, 112, 122, 125, 69, 26];
    
    const ctx = document.getElementById('energyChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: '2026 Offset %',
                data: new Array(12).fill(0),
                backgroundColor: '#2563eb'
            }, {
                label: 'Historical Avg %',
                data: historicalAverages,
                type: 'line',
                borderColor: '#94a3b8',
                borderDash: [5, 5]
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Percentage (%)' } } }
        }
    });
    
    function calculate() {
        const month = document.getElementById('monthSelect').value;
        const gen = parseFloat(document.getElementById('genInput').value) || 0;
        const cons = parseFloat(document.getElementById('consInput').value) || 0;
    
        const offset = cons > 0 ? ((gen / cons) * 100).toFixed(1) : 0;
    
        const display = document.getElementById('offsetText');
        display.innerText = offset + '%';
        display.style.color = offset >= 100 ? '#16a34a' : '#2563eb';
    
        chart.data.datasets[0].data[month] = offset;
        chart.update();
    }
function calculatePropane() {
    const tankCapacity = 500; // Total tank volume in gallons
    const fillThreshold = 20; // The percentage at which the propane company requires a refill
    
    const currentPct = parseFloat(document.getElementById('propanePct').value) || 0;
    const dailyBurn = parseFloat(document.getElementById('dailyBurn').value) || 0;

    // Calculate usable gallons (leaving 20% in the tank per standard delivery rules)
    const totalGallonsRemaining = (currentPct / 100) * tankCapacity;
    const unusableGallons = (fillThreshold / 100) * tankCapacity;
    const usableGallons = Math.max(0, totalGallonsRemaining - unusableGallons);

    // Calculate days remaining based on burn rate
    const daysRemaining = dailyBurn > 0 ? Math.floor(usableGallons / dailyBurn) : 0;

    // Update UI
    document.getElementById('gallonsLeft').innerText = Math.round(totalGallonsRemaining);
    
    const daysDisplay = document.getElementById('daysLeft');
    daysDisplay.innerText = daysRemaining;
    
    // Turn the days remaining red if you have less than 14 days of fuel left
    daysDisplay.style.color = daysRemaining <= 14 ? '#dc2626' : '#ea580c';
}
