// Поиск по карточкам
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const cards = Array.from(document.querySelectorAll('#catalog .card')); // карточки книг

  input.addEventListener('input', () => {
    console.time('Search');  // старт замера поиска
    const q = input.value.trim().toLowerCase();
    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
    console.timeEnd('Search');  // конец замера поиска
  });
});

// Инициализация сортировки (если у вас есть таблица)
function initTableSorting(tableId) {
  const table   = document.getElementById(tableId);
  if (!table) return;
  const headers = Array.from(table.querySelectorAll('th.sortable'));
  const tbody   = table.querySelector('tbody');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      console.time('Sort');  // старт замера сортировки

      const type  = header.dataset.sort;
      const idx   = headers.indexOf(header);
      const asc   = header.classList.contains('sorted-asc');
      headers.forEach(h => h.classList.remove('sorted-asc','sorted-desc'));
      header.classList.add(asc ? 'sorted-desc' : 'sorted-asc');

      const dir = asc ? -1 : 1;
      const sorted = Array.from(tbody.rows).sort((a, b) => {
        let aV = a.cells[idx].innerText.trim();
        let bV = b.cells[idx].innerText.trim();
        if (type === 'number') {
          return dir * (parseFloat(aV) - parseFloat(bV));
        }
        return dir * aV.localeCompare(bV);
      });

      tbody.innerHTML = '';
      sorted.forEach(r => tbody.appendChild(r));

      console.timeEnd('Sort');  // конец замера сортировки
    });
  });
}
initTableSorting('catalog');

// Тёмная тема (без изменений)
const toggle = document.getElementById('themeToggle');
if (toggle) {
  toggle.addEventListener('change', () => {
    const theme = toggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  });
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    toggle.checked = saved === 'dark';
  }
}
