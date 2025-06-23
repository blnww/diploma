export async function loadBooks() {
  const saved = localStorage.getItem('books');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (_) {
      localStorage.removeItem('books');
    }
  }
  const res = await fetch('./books.json');
  const data = res.ok ? await res.json() : [];
  localStorage.setItem('books', JSON.stringify(data));
  return data;
}

export function saveBooks(data) {
  localStorage.setItem('books', JSON.stringify(data));
  window.dispatchEvent(new Event('storage')); // trigger listeners
}