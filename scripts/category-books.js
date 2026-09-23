document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || '';

    if (category) {
        document.getElementById('categoryTitle').textContent = `${category} Books`;
        displayBooks(getBooksByCategory(category));
        setupSort();
    }
});

function displayBooks(books) {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = '';

    if (books.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No books in this category</p>';
        return;
    }

    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="author">${book.author}</p>
                <div class="rating">★ ${book.rating}/5</div>
            </div>
        `;
        card.addEventListener('click', () => {
            window.location.href = `book-detail.html?id=${book.id}`;
        });
        grid.appendChild(card);
    });
}

function setupSort() {
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', (e) => {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        let books = getBooksByCategory(category);
        books = sortBooks(books, e.target.value);
        displayBooks(books);
    });
}
