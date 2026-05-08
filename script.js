// Supabase configuration
const supabaseUrl = 'https://graihkrrpfgiszjgzghf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyYWloa3JycGZnaXN6amd6Z2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTA4MzIsImV4cCI6MjA5MzgyNjgzMn0.ekurA5jTtAm3AfH9a9EfrUnapslcuISLsM8z2r4Zh7w';

// Initialize Supabase client
// Use a different name (supabaseClient) to avoid naming conflicts with the global 'supabase' library
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const metricsData = {
    solar_made: { label: 'Solar Made (kWh)', historical: new Array(12).fill(0), yearly: {} },
    elec_purchased: { label: 'Grid Purchased (kWh)', historical: new Array(12).fill(0), yearly: {} },
    solar_used: { label: 'Solar Used (kWh)', historical: new Array(12).fill(0), yearly: {} },
    solar_sold: { label: 'Solar Sold (kWh)', historical: new Array(12).fill(0), yearly: {} },
    kwh_paid: { label: 'kWh Paid (kWh)', historical: new Array(12).fill(0), yearly: {} },
    total_power: { label: 'Total Power (kWh)', historical: new Array(12).fill(0), yearly: {} }
};

const seedData = {
    "2024": {
        solar_made: [0, 0, 0, 0, 0, 0, 0, 1620, 1820, 1520, 921, 415],
        elec_purchased: [0, 0, 0, 0, 0, 0, 0, 869, 756, 780, 836, 1377],
        solar_used: [0, 0, 0, 0, 0, 0, 0, 724, 703, 446, 318, 214],
        solar_sold: [0, 0, 0, 0, 0, 0, 0, 896, 1117, 1074, 603, 201],
        kwh_paid: [0, 0, 0, 0, 0, 0, 0, -27, -361, -294, 233, 1176],
        total_power: [0, 0, 0, 0, 0, 0, 0, 1593, 1459, 1226, 1154, 1591]
    },
    "2025": {
        solar_made: [713, 495, 1330, 1430, 1540, 1750, 2070, 1900, 1800, 1600, 751, 477],
        elec_purchased: [1064, 1073, 732, 734, 677, 789, 1020, 828, 800, 744, 932, 1570],
        solar_used: [338, 299, 507, 466, 567, 733, 922, 722, 700, 519, 352, 291],
        solar_sold: [375, 196, 823, 964, 973, 1017, 1148, 1178, 1100, 1081, 399, 186],
        kwh_paid: [689, 877, -91, -230, -296, -228, -128, -350, -300, -337, 533, 1384],
        total_power: [1402, 1372, 1239, 1200, 1244, 1522, 1942, 1550, 1500, 1263, 1284, 1861]
    }
};

let currentMetric = 'solar_made';
let currentChartYear1 = '2025';
let currentChartYear2 = 'historical';

const ctx = document.getElementById('energyChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Current Selection',
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
            y: { beginAtZero: true },
            x: { grid: { display: false } }
        },
        plugins: {
            legend: { position: 'top' }
        }
    }
});

function calculateHistoricalAverages() {
    for (const metric in metricsData) {
        const years = Object.keys(metricsData[metric].yearly);
        for (let m = 0; m < 12; m++) {
            let sum = 0, count = 0;
            years.forEach(year => {
                const val = metricsData[metric].yearly[year][m];
                if (val !== undefined && val !== 0) { sum += val; count++; }
            });
            metricsData[metric].historical[m] = count > 0 ? sum / count : 0;
        }
    }
}

async function fetchDataFromSupabase() {
    const { data, error } = await supabaseClient.from('energy_metrics').select('*');
    if (error) { console.error('Error fetching:', error); return; }

    if (!data || data.length === 0) {
        for (const year in seedData) {
            for (let m = 0; m < 12; m++) {
                const monthData = { year: parseInt(year), month: m };
                for (const metric in seedData[year]) { monthData[metric] = seedData[year][metric][m]; }
                await supabaseClient.from('energy_metrics').upsert(monthData, { onConflict: 'year, month' });
            }
        }
        return fetchDataFromSupabase();
    }

    for (const metric in metricsData) metricsData[metric].yearly = {};

    data.forEach(row => {
        const { year, month } = row;
        for (const metric in metricsData) {
            if (row[metric] !== undefined) {
                if (!metricsData[metric].yearly[year]) metricsData[metric].yearly[year] = new Array(12).fill(0);
                metricsData[metric].yearly[year][month] = row[metric];
            }
        }
    });

    calculateHistoricalAverages();
    updateYearDropdowns();
    updateCharts();
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
    document.querySelector(`[onclick*="${metric}"]`)?.classList.add('active');
    updateCharts();
}

function changeYear1(year) { currentChartYear1 = year; updateCharts(); }
function changeYear2(year) { currentChartYear2 = year; updateCharts(); }


async function logMonthlyData() {
    const year = parseInt(document.getElementById('inputYear').value);
    const month = parseInt(document.getElementById('inputMonth').value) - 1; 
    if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
        alert('Please enter a valid Year and Month (1-12).');
        return;
    }

    const dataToLog = {
        year: year,
        month: month,
        solar_made: parseFloat(document.getElementById('inputSolarMade').value) || 0,
        elec_purchased: parseFloat(document.getElementById('inputGridPurchased').value) || 0,
        solar_used: parseFloat(document.getElementById('inputSolarUsed').value) || 0,
        solar_sold: parseFloat(document.getElementById('inputSolarSold').value) || 0,
        kwh_paid: parseFloat(document.getElementById('inputKwhPaid').value) || 0,
        elec_bill: parseFloat(document.getElementById('inputElecBill').value) || 0,
        propane_usage: parseFloat(document.getElementById('inputPropaneUsage').value) || 0,
        propane_cost: parseFloat(document.getElementById('inputPropaneCost').value) || 0,
        total_power: parseFloat(document.getElementById('inputTotalPower').value) || 0
    };

    const { error } = await supabaseClient.from('energy_metrics').upsert(dataToLog, { onConflict: 'year, month' });
    if (error) {
        console.error('Error saving data:', error);
        alert('Error saving data.');
    } else {
        alert('Data logged successfully!');
        fetchDataFromSupabase(); // refresh the data and charts
        
        // Clear inputs
        document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
    }
}
fetchDataFromSupabase();
function updateYearDropdowns() {
    const years = new Set();
    for (const metric in metricsData) {
        Object.keys(metricsData[metric].yearly).forEach(y => years.add(y));
    }
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    const select1 = document.getElementById('yearSelect1');
    const select2 = document.getElementById('yearSelect2');
    
    const val1 = select1.value;
    const val2 = select2.value;
    
    select1.innerHTML = sortedYears.map(y => `<option value="${y}">${y}</option>`).join('');
    select2.innerHTML = `<option value="historical">Historical Avg</option>` + sortedYears.map(y => `<option value="${y}">${y}</option>`).join('');
    
    if (sortedYears.includes(val1)) select1.value = val1;
    else if (sortedYears.length > 0) { select1.value = sortedYears[0]; currentChartYear1 = sortedYears[0]; }
    
    if (val2 === 'historical' || sortedYears.includes(val2)) select2.value = val2;
    else if (sortedYears.length > 0) { select2.value = 'historical'; currentChartYear2 = 'historical'; }
}
