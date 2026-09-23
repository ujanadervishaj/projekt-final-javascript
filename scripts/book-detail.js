let currentBookId = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentBookId = parseInt(urlParams.get('id'));

    if (!currentBookId) {
        window.location.href = 'index.html';
        return;
    }

    displayBookDetails();
    displayRelatedBooks();
});

function displayBookDetails() {
    const book = getBookById(currentBookId);

    if (!book) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('bookCover').src = book.image;
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = `by ${book.author}`;
    document.getElementById('bookRating').textContent = '★'.repeat(book.rating) + '☆'.repeat(5 - book.rating);
    document.getElementById('ratingNumber').textContent = `${book.rating}/5`;
    document.getElementById('bookCategory').textContent = book.category;
    document.getElementById('bookPages').textContent = `${book.pages} pages`;
    document.getElementById('bookStatus').textContent = book.status;
    document.getElementById('bookDescription').textContent = book.description;
    
    checkIfInLibrary();
    document.getElementById('addToLibraryBtn').addEventListener('click', addToLibraryQuick);
    document.getElementById('removeFromLibraryBtn').addEventListener('click', removeFromLibrary);
    document.getElementById('saveBtnDetails').addEventListener('click', saveToLibraryWithDetails);
}

function checkIfInLibrary() {
    const isInLibrary = libraryManager.isBookInLibrary(currentBookId);
    const addBtn = document.getElementById('addToLibraryBtn');
    const removeBtn = document.getElementById('removeFromLibraryBtn');
    
    if (isInLibrary) {
        addBtn.style.display = 'none';
        removeBtn.style.display = 'block';
    } else {
        addBtn.style.display = 'block';
        removeBtn.style.display = 'none';
    }
}

function addToLibraryQuick() {
    if (!userManager.isUserLoggedIn()) {
        showNotification('Please log in first', 'error');
        setTimeout(() => {
            window.location.href = '/html/login.html';
        }, 1500);
        return;
    }

    const result = libraryManager.addBookToLibrary(currentBookId, 'Want to Read');

    if (result.success) {
        showNotification('Book added to library!', 'success');
        checkIfInLibrary();
    } else {
        showNotification(result.message, 'error');
    }
}

function removeFromLibrary() {
    if (confirm('Are you sure you want to remove this book from your library?')) {
        const result = libraryManager.removeBookFromLibrary(currentBookId);
        if (result.success) {
            showNotification('Book removed from library', 'success');
            checkIfInLibrary();
            document.getElementById('statusSelect').value = '';
            document.getElementById('startDate').value = '';
            document.getElementById('endDate').value = '';
            document.getElementById('notesArea').value = '';
        }
    }
}

function saveToLibraryWithDetails() {
    if (!userManager.isUserLoggedIn()) {
        showNotification('Please log in first', 'error');
        setTimeout(() => {
            window.location.href = '/html/login.html';
        }, 1500);
        return;
    }

    const status = document.getElementById('statusSelect').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const notes = document.getElementById('notesArea').value;

    if (!status) {
        showNotification('Please select a reading status', 'error');
        return;
    }

    if (libraryManager.isBookInLibrary(currentBookId)) {
        const result = libraryManager.updateBookStatus(currentBookId, status, 0, notes, endDate);
        if (result.success) {
            showNotification('Book updated in your library!', 'success');
        }
    } else {
        const result = libraryManager.addBookToLibrary(currentBookId, status, startDate, endDate);
        if (result.success) {
            showNotification('Book added to library!', 'success');
            checkIfInLibrary();
        }
    }
}

function displayRelatedBooks() {
    const book = getBookById(currentBookId);
    const relatedBooks = booksDatabase.filter(b => 
        b.category === book.category && b.id !== currentBookId
    ).slice(0, 4);

    document.getElementById('relatedCategory').textContent = book.category;
    const grid = document.getElementById('relatedBooksGrid');
    grid.innerHTML = '';

    relatedBooks.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <div class="book-card-content">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
            </div>
        `;
        card.addEventListener('click', () => {
            window.location.href = `book-detail.html?id=${book.id}`;
        });
        grid.appendChild(card);
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



const responsiveWarning = document.getElementById("responsive-warning");
const responsiveDesign = false;

if (!responsiveDesign && window.innerWidth <= 768) {
	responsiveWarning.classList.add("show");
}



const toggleModeBtn = document.getElementById("toggle-mode-btn");
const portfolioLink = document.getElementById("portfolio-link");
const body = document.body;

function applyMode(mode) {
	body.classList.remove("light-mode", "dark-mode");
	body.classList.add(mode);

	if (mode === "dark-mode") {
		toggleModeBtn.style.color = "rgb(245, 245, 245)";
		toggleModeBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';

		portfolioLink.style.color = "rgb(245, 245, 245)";

		responsiveWarning.style.backgroundColor = "rgb(2, 4, 8)";
	} else {
		toggleModeBtn.style.color = "rgb(2, 4, 8)";
		toggleModeBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';

		portfolioLink.style.color = "rgb(2, 4, 8)";

		responsiveWarning.style.backgroundColor = "rgb(245, 245, 245)";
	}
}

let savedMode = localStorage.getItem("mode");

if (savedMode === null) {
	savedMode = "light-mode"; 
}
applyMode(savedMode);

toggleModeBtn.addEventListener("click", function () {
	let newMode;

	if (body.classList.contains("light-mode")) {
		newMode = "dark-mode";
	} else {
		newMode = "light-mode";
	}

	applyMode(newMode);

	localStorage.setItem("mode", newMode);
});