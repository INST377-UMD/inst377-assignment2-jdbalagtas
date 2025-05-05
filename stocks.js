const apiKey = 'X3kaBmCOviK1SaoH6ACGRBAB1Vefn03s';
let chart;

// stock lookup
document.getElementById('lookupBtn').addEventListener('click', () => {
    const ticker = document.getElementById('stockInput').value.toUpperCase();
    const days = document.getElementById('dayRange').value;
    if (ticker) {
        fetchStockData(ticker, days);
    }
});

// polygon api
async function fetchStockData(ticker, days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const formatDate = (date) => date.toISOString().split('T')[0];
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(startDate)}/${formatDate(endDate)}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            alert('No data found for that ticker.');
            return;
        }

        const labels = data.results.map(d => new Date(d.t).toLocaleDateString());
        const prices = data.results.map(d => d.c);

        renderChart(ticker, labels, prices);
    } catch (err) {
        console.error(err);
        alert('Error fetching stock data.');
    }
}

// chart.js
function renderChart(ticker, labels, prices) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `${ticker} Closing Price`,
                data: prices,
                borderColor: 'blue',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Closing Price ($)' } }
            }
        }
    });
}

// reddit stocks
async function loadRedditStocks() {
    const url = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';
    try {
        const res = await fetch(url);
        const data = await res.json();

        const top5 = data.slice(0, 5);
        const tbody = document.querySelector('#redditTable tbody');
        tbody.innerHTML = '';
        top5.forEach(stock => {
            const row = document.createElement('tr');
            const sentimentIcon = stock.sentiment === 'Bullish' ? '🐂' : '🐻';

            row.innerHTML = `
                <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
                <td>${stock.no_of_comments}</td>
                <td>${sentimentIcon}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Error loading Reddit stocks:', err);
    }
}

// reload
window.onload = () => {
    loadRedditStocks();
}

// voice commands
if (annyang) {
    const commands = {
        'hello': () => alert('Hello!'),
        'change the color to *color': (color) => {
            document.body.style.backgroundColor = color;
        },
        'navigate to *page': (page) => {
            const lowerPage = page.toLowerCase();
            if (lowerPage.includes('home')) window.location.href = 'homepage.html';
            else if (lowerPage.includes('stock')) window.location.href = 'stocks.html';
            else if (lowerPage.includes('dog')) window.location.href = 'dogs.html';
        },
        'lookup *stock': (stock) => {
            document.getElementById('stockInput').value = stock.toUpperCase();
            document.getElementById('dayRange').value = '30'; // Default to 30 days
            fetchStockData(stock.toUpperCase(), 30);
        }
    };
    annyang.addCommands(commands);
    annyang.start();
}