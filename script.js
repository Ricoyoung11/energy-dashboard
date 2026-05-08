const initYearlyData = () => {
        let years = {};
        for(let i=2024; i<=2035; i++) years[i] = new Array(12).fill(0);
        return years;
    };
    
    const metricsData = {
        propaneUsage: { label: 'Propane Usage (gallons)', historical: [277.035735735736, 234.92752688172, 199.192481203008, 192.766917293233, 42.4861271676301, 41.1156069364162, 21.243063583815, 21.243063583815, 47.5339939443986, 79.1428210678211, 76.5898268398268, 277.035735735736
], yearly: initYearlyData() },
        propaneCost: { label: 'Total Propane Cost ($)', historical: [589.748468468468, 526.855075268817, 461.044197994987, 446.171804511278, 83.5315606936416, 80.8369942196532, 41.7657803468208, 41.7657803468208, 100.273259014588, 167.153632756133, 161.76158008658, 589.748468468468
], yearly: initYearlyData() },
        solarMade: { label: 'Solar Made (kWh)', historical: [524.5, 497.5, 1190, 1650, 1540, 1750, 2070, 1760, 1810, 1560, 836, 446
], yearly: initYearlyData() },
        elecPurchased: { label: 'Electric Purchased (kWh)', historical: [1166, 1074.5, 791, 729.5, 677, 789, 1020, 848.5, 778, 762, 884, 1473.5
], yearly: initYearlyData() },
        solarUsed: { label: 'Solar Used While Making (kWh)', historical: [275.5, 306, 491, 554, 567, 733, 922, 723, 701.5, 482.5, 335, 252.5
], yearly: initYearlyData() },
        solarSold: { label: 'Solar Sold (kWh)', historical: [249, 191.5, 699, 1096, 973, 1017, 1148, 1037, 1108.5, 1077.5, 501, 193.5
], yearly: initYearlyData() },
        elecBill: { label: 'Electric Bill ($)', historical: [232.31, 214.315, 51.955, -33.225, -17.24, -5.88, 11.85, 2.05, -34.235, -20.61, 114.535, 314.21
], yearly: initYearlyData() },
        offset: { label: 'Solar Offset %', historical: [37, 36, 93, 128, 124, 115, 53, 112, 122, 125, 69, 26], yearly: initYearlyData() },
        kwhPaid: { label: 'kWh paid for', historical: [917, 883, 92, -366.5, -296, -228, -128, -188.5, -330.5, -315.5, 383, 1280
], yearly: initYearlyData() },
        totalPower: { label: 'Total Power Used (kWh)', historical: [1441.5, 1380.5, 1282, 1283.5, 1244, 1522, 1942, 1571.5, 1479.5, 1244.5, 1219, 1726
], yearly: initYearlyData() }
    };const supabaseUrl = 'https://graihkrrpfgiszjgzghf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyYWloa3JycGZnaXN6amd6Z2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTA4MzIsImV4cCI6MjA5MzgyNjgzMn0.ekurA5jTtAm3AfH9a9EfrUnapslcuISLsM8z2r4Zh7w';
const supabase = supabasejs.createClient(supabaseUrl, supabaseKey);

const metricsData = {
    solarMade: { label: 'Solar Made (kWh)', historical: new Array(12).fill(0), yearly: {} },
    elecPurchased: { label: 'Electric Purchased (kWh)', historical: new Array(12).fill(0), yearly: {} },
    solarUsed: { label: 'Solar Used While Making (kWh)', historical: new Array(12).fill(0), yearly: {} },
    solarSold: { label: 'Solar Sold (kWh)', historical: new Array(12).fill(0), yearly: {} },
    elecBill: { label: 'Electric Bill ($)', historical: new Array(12).fill(0), yearly: {} },
    kwhPaid: { label: 'kWh paid for', historical: new Array(12).fill(0), yearly: {} },
    propaneUsage: { label: 'Propane Usage (gallons)', historical: new Array(12).fill(0), yearly: {} },
    propaneCost: { label: 'Total Propane Cost ($)', historical: new Array(12).fill(0), yearly: {} },
    totalPower: { label: 'Total Power Used (kWh)', historical: new Array(12).fill(0), yearly: {} }
};

const seedData = {
    2024: {
        solarMade: [0, 0, 0, 0, 0, 0, 0, 1620, 1820, 1520, 921, 415],
        elecPurchased: [0, 0, 0, 0, 0, 0, 0, 869, 756, 780, 836, 1377],
        solarUsed: [0, 0, 0, 0, 0, 0, 0, 724, 703, 446, 318, 214],
        solarSold: [0, 0, 0, 0, 0, 0, 0, 896, 1117, 1074, 603, 201],
        kwhPaid: [0, 0, 0, 0, 0, 0, 0, -27, -361, -294, 233, 1176],
        elecBill: [0, 0, 0, 0, 0, 0, 0, 29.73, -22.84, -14.22, 78.52, 281.72],
        propaneUsage: [0, 0, 0, 0, 0, 0, 0, 0, 53.95, 55.75, 53.95, 296.43],
        totalPower: [0, 0, 0, 0, 0, 0, 0, 1593, 1459, 1226, 1154, 1591],
        propaneCost: [0, 0, 0, 0, 0, 0, 0, 0, 119.71, 123.70, 119.71, 648.26]
    },
    2025: {
        solarMade: [713, 495, 1330, 1430, 1540, 1750, 2070, 1900, 1800, 1600, 751, 477],
        elecPurchased: [1064, 1073, 732, 734, 677, 789, 1020, 828, 800, 744, 932, 1570],
        solarUsed: [338, 299, 507, 466, 567, 733, 922, 722, 700, 519, 352, 291],
        solarSold: [375, 196, 823, 964, 973, 1017, 1148, 1178, 1100, 1081, 399, 186],
        kwhPaid: [689, 877, -91, -230, -296, -228, -128, -350, -300, -337, 533, 1384],
        elecBill: [176.32, 201.05, 14.28, -6.79, -17.24, -5.88, 11.85, -25.63, -45.63, -27, 150.55, 346.7],
        propaneUsage: [296.43, 249.11, 169.39, 163.93, 42.49, 41.12, 42.49, 42.49, 41.12, 102.53, 99.23, 257.64],
        totalPower: [1402, 1372, 1239, 1200, 1244, 1522, 1942, 1550, 1500, 1263, 1284, 1861],
        propaneCost: [648.26, 595.21, 408.10, 394.94, 83.53, 80.84, 83.53, 83.53, 80.84, 210.61, 203.81, 531.24]
    }
};

let currentMetric = 'solarMade';
let currentChartYear1 = '2025';
let currentChartYear2 = 'historical';

const ctx = document.getElementById('energyChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Current Year',
            data: [],
            backgroundColor: '#2563eb',
            order: 2
        }, {
            label: 'Comparison',
            data: [],
            type: 'line',
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            borderWidth: 2,
            pointBackgroundColor: '#94a3b8',
            pointRadius: 4,
            order: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' }
            },
            x: { grid: { display: false } }
        },
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                titleFont: { size: 14, weight: '600' }
            }
        }
    }
});

function calculateHistoricalAverages() {
    for (const metric in metricsData) {
        const years = Object.keys(metricsData[metric].yearly);
        for (let m = 0; m < 12; m++) {
            let sum = 0;
            let count = 0;
            years.forEach(year => {
                const val = metricsData[metric].yearly[year][m];
                if (val !== 0) {
                    sum += val;
                    count++;
                }
            });
            metricsData[metric].historical[m] = count > 0 ? sum / count : 0;
        }
    }
}

async function fetchDataFromSupabase() {
    const { data, error } = await supabase.from('energy_metrics').select('*');
    
    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('Database empty, seeding...');
        for (const year in seedData) {
            for (let m = 0; m < 12; m++) {
                const monthData = { year: parseInt(year), month: m };
                for (const metric in seedData[year]) {
                    monthData[metric] = seedData[year][metric][m];
                }
                await supabase.from('energy_metrics').upsert(monthData, { onConflict: 'year, month' });
            }
        }
        return fetchDataFromSupabase();
    }

    for (const metric in metricsData) metricsData[metric].yearly = {};

    data.forEach(row => {
        const { year, month, ...metrics } = row;
        for (const metric in metrics) {
            if (metricsData[metric]) {
                if (!metricsData[metric].yearly[year]) metricsData[metric].yearly[year] = new Array(12).fill(0);
                metricsData[metric].yearly[year][month] = metrics[metric];
            }
        }
    });

    calculateHistoricalAverages();
    updateCharts();
}

async function logMonthlyData(formData) {
    const { error } = await supabase.from('energy_metrics').upsert(formData, { onConflict: 'year, month' });
    if (error) console.error('Error:', error);
    else await fetchDataFromSupabase();
}

function updateCharts() {
    const metric = metricsData[currentMetric];
    chart.data.datasets[0].label = `${metric.label} (${currentChartYear1})`;
    chart.data.datasets[0].data = metric.yearly[currentChartYear1] || new Array(12).fill(0);

    if (currentChartYear2 === 'historical') {
        chart.data.datasets[1].label = 'Historical Average';
        chart.data.datasets[1].data = metric.historical;
    } else {
        chart.data.datasets[1].label = `${metric.label} (${currentChartYear2})`;
        chart.data.datasets[1].data = metric.yearly[currentChartYear2] || new Array(12).fill(0);
    }
    chart.update();
}

function showMetric(metric) {
    currentMetric = metric;
    document.querySelectorAll('.metric-card').forEach(card => card.classList.remove('active'));
    // Note: event.currentTarget might be tricky if not called from event listener directly
    // but assuming standard dashboard structure.
    updateCharts();
}

function changeYear1(year) {
    currentChartYear1 = year;
    updateCharts();
}

function changeYear2(year) {
    currentChartYear2 = year;
    updateCharts();
}

fetchDataFromSupabase();
    
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
                backgroundColor: '#2563eb',
                order: 2
            }, {
                label: 'Historical Avg',
                data: metricsData[currentMetric].historical,
                type: 'line',
                borderColor: '#94a3b8',
                borderDash: [5, 5],
                borderWidth: 2,
                pointBackgroundColor: '#94a3b8',
                pointRadius: 4,
                order: 1
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
        chart.data.datasets[0].order = 2;
        
        if (currentChartYear2 === 'historical') {
            chart.data.datasets[1].data = metricsData[currentMetric].historical;
            chart.data.datasets[1].label = 'Historical Avg';
            chart.data.datasets[1].borderColor = '#94a3b8';
            chart.data.datasets[1].pointBackgroundColor = '#94a3b8';
            chart.data.datasets[1].borderDash = [5, 5];
            chart.data.datasets[1].type = 'line';
            chart.data.datasets[1].order = 1;
        } else {
            chart.data.datasets[1].data = metricsData[currentMetric].yearly[currentChartYear2];
            chart.data.datasets[1].label = `${currentChartYear2} Data`;
            chart.data.datasets[1].borderColor = '#f59e0b';
            chart.data.datasets[1].pointBackgroundColor = '#f59e0b';
            chart.data.datasets[1].borderDash = [];
            chart.data.datasets[1].type = 'line';
            chart.data.datasets[1].order = 1;
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
    
