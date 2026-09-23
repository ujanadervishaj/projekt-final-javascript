
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



document.addEventListener('DOMContentLoaded', setActiveLink);
function updateActiveNavLink() {
    const currentUrl = window.location.href;
    
    const navLinks = document.querySelectorAll('.links li a');

    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');

        if (currentUrl === link.href) {
            link.parentElement.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', updateActiveNavLink);





