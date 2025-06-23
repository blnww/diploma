import { loadBooks } from './data.js';

const STATUSES = ['В наличии', 'На руках', 'Утеряна', 'На ремонте'];
let chart;

async function update() {
  const books = await loadBooks();
  const counts = STATUSES.map(s => books.filter(b => b.status === s).length);
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = STATUSES.map((s,i) => `<tr><td>${s}</td><td>${counts[i]}</td></tr>`).join('');
  const ctx = document.getElementById('statusChart');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: STATUSES,
      datasets: [{
        data: counts,
        backgroundColor: ['#16a34a','#d97706','#dc2626','#f59e0b']
      }]
    }
  });
}

window.addEventListener('storage', (e) => {
  if (e.key === 'books') update();
});

document.addEventListener('DOMContentLoaded', update);