// theme.js
const toggle = document.getElementById('themeToggle');
if (toggle) {
  toggle.addEventListener('change', () => {
    document.documentElement
      .setAttribute('data-theme', toggle.checked ? 'dark' : 'light');
    localStorage.setItem('theme', toggle.checked ? 'dark' : 'light');
  });
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    toggle.checked = saved === 'dark';
  }
}
