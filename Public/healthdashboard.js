var glucoseData = []
var bloodPressureData1 = []
var bloodPressureData2 = []

fetch('/api/v1/dashboard/getLatestVitals', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userId: "671e74cdc48e6c37bb62b10e",
        vital_names: ["Blood Sugar Level", "Systolic Blood Pressure (Upper)", "Diastolic Blood Pressure (Lower)"]
    })
}).then((fetchResponse) => fetchResponse.json().then((response) => {
    var data = response.data

    glucoseData = data["Blood Sugar Level"]
    bloodPressureData1 = data["Systolic Blood Pressure (Upper)"]
    bloodPressureData2 = data["Diastolic Blood Pressure (Lower)"]
    displayCharts()
}));


const glucoseCtx = document.getElementById('glucoseCanvas').getContext('2d');
const bloodPressureCtx = document.getElementById('bloodPressureCanvas').getContext('2d');
const activityCtx = document.getElementById('activityCanvas').getContext('2d');

function displayCharts() {
    new Chart(glucoseCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 18}, (_, i) => i + 1),
            datasets: [{
                label: 'Blood Glucose (mg/dL)',
                data: glucoseData,
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    new Chart(bloodPressureCtx, {
        type: 'line',
        data: {
            labels: ['1/1', '1/2', '1/3', '1/4'],
            datasets: [
                { label: 'Systolic (SBP)', data: bloodPressureData1, borderColor: 'red', fill: false },
                { label: 'Diastolic (DBP)', data: bloodPressureData2, borderColor: 'blue', fill: false }
            ]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    new Chart(activityCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                { label: 'Active Time (%)', data: [], backgroundColor: 'rgba(54, 162, 235, 0.6)' }
            ]
        },
        options: {
            scales: {
                y: { beginAtZero: true, max: 100 }
            }
        }
    });
}
