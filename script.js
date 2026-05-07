const initYearlyData = () => {
        let years = {};
        for(let i=2024; i<=2035; i++) years[i] = new Array(12).fill(0);
        return years;
    };
    
    const metricsData = {
        propaneUsage: { label: 'Propane Usage (gallons)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], yearly: initYearlyData() },
        propaneCost: { label: 'Total Propane Cost ($)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], yearly: initYearlyData() },
        solarMade: { label: 'Solar Made (kWh)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], yearly: initYearlyData() },
        elecPurchased: { label: 'Electric Purchased (kWh)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], yearly: initYearlyData() },
        solarUsed: { label: 'Solar Used While Making (kWh)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], yearly: initYearlyData() },
        solarSold: { label: 'Solar Sold (kWh)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], yearly: initYearlyData() },
        elecBill: { label: 'Electric Bill ($)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], yearly: initYearlyData() },
        offset: { label: 'Solar Offset %', historical: [37, 36, 93, 128, 124, 115, 53, 112, 122, 125, 69, 26], yearly: initYearlyData() },
        kwhPaid: { label: 'kWh paid for', historical: [0,0,0,0,0,0,0,0,0,0,0,0], yearly: initYearlyData() },
        totalPower: { label: 'Total Power Used (kWh)', historical: [0,0,0,0,0,0,0,0,0,0,0,0], yearly: initYearlyData() }
    };
    
    let currentMetric = 'offset';
    let currentChartYear1 = '2026';
    let currentChartYear2 = 'historical';
    
    const ctx = document.getElementById('energyChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: '2026 Data',
                data: metricsData[currentMetric].yearly['2026'],
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
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
    
    function changeChartMetric() {
        currentMetric = document.getElementById('metricDropdown').value;
        currentChartYear1 = document.getElementById('chartYear1Dropdown').value;
        currentChartYear2 = document.getElementById('chartYear2Dropdown').value;
        
        chart.data.datasets[0].data = metricsData[currentMetric].yearly[currentChartYear1];
        chart.data.datasets[0].label = `${currentChartYear1} Data`;
        
        if (currentChartYear2 === 'historical') {
            chart.data.datasets[1].data = metricsData[currentMetric].historical;
            chart.data.datasets[1].label = 'Historical Avg';
            chart.data.datasets[1].borderColor = '#94a3b8';
            chart.data.datasets[1].borderDash = [5, 5];
            chart.data.datasets[1].type = 'line';
        } else {
            chart.data.datasets[1].data = metricsData[currentMetric].yearly[currentChartYear2];
            chart.data.datasets[1].label = `${currentChartYear2} Data`;
            chart.data.datasets[1].borderColor = '#f59e0b';
            chart.data.datasets[1].borderDash = [];
            chart.data.datasets[1].type = 'line';
        }
        
        if(currentMetric.includes('Cost') || currentMetric.includes('Bill')) {
            chart.data.datasets[0].backgroundColor = '#ef4444';
        } else if(currentMetric.includes('Made') || currentMetric.includes('Sold') || currentMetric === 'offset') {
            chart.data.datasets[0].backgroundColor = '#10b981';
        } else {
            chart.data.datasets[0].backgroundColor = '#2563eb';
        }
        chart.update();
    }
    
    function logMonthlyData() {
        const y = document.getElementById('yearSelect').value;
        const m = parseInt(document.getElementById('monthSelect').value);
        
        const sMade = parseFloat(document.getElementById('in_solarMade').value) || 0;
        const ePurchased = parseFloat(document.getElementById('in_elecPurchased').value) || 0;
        const sUsed = parseFloat(document.getElementById('in_solarUsed').value) || 0;
        const sSold = parseFloat(document.getElementById('in_solarSold').value) || 0;
        const kPaid = parseFloat(document.getElementById('in_kwhPaid').value) || 0;
        const eBill = parseFloat(document.getElementById('in_elecBill').value) || 0;
        const pUsage = parseFloat(document.getElementById('in_propaneUsage').value) || 0;
        const pCost = parseFloat(document.getElementById('in_propaneCost').value) || 0;
    
        const tPower = ePurchased + sUsed; 
        const calculatedOffset = tPower > 0 ? ((sMade / tPower) * 100).toFixed(1) : 0;
    
        metricsData.solarMade.yearly[y][m] = sMade;
        metricsData.elecPurchased.yearly[y][m] = ePurchased;
        metricsData.solarUsed.yearly[y][m] = sUsed;
        metricsData.solarSold.yearly[y][m] = sSold;
        metricsData.kwhPaid.yearly[y][m] = kPaid;
        metricsData.elecBill.yearly[y][m] = eBill;
        metricsData.propaneUsage.yearly[y][m] = pUsage;
        metricsData.propaneCost.yearly[y][m] = pCost;
        metricsData.totalPower.yearly[y][m] = tPower;
        metricsData.offset.yearly[y][m] = calculatedOffset;
    
        const display = document.getElementById('offsetText');
        display.innerText = calculatedOffset + '%';
        display.style.color = calculatedOffset >= 100 ? '#16a34a' : '#2563eb';
    
        if (y === document.getElementById('chartYear1Dropdown').value || y === document.getElementById('chartYear2Dropdown').value) {
            chart.update();
        }
        
        alert(`Data logged for ${y} Month ${m + 1}`);
    }
    
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
