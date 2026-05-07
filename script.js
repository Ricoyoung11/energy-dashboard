// The complete data structure for all 10 metrics
const metricsData = {
    propaneUsage: { label: 'Propane Usage (gallons)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], current: new Array(12).fill(0) },
    propaneCost: { label: 'Total Propane Cost ($)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], current: new Array(12).fill(0) },
    solarMade: { label: 'Solar Made (kWh)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], current: new Array(12).fill(0) },
    elecPurchased: { label: 'Electric Purchased (kWh)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], current: new Array(12).fill(0) },
    solarUsed: { label: 'Solar Used While Making (kWh)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], current: new Array(12).fill(0) },
    solarSold: { label: 'Solar Sold (kWh)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], current: new Array(12).fill(0) },
    elecBill: { label: 'Electric Bill ($)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], current: new Array(12).fill(0) },
    // I left the existing offset numbers you provided earlier
    offset: { label: 'Solar Offset %', historical: [37, 36, 93, 128, 124, 115, 53, 112, 122, 125, 69, 26], current: new Array(12).fill(0) },
    kwhPaid: { label: 'kWh paid for', historical: [0,0,0,0,0,0,0,0,0,0,0,0], current: new Array(12).fill(0) },
    totalPower: { label: 'Total Power Used (kWh)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], current: new Array(12).fill(0) }
};

let currentMetric = 'offset';

// Initialize the Chart
const ctx = document.getElementById('energyChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: '2026 Data',
            data: metricsData[currentMetric].current,
            backgroundColor: '#2563eb'
        }, {
            label: 'Historical Avg',
            data: metricsData[currentMetric].historical,
            type: 'line',
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
    }
});

// Dropdown change handler
function changeChartMetric() {
    currentMetric = document.getElementById('metricDropdown').value;
    chart.data.datasets[0].data = metricsData[currentMetric].current;
    chart.data.datasets[1].data = metricsData[currentMetric].historical;
    
    // Dynamic coloring based on metric type (red for cost/bills, blue/green for energy)
    if(currentMetric.includes('Cost') || currentMetric.includes('Bill')) {
        chart.data.datasets[0].backgroundColor = '#ef4444'; // Red
    } else if(currentMetric.includes('Made') || currentMetric.includes('Sold') || currentMetric === 'offset') {
        chart.data.datasets[0].backgroundColor = '#10b981'; // Green
    } else {
        chart.data.datasets[0].backgroundColor = '#2563eb'; // Blue
    }
    
    chart.update();
}

// Master Data Logging Function
function logMonthlyData() {
    const m = parseInt(document.getElementById('monthSelect').value);
    
    // Grab all raw inputs
    const sMade = parseFloat(document.getElementById('in_solarMade').value) || 0;
    const ePurchased = parseFloat(document.getElementById('in_elecPurchased').value) || 0;
    const sUsed = parseFloat(document.getElementById('in_solarUsed').value) || 0;
    const sSold = parseFloat(document.getElementById('in_solarSold').value) || 0;
    const kPaid = parseFloat(document.getElementById('in_kwhPaid').value) || 0;
    const eBill = parseFloat(document.getElementById('in_elecBill').value) || 0;
    const pUsage = parseFloat(document.getElementById('in_propaneUsage').value) || 0;
    const pCost = parseFloat(document.getElementById('in_propaneCost').value) || 0;

    // Engine Calculations
    // Total Power Used = Grid imported + Solar consumed directly
    const tPower = ePurchased + sUsed; 
    const calculatedOffset = tPower > 0 ? ((sMade / tPower) * 100).toFixed(1) : 0;

    // Route data to correct metric arrays
    metricsData.solarMade.current[m] = sMade;
    metricsData.elecPurchased.current[m] = ePurchased;
    metricsData.solarUsed.current[m] = sUsed;
    metricsData.solarSold.current[m] = sSold;
    metricsData.kwhPaid.current[m] = kPaid;
    metricsData.elecBill.current[m] = eBill;
    metricsData.propaneUsage.current[m] = pUsage;
    metricsData.propaneCost.current[m] = pCost;
    
    // Route calculated metrics
    metricsData.totalPower.current[m] = tPower;
    metricsData.offset.current[m] = calculatedOffset;

    // Update Offset Display UI
    const display = document.getElementById('offsetText');
    display.innerText = calculatedOffset + '%';
    display.style.color = calculatedOffset >= 100 ? '#16a34a' : '#2563eb';

    // Refresh chart if the current month was modified
    chart.update();
    
    // Optional: clear the form or show a success message
    alert("Data logged for month " + (m + 1));
}

// Propane Predictor Function
function calculatePropane() {
    const tankCapacity = 500; 
    const fillThreshold = 20; 
    
    const currentPct = parseFloat(document.getElementById('propanePct').value) || 0;
    const dailyBurn = parseFloat(document.getElementById('dailyBurn').value) || 0;

    const totalGallonsRemaining = (currentPct / 100) * tankCapacity;
    const unusableGallons = (fillThreshold / 100) * tankCapacity;
    const usableGallons = Math.max(0, totalGallonsRemaining - unusableGallons);

    const daysRemaining = dailyBurn > 0 ? Math.floor(usableGallons / dailyBurn) : 0;

    document.getElementById('gallonsLeft').innerText = Math.round(totalGallonsRemaining);
    const daysDisplay = document.getElementById('daysLeft');
    daysDisplay.innerText = daysRemaining;
    daysDisplay.style.color = daysRemaining <= 14 ? '#dc2626' : '#ea580c';
}
