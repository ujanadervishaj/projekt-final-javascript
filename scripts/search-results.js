document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query') || '';

    if (query) {
        document.getElementById('resultsTitle').textContent = `Search Results for "${query}"`;
        displayResults(searchBooks(query));
    }
});

function displayResults(books) {
    const grid = document.getElementById('resultsGrid');
    grid.innerHTML = '';

    if (books.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No books found</p>';
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
                <p class="category">${book.category}</p>
                <div class="rating">★ ${book.rating}/5</div>
            </div>
        `;
        card.addEventListener('click', () => {
            window.location.href = `book-detail.html?id=${book.id}`;
        });
        grid.appendChild(card);
    });
}
