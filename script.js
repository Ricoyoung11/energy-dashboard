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
    document.querySelector(`[onclick="showMetric('${metric}')"]`).classList.add('active');
    updateCharts();
}

async function logMonthlyData() {
    const year = parseInt(document.getElementById('inputYear').value);
    const month = parseInt(document.getElementById('inputMonth').value) - 1;

    const dataToLog = {
        year: year,
        month: month,
        solar_made: parseFloat(document.getElementById('inputSolarMade').value) || 0,
        elec_purchased: parseFloat(document.getElementById('inputGridPurchased').value) || 0,
        solar_used: parseFloat(document.getElementById('inputSolarUsed').value) || 0,
        solar_sold: parseFloat(document.getElementById('inputSolarSold').value) || 0,
        kwh_paid: parseFloat(document.getElementById('inputKwhPaid').value) || 0,
        total_power: parseFloat(document.getElementById('inputTotalPower').value) || 0,
        // New Fields below
        elec_bill: parseFloat(document.getElementById('inputElecBill').value) || 0,
        propane_usage: parseFloat(document.getElementById('inputPropaneUsage').value) || 0,
        propane_cost: parseFloat(document.getElementById('inputPropaneCost').value) || 0
    };

    const { data, error } = await supabaseClient.from('energy_metrics').upsert(dataToLog, { onConflict: 'year, month' });

    if (error) {
        console.error('Error logging data:', error);
        alert('Error logging data: ' + error.message);
    } else {
        alert('Data logged successfully!');
        fetchDataFromSupabase();
    }
} // This closes the logMonthlyData function properly

function changeYear1(year) {
    currentChartYear1 = year;
    updateCharts();
}

function changeYear2(year) {
    currentChartYear2 = year;
    updateCharts();
}

function updateYearDropdowns() {
    const years = new Set();
    for (const metric in metricsData) {
        if (metricsData[metric].yearly) {
            Object.keys(metricsData[metric].yearly).forEach(y => years.add(y));
        }
    }
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    const select1 = document.getElementById('yearSelect1');
    const select2 = document.getElementById('yearSelect2');
    
    if (!select1 || !select2) return;

    const options = sortedYears.map(y => `<option value="${y}">${y}</option>`).join('');
    select1.innerHTML = options;
    select2.innerHTML = `<option value="">None</option>` + options;

    if (sortedYears.includes(currentChartYear1)) select1.value = currentChartYear1;
    if (currentChartYear2 && sortedYears.includes(currentChartYear2)) select2.value = currentChartYear2;
}
