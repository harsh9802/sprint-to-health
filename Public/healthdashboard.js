const glucoseCtx = document.getElementById('glucoseCanvas').getContext('2d');
const bloodPressureCtx = document.getElementById('bloodPressureCanvas').getContext('2d');
const activityCtx = document.getElementById('activityCanvas').getContext('2d');

new Chart(glucoseCtx, {
    type: 'line',
    data: {
        labels: Array.from({length: 18}, (_, i) => i + 1),
        datasets: [{
            label: 'Blood Glucose (mg/dL)',
            data: [90, 95, 93, 89, 90, 94, 92, 90, 93, 98, 100, 97, 89, 85, 82, 80, 88, 92],
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
            { label: 'Systolic (SBP)', data: [120, 122, 118, 121], borderColor: 'blue', fill: false },
            { label: 'Diastolic (DBP)', data: [80, 79, 82, 78], borderColor: 'red', fill: false },
            { label: 'Heart Rate (BPM)', data: [75, 77, 74, 76], borderColor: 'green', fill: false }
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
            { label: 'Active Time (%)', data: [38, 30, 72, 15, 55, 65, 42], backgroundColor: 'rgba(54, 162, 235, 0.6)' },
            { label: 'Inactive Time (%)', data: [20, 18, 25, 20, 20, 20, 20], backgroundColor: 'rgba(255, 99, 132, 0.6)' }
        ]
    },
    options: {
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    }
});
