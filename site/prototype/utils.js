export function enableSearch(inputSelector, rowSelector) {
  const input = document.querySelector(inputSelector);
  const rows  = Array.from(document.querySelectorAll(rowSelector));
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    rows.forEach(r => {
      r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

export function initTableSorting(tableId) {
  const table   = document.getElementById(tableId);
  const headers = Array.from(table.querySelectorAll('th.sortable'));
  const tbody   = table.querySelector('tbody');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const type  = header.dataset.sort;
      const index = headers.indexOf(header);
      const asc   = header.classList.contains('sorted-asc');
      headers.forEach(h => h.classList.remove('sorted-asc','sorted-desc'));
      header.classList.add(asc ? 'sorted-desc' : 'sorted-asc');

      const dir = asc ? -1 : 1;
      const rows = Array.from(tbody.rows);
      const sorted = rows.sort((a,b) => {
        let aV = a.cells[index].innerText.trim();
        let bV = b.cells[index].innerText.trim();
        if (type==='number') return dir*(parseFloat(aV)-parseFloat(bV));
        return dir*aV.localeCompare(bV);
      });

      tbody.innerHTML = '';
      sorted.forEach(r => tbody.appendChild(r));
    });
  });
}

export function setupThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  toggle.addEventListener('change', () => {
    document.documentElement.setAttribute('data-theme', toggle.checked ? 'dark' : 'light');
    localStorage.setItem('theme', toggle.checked ? 'dark' : 'light');
  });
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    toggle.checked = saved === 'dark';
  }
}
