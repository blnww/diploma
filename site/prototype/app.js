import { enableSearch, initTableSorting, setupThemeToggle } from './utils.js';
import { loadBooks, saveBooks } from './data.js';

const STATUSES = ['В наличии', 'На руках', 'Утеряна', 'На ремонте'];

let books = [];
let isAdmin = false;

function renderTable(data) {
  const tbody = document.querySelector('#catalog tbody');
  tbody.innerHTML = data
    .map((book, idx) => {
      if (isAdmin) {
        const options = STATUSES.map(
          (s) => `<option value="${s}" ${s === book.status ? 'selected' : ''}>${s}</option>`
        ).join('');
        return `
          <tr data-index="${idx}">
            <td data-title="Инв. №">${book.inv}</td>
            <td data-title="Название">${book.title}</td>
            <td data-title="Автор">${book.author}</td>
            <td data-title="Год">${book.year}</td>
            <td data-title="Статус"><select class="status-select">${options}</select></td>
            <td><button class="del-btn">Удалить</button></td>
          </tr>`;
      }
      return `
        <tr>
          <td data-title="Инв. №">${book.inv}</td>
          <td data-title="Название">${book.title}</td>
          <td data-title="Автор">${book.author}</td>
          <td data-title="Год">${book.year}</td>
          <td data-title="Статус">${book.status}</td>
        </tr>`;
    })
    .join('');

  if (isAdmin) {
    tbody.querySelectorAll('.status-select').forEach((sel) => {
      sel.addEventListener('change', (e) => {
        const row = e.target.closest('tr');
        books[row.dataset.index].status = e.target.value;
        saveBooks(books);
      });
    });
    tbody.querySelectorAll('.del-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        books.splice(row.dataset.index, 1);
        saveBooks(books);
        renderTable(books);
      });
    });
  }
}

const CODE_BOOKS = {
  '999999': { inv: '999999', title: 'Новая книга', author: 'RFID Автор', year: 2023 },
  '222222': { inv: '222222', title: 'Новая книга', author: 'RFID Автор', year: 2023 },
  '111111': { inv: '111111', title: 'Новая книга', author: 'RFID Автор', year: 2023 },
  '333333': { inv: '333333', title: 'Новая книга', author: 'RFID Автор', year: 2023 },
  '444444': { inv: '444444', title: 'Новая книга', author: 'RFID Автор', year: 2023 },
  '555555': { inv: '555555', title: 'Новая книга', author: 'RFID Автор', year: 2023 },
  '666666': { inv: '666666', title: 'Новая книга', author: 'RFID Автор', year: 2023 },
  '777777': { inv: '777777', title: 'Новая книга', author: 'RFID Автор', year: 2023 },
  '888888': { inv: '888888', title: 'Новая книга', author: 'RFID Автор', year: 2023 }
};

function addBookByCode(code) {
  const info = CODE_BOOKS[code];
  if (info) {
    const newBook = { ...info, status: 'В наличии' };
    books.push(newBook);
    saveBooks(books);
    renderTable(books);
    const tbody = document.querySelector('#catalog tbody');
    const row = tbody.lastElementChild;
    row.classList.add('added');
    showToast('Книга добавлена');
  }
}

function showToast(text) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = text;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', async () => {
  books = await loadBooks();
  isAdmin = localStorage.getItem('isAdmin') === 'true';
  const adminToggle = document.getElementById('adminToggle');
  const adminArea = document.getElementById('adminArea');
  if (adminToggle) {
    adminToggle.checked = isAdmin;
    adminToggle.addEventListener('change', () => {
      if (adminToggle.checked) {
        if (!isAdmin) {
          adminArea.classList.remove('hidden');
        }
      } else {
        isAdmin = false;
        localStorage.removeItem('isAdmin');
        adminArea.classList.add('hidden');
        renderTable(books);
      }
    });
  }

  const loginBtn = document.getElementById('adminLoginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const u = document.getElementById('adminUser').value.trim();
      const p = document.getElementById('adminPass').value.trim();
      if (u === 'admin' && p === 'admin') {
        isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
        adminArea.classList.add('hidden');
        renderTable(books);
      } else {
        alert('Неверные данные');
      }
    });
  }

  renderTable(books);

  enableSearch('#searchInput', '#catalog tbody tr');
  initTableSorting('catalog');
  setupThemeToggle();

  const rfid = document.getElementById('rfidInput');
  if (rfid) {
    rfid.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addBookByCode(rfid.value.trim());
        rfid.value = '';
        rfid.focus();
      }
    });
  }
});