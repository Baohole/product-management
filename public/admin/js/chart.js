const orders = [
    { order_date: "2024-08-11T10:07:57.839+00:00" },
    { order_date: "2023-07-10T12:15:34.567+00:00" },
    { order_date: "2023-05-21T14:22:11.453+00:00" },
    { order_date: "2022-09-17T09:30:22.123+00:00" },
    { order_date: "2022-06-11T08:10:55.789+00:00" },
    { order_date: "2021-03-15T11:45:37.674+00:00" }
];

const claimsChart = document.getElementById('claimsChart');
const monthlyClaim = JSON.parse(claimsChart.getAttribute('monthlyClaim'));

const labels = Object.keys(monthlyClaim).sort();
const data = labels.map(month => monthlyClaim[month]);
// console.log(labels, data);

const ctx = claimsChart.getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels,
        datasets: [{
            label: 'Claims Over the Years',
            data,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.5)',
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Total of Claims'
                }
            }
        }
    }
});
console.log(ctx);