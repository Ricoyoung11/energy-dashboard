const metricsData = {
  solar_made: { label: 'Solar Made (kWh)', historical: new Array(12).fill(0), yearly: {} },
  elec_purchased: { label: 'Grid Purchased (kWh)', historical: new Array(12).fill(0), yearly: {} },
  solar_used: { label: 'Solar Used (kWh)', historical: new Array(12).fill(0), yearly: {} },
  solar_sold: { label: 'Solar Sold (kWh)', historical: new Array(12).fill(0), yearly: {} },
  kwh_paid: { label: 'kWh Paid (kWh)', historical: new Array(12).fill(0), yearly: {} },
  total_power: { label: 'Total Power (kWh)', historical: new Array(12).fill(0), yearly: {} },
  elec_bill: { label: 'Electric Bill ($)', historical: new Array(12).fill(0), yearly: {} },
  propane_usage: { label: 'Propane Usage (Gals)', historical: new Array(12).fill(0), yearly: {} },
  propane_cost: { label: 'Propane Cost ($)', historical: new Array(12).fill(0), yearly: {} }
};

let currentMetric = 'solar_made';
let currentChartYear1 = new Date().getFullYear();
let currentChartYear2 = 'historical';
let chart;

const supabaseUrl = 'https://graihkrrpfgiszjgzghf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyYWloa3JycGZnaXN6amd6Z2hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNTA4MzIsImV4cCI6MjA5MzgyNjgzMn0.ekurA5jTtAm3AfH9a9EfrUnapslcuISLsM8z2r4Zh7w'; 
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

function initChart() {
    const ctx = document.getElementById('energyChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                { label: 'Year 1', data: [], borderColor: '#3b82f6', tension: 0.1, fill: false },
                { label: 'Comparison', data: [], borderColor: '#94a3b8', borderDash: [5, 5], tension: 0.1, fill: false }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// --- 2. Fetch Data ---
async function fetchDataFromSupabase() {
    const { data, error } = await supabaseClient.from('energy_metrics').select('*');
    if (error) { console.error('Error fetching:', error); return; }

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

function calculateHistoricalAverages() {
    for (const metric in metricsData) {
        const years = Object.keys(metricsData[metric].yearly);
        if (years.length === 0) continue;
        
        const historical = new Array(12).fill(0);
        
        for (let m = 0; m < 12; m++) {
            let sum = 0;
            let count = 0;
            
            years.forEach(y => {
                const val = metricsData[metric].yearly[y][m];
                // Only include values that are NOT zero
                if (val > 0) {
                    sum += val;
                    count++;
                }
            });
            
            // Avoid dividing by zero if no years have data for this month
            historical[m] = count > 0 ? sum / count : 0;
        }
        metricsData[metric].historical = historical;
    }
}

function updateCharts() {
    if (!chart) return;
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
    document.querySelectorAll('.metric-btn').forEach(btn => btn.classList.remove('active'));
    updateCharts();
}

// --- 3. Log Data (Corrected IDs) ---
async function logMonthlyData() {
    // These IDs now match your HTML exactly
    const year = parseInt(document.getElementById('year').value);
    const month = parseInt(document.getElementById('month').value) - 1;

    const dataToLog = {
        year, month,
        solar_made: parseFloat(document.getElementById('solar_made_input').value) || 0,
        elec_purchased: parseFloat(document.getElementById('grid_purchased_input').value) || 0,
        solar_used: parseFloat(document.getElementById('solar_used_input').value) || 0,
        solar_sold: parseFloat(document.getElementById('solar_sold_input').value) || 0,
        kwh_paid: parseFloat(document.getElementById('kwh_paid_input').value) || 0,
        elec_bill: parseFloat(document.getElementById('elec_bill_input').value) || 0,
        propane_usage: parseFloat(document.getElementById('propane_usage_input').value) || 0,
        propane_cost: parseFloat(document.getElementById('propane_cost_input').value) || 0,
        total_power: parseFloat(document.getElementById('total_power_input').value) || 0
    };

    const { error } = await supabaseClient.from('energy_metrics').upsert(dataToLog, { onConflict: 'year, month' });

    if (error) {
        alert('Error: ' + error.message);
    } else {
        alert('Saved!');
        fetchDataFromSupabase();
    }
}

function changeYear1(year) { currentChartYear1 = year; updateCharts(); }
function changeYear2(year) { currentChartYear2 = year; updateCharts(); }

function updateYearDropdowns() {
    const years = new Set();
    
    // Safety Check: Always add the current year so the dropdown isn't empty
    years.add(new Date().getFullYear().toString());

    // Gather any years that exist in your database data
    for (const m in metricsData) {
        if (metricsData[m].yearly) {
            Object.keys(metricsData[m].yearly).forEach(y => years.add(y));
        }
    }

    const sortedYears = Array.from(years).sort((a, b) => b - a);
    const s1 = document.getElementById('yearSelect1');
    const s2 = document.getElementById('yearSelect2');

    if (!s1 || !s2) return;

    // Create the HTML options
    const opt = sortedYears.map(y => `<option value="${y}">${y}</option>`).join('');
    s1.innerHTML = opt;
    s2.innerHTML = `<option value="historical">Historical Average</option>` + opt;

    // Set the dropdowns to the currently selected years
    s1.value = currentChartYear1;
    s2.value = currentChartYear2;
}

// --- Start the App ---
initChart();
fetchDataFromSupabase();
