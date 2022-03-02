// -------- Constanta --------
const STORAGE_KEY = 'MY_BOOKS';
const LOAD_BOOKS_EVENT = 'load-books-event';
const INPUT_TITLE_SELECTOR = '#title';
const INPUT_AUTHOR_SELECTOR = '#author';
const INPUT_YEAR_SELECTOR = '#publicationYear';
const INPUT_COMPLETED_SELECTOR = '#isCompleted';

// -------- Global Variable --------
const books = [];

// -------- Function --------
const generateId = () => {
  return 'BOOK' + Date.now();
};

const generateBook = (title, author, year, isComplete = false) => {
  return {
    id: generateId(),
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };
};

const findBook = (bookId) => {
  for (const book of books) {
    if (book.id === bookId) return book;
  }
  return null;
};

const addBook = () => {
  // Get value from inputs.
  const title = document.querySelector(INPUT_TITLE_SELECTOR).value;
  const author = document.querySelector(INPUT_AUTHOR_SELECTOR).value;
  const year = document.querySelector(INPUT_YEAR_SELECTOR).value;
  const isCompleted = document.querySelector(INPUT_COMPLETED_SELECTOR).checked;

  // Create new book and added it to list.
  const newBook = generateBook(title, author, year, isCompleted);
  books.push(newBook);

  document.dispatchEvent(new Event(LOAD_BOOKS_EVENT));
};

const setBookCompleted = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(LOAD_BOOKS_EVENT));
};

const setBookUncompleted = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(LOAD_BOOKS_EVENT));
};

const deleteBook = (bookId) => {
  const bookIndex = books.indexOf(findBook(bookId));
  if (bookIndex === -1) return;

  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(LOAD_BOOKS_EVENT));
};

const makeBookItem = (book) => {
  const bookItem = document.createElement('article');
  bookItem.classList.add('book-item');

  // Make content section.
  const content = document.createElement('section');
  content.classList.add('book-item-content');
  content.innerHTML = `
    <span class="book-title">${book.title}</span>
    <div class="book-attrs">
      <div class="attr">
        <i class="fa-solid fa-feather-pointed fa-fw"></i>
        <span>${book.author}</span>
      </div>
      <div class="attr">
        <i class="fa-solid fa-calendar-day fa-fw"></i>
        <span>${book.year}</span>
      </div>
    </div>
  `;

  // Make action section.
  const actions = document.createElement('section');
  actions.classList.add('book-item-actions');

  // Make check button.
  const btnCheck = document.createElement('button');
  btnCheck.classList.add('btn', 'icon-btn');
  btnCheck.innerHTML = book.isComplete
    ? `<i class="fa-solid fa-circle-check fa-2xl"></i>`
    : `<i class="fa-regular fa-circle-check fa-2xl"></i>`;

  btnCheck.addEventListener('click', () => {
    if (book.isComplete) setBookUncompleted(book.id);
    else setBookCompleted(book.id);
  });

  // Make delete button.
  const btnDelete = document.createElement('button');
  btnDelete.classList.add('btn', 'icon-btn');
  btnDelete.innerHTML = `<i class="fa-regular fa-trash-can fa-2xl"></i>`;

  btnDelete.addEventListener('click', () => {
    const deleteBookModal = document.querySelector('#deleteBookModal');
    const bookTitleView = deleteBookModal.querySelector(
      '[data-modal="bookTitle"]'
    );

    bookTitleView.innerText = book.title;
    deleteBookModal.removeAttribute('hidden');

    // Delete book item button.
    deleteBookModal.querySelector('[data-modal="btnDelete"]').onclick = () => {
      deleteBook(book.id);
      deleteBookModal.setAttribute('hidden', '');
    };
  });

  actions.appendChild(btnCheck);
  actions.appendChild(btnDelete);
  bookItem.appendChild(content);
  bookItem.appendChild(actions);

  return bookItem;
};

const resetAddBookForm = () => {
  document.querySelector(INPUT_TITLE_SELECTOR).value = '';
  document.querySelector(INPUT_AUTHOR_SELECTOR).value = '';
  document.querySelector(INPUT_YEAR_SELECTOR).value = '';
  document.querySelector(INPUT_COMPLETED_SELECTOR).checked = false;
};

const loadBooks = () => {
  // TODO: get data from storage
  // ...
  document.dispatchEvent(new Event(LOAD_BOOKS_EVENT));
};

// -------- Event Handler --------
// Custom Event: Load books event.
document.addEventListener(LOAD_BOOKS_EVENT, () => {
  const completedBookList = document.querySelector('#completedBookList');
  const uncompletedBookList = document.querySelector('#uncompletedBookList');

  // Reset all lists.
  completedBookList.innerHTML = '';
  uncompletedBookList.innerHTML = '';

  for (const book of books) {
    const newBookItem = makeBookItem(book);

    if (book.isComplete) {
      completedBookList.appendChild(newBookItem);
    } else {
      uncompletedBookList.appendChild(newBookItem);
    }
  }
});

// On page finished loading event.
document.addEventListener('DOMContentLoaded', () => {
  // Set add book event
  const formAddBook = document.querySelector('#formAddBook');
  formAddBook.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
    resetAddBookForm();
  });

  // Load all modals.
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    const btnDismiss = modal.querySelector('[data-modal="btnDismiss"]');
    const btnCancel = modal.querySelector('[data-modal="btnCancel"]');

    btnDismiss.addEventListener('click', () => {
      modal.setAttribute('hidden', '');
    });
    btnCancel.addEventListener('click', () => {
      modal.setAttribute('hidden', '');
    });
  });

  // Load all books.
  loadBooks();
});
