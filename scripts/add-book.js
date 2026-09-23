let addedBooks = [];

document.addEventListener('DOMContentLoaded', () => {
    if (!userManager.redirectIfNotAdmin()) return;
    
    setupRatingDisplay();
    setupImagePreview();
    setupFormSubmit();
    displayRecentlyAdded();
});

function setupRatingDisplay() {
    const ratingInput = document.getElementById('rating');
    const ratingDisplay = document.getElementById('ratingDisplay');

    ratingInput.addEventListener('change', () => {
        const rating = parseInt(ratingInput.value);
        ratingDisplay.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    });
}

function setupImagePreview() {
    const imageUrl = document.getElementById('imageUrl');
    const imagePreview = document.getElementById('imagePreview');

    imageUrl.addEventListener('change', () => {
        if (imageUrl.value) {
            imagePreview.innerHTML = `<img src="${imageUrl.value}" alt="Preview" onerror="this.style.display='none'">`;
            imagePreview.classList.add('show');
        }
    });

    imageUrl.addEventListener('blur', () => {
        if (imageUrl.value) {
            imagePreview.innerHTML = `<img src="${imageUrl.value}" alt="Preview" onerror="this.style.display='none'">`;
            imagePreview.classList.add('show');
        }
    });
}

function setupFormSubmit() {
    const form = document.getElementById('bookForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newBook = {
            id: Math.max(...booksDatabase.map(b => b.id), 0) + 1,
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            category: document.getElementById('category').value,
            genre: document.getElementById('genre').value,
            pages: parseInt(document.getElementById('pages').value),
            rating: parseInt(document.getElementById('rating').value),
            image: document.getElementById('imageUrl').value,
            description: document.getElementById('description').value,
            status: "Available"
        };

        booksDatabase.push(newBook);
        addedBooks.unshift(newBook);

        localStorage.setItem('addedBooks', JSON.stringify(addedBooks));

        showNotification('✓ Book added successfully!', 'success');
        form.reset();
        document.getElementById('imagePreview').classList.remove('show');
        document.getElementById('ratingDisplay').textContent = '★★★★★';
        displayRecentlyAdded();
    });
}

function displayRecentlyAdded() {
    const container = document.getElementById('recentBooks');
    const stored = localStorage.getItem('addedBooks');
    const books = stored ? JSON.parse(stored) : [];

    if (books.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">No books added yet</p>';
        return;
    }

    container.innerHTML = '';
    books.slice(0, 6).forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-preview';
        card.innerHTML = `
            <img src="${book.image}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/200x250?text=${encodeURIComponent(book.title)}'">
            <div class="book-preview-info">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
                <p>${book.category}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('addedBooks');
    if (stored) {
        addedBooks = JSON.parse(stored);
    }
});
