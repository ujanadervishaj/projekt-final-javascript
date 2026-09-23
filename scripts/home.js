console.log("test")
let index = 0;

document.addEventListener('DOMContentLoaded', () => {
    populateSlider();
    setupSearch();
    setupCategoryFilter();
    setupSliderNavigation();
    updateUserIcon();
    initializeDots();
});

function populateSlider() {
    const sliderTrack = document.getElementById('sliderTrack');
    sliderTrack.innerHTML = '';

    booksDatabase.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <div class="circle-bg"></div>
            <img src="${book.image}" alt="${book.title}">
        `;
        bookCard.style.cursor = 'pointer';
        bookCard.addEventListener('click', () => {
            window.location.href = `book-detail.html?id=${book.id}`;
        });
        sliderTrack.appendChild(bookCard);
    });

    updateSlider();
}

function setupSliderNavigation() {
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalCards = document.querySelectorAll('.book-card').length;
            if (index < totalCards - 4) { 
                index++;
            } else {
                index = 0;
            }
            updateSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (index > 0) {
                index--;
            } else {
                const totalCards = document.querySelectorAll('.book-card').length;
                index = totalCards - 4;
            }
            updateSlider();
        });
    }

    window.addEventListener('resize', updateSlider);
}

function updateSlider() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;
    
    const cardWidth = document.querySelector('.book-card').offsetWidth + 20;
    track.style.transform = `translateX(${-index * cardWidth}px)`;
}

function initializeDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            document.querySelector('.dot.active')?.classList.remove('active');
            dot.classList.add('active');
        });
    });
}

function setupSearch() {
    const searchInput = document.querySelector('.search input');
    const searchBtn = document.querySelector('.search button');

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search input');
    const query = searchInput ? searchInput.value.trim() : '';
    
    if (query.length > 0) {
        showSearchResults(query);
    }
}

function showSearchResults(query) {
    const results = searchBooks(query);
    
    if (results.length === 0) {
        alert('No books found matching: ' + query);
        return;
    }

    if (results.length === 1) {
        window.location.href = `book-detail.html?id=${results[0].id}`;
    } else {
        window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
    }
}

function setupCategoryFilter() {
    const categorySelects = document.querySelectorAll('.categories select');
    const searchSelects = document.querySelectorAll('.search select');

    const allSelects = [...categorySelects, ...searchSelects];

    allSelects.forEach(select => {
        const categories = getCategories();
        select.innerHTML = '<option value="">All Categories</option>';
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            const selectedCategory = e.target.value;
            if (selectedCategory) {
                filterByCategory(selectedCategory);
            }
        });
    });
}

function filterByCategory(category) {
    const books = getBooksByCategory(category);
    
    if (books.length === 0) {
        alert('No books in this category');
        return;
    }

    window.location.href = `category-books.html?category=${encodeURIComponent(category)}`;
}

function updateUserIcon() {
    const userIcon = document.getElementById('userIcon');
    const isLoggedIn = userManager.isUserLoggedIn();
    const currentUser = userManager.getCurrentUser();

    if (isLoggedIn && currentUser) {
        const userName = currentUser.name;
        userIcon.innerHTML = `
            <a href="mylibrary.html" title="${userName}">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="60" r="35" fill="#0b7c6b"/>
                    <path d="M30 170 C30 130 170 130 170 170 L170 190 L30 190 Z" fill="#0b7c6b"/>
                </svg>
            </a>
            <div class="user-menu">
                <p>${userName}</p>
                <button onclick="userManager.logout(); window.location.href='index.html';">Logout</button>
            </div>
        `;
    } else {
        userIcon.innerHTML = `<a href="login.html">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="60" r="35" fill="#000"/>
                <path d="M30 170 C30 130 170 130 170 170 L170 190 L30 190 Z" fill="#000"/>
            </svg>
        </a>`;
    }
}

document.addEventListener('mouseover', (e) => {
    if (e.target.closest('#userIcon')) {
        const menu = document.querySelector('.user-menu');
        if (menu) menu.style.display = 'block';
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.closest('#userIcon')) {
        const menu = document.querySelector('.user-menu');
        if (menu) menu.style.display = 'none';
    }
});
function setActiveLink() {
    const currentPath = window.location.pathname.split("/").pop();
    
    const navLinks = document.querySelectorAll('.links li a');

    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');

        const linkPath = link.getAttribute('href').split("/").pop();

        if (currentPath === linkPath) {
            link.parentElement.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveLink);