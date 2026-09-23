const booksDatabase = [
    {
        id: 1,
        title: "The Butcher and the Wren",
        author: "Hannah Nicole Maehrer",
        category: "Fantasy",
        genre: "Fantasy",
        pages: 336,
        rating: 4,
        image: "/assets/book1.jpg",
        description: "In a world where villains are the heroes, one assistant discovers there's more to her boss than meets the eye.",
        status: "Available"
    },
    {
        id: 2,
        title: "The Secrets",
        author: "Christopher Paolini",
        category: "Comedy",
        genre: "Fantasy",
        pages: 512,
        rating: 5,
        image: "/assets/book2.jpg",
        description: "The thrilling return to the world of Eragon with Murtagh's epic tale.",
        status: "Available"
    },
    {
        id: 3,
        title: "Big Book of Why",
        author: "Robert E. Wells",
        category: "Education",
        genre: "Educational",
        pages: 128,
        rating: 4,
        image: "/assets/book3.jpg",
        description: "A fun exploration of why things work the way they do.",
        status: "Available"
    },
    {
        id: 4,
        title: "Holy Cross",
        author: "Jeff Kinney",
        category: "Comedy",
        genre: "Humor",
        pages: 217,
        rating: 5,
        image: "/assets/book4.jpg",
        description: "The hilarious misadventures of middle school life.",
        status: "Available"
    },
    {
        id: 5,
        title: "The Sun and the Star",
        author: "Rick Riordan & Mark Oshiro",
        category: "Fantasy",
        genre: "Fantasy",
        pages: 304,
        rating: 5,
        image: "/assets/book5.jpg",
        description: "A new adventure in Rick Riordan's world with darker themes.",
        status: "Available"
    },
    {
        id: 6,
        title: "The Butcher & The Wren",
        author: "Laird Barron",
        category: "Horror",
        genre: "Horror",
        pages: 400,
        rating: 4,
        image: "/assets/book6.jpg",
        description: "A dark and mysterious tale that will keep you up at night.",
        status: "Available"
    },
    {
        id: 7,
        title: "The Secrets",
        author: "Johnas Nill",
        category: "Thriller",
        genre: "Thriller",
        pages: 350,
        rating: 5,
        image: "/assets/book7.jpg",
        description: "An intense thriller filled with shocking revelations.",
        status: "Available"
    },
    {
        id: 8,
        title: "Travel Asia",
        author: "Willson",
        category: "Adventure",
        genre: "Travel",
        pages: 456,
        rating: 4,
        image: "https://via.placeholder.com/180x250?text=Travel+Asia",
        description: "An unforgettable journey through the wonders of Asia.",
        status: "Available"
    },
    {
        id: 9,
        title: "Holy Cross",
        author: "John Doe",
        category: "Religious",
        genre: "Religious",
        pages: 289,
        rating: 4,
        image: "https://via.placeholder.com/180x250?text=Holy+Cross",
        description: "A spiritual journey through faith and beliefs.",
        status: "Available"
    },
    {
        id: 10,
        title: "Search Light",
        author: "Doe John",
        category: "Thriller",
        genre: "Thriller",
        pages: 345,
        rating: 4,
        image: "https://via.placeholder.com/180x250?text=Search+Light",
        description: "A gripping mystery that will keep you guessing.",
        status: "Available"
    },
    {
        id: 11,
        title: "Ancient History",
        author: "Willson Doe",
        category: "History",
        genre: "Historical",
        pages: 523,
        rating: 4,
        image: "https://via.placeholder.com/180x250?text=Ancient+History",
        description: "Discover the secrets of ancient civilizations.",
        status: "Available"
    },
    {
        id: 12,
        title: "Love Myself",
        author: "Johnatan",
        category: "Self-Help",
        genre: "Self-Help",
        pages: 267,
        rating: 5,
        image: "https://via.placeholder.com/180x250?text=Love+Myself",
        description: "A guide to self-discovery and personal growth.",
        status: "Available"
    }
];

function getCategories() {
    const categories = [...new Set(booksDatabase.map(book => book.category))];
    return categories.sort();
}

function getBookById(id) {
    return booksDatabase.find(book => book.id === parseInt(id));
}

function getBooksByCategory(category) {
    if (category === "All Categories" || !category) {
        return booksDatabase;
    }
    return booksDatabase.filter(book => book.category === category);
}

function searchBooks(query) {
    if (!query) return booksDatabase;
    const lowerQuery = query.toLowerCase();
    return booksDatabase.filter(book => 
        book.title.toLowerCase().includes(lowerQuery) || 
        book.author.toLowerCase().includes(lowerQuery) ||
        book.category.toLowerCase().includes(lowerQuery) ||
        book.description.toLowerCase().includes(lowerQuery)
    );
}

function filterBooks(category, searchQuery, genre) {
    let filtered = booksDatabase;
    
    if (category && category !== "All Categories") {
        filtered = filtered.filter(book => book.category === category);
    }
    
    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(book => 
            book.title.toLowerCase().includes(lowerQuery) || 
            book.author.toLowerCase().includes(lowerQuery) ||
            book.category.toLowerCase().includes(lowerQuery) ||
            book.description.toLowerCase().includes(lowerQuery)
        );
    }
    
    if (genre) {
        filtered = filtered.filter(book => book.genre === genre);
    }
    
    return filtered;
}

function sortBooks(books, sortBy) {
    let sorted = [...books];
    
    switch(sortBy) {
        case "A-Z":
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "Highest-Rated":
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case "Recently-Added":
            sorted.reverse();
            break;
        default:
            break;
    }
    
    return sorted;
}


class UserManager {
    constructor() {
        this.adminEmail = "ujanadervishaj@gmail.com";
        this.adminPassword = "123456";
        this.initializeUsers();
    }

    initializeUsers() {
        if (!localStorage.getItem('users')) {
            const defaultUsers = [
                {
                    id: 1,
                    email: this.adminEmail,
                    password: this.adminPassword,
                    name: "Admin User",
                    isAdmin: true,
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
    }

    register(email, password, name) {
        const users = this.getAllUsers();
        
        if (users.some(user => user.email === email)) {
            return { success: false, message: "Email already registered" };
        }

        const newUser = {
            id: users.length + 1,
            email,
            password,
            name,
            isAdmin: false,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        return { success: true, message: "Registration successful", user: newUser };
    }

    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const currentUser = { ...user };
            delete currentUser.password;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            return { success: true, message: "Login successful", user: currentUser };
        }

        return { success: false, message: "Invalid email or password" };
    }

    logout() {
        localStorage.removeItem('currentUser');
        return { success: true, message: "Logout successful" };
    }

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    getAllUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    isUserLoggedIn() {
        return localStorage.getItem('currentUser') !== null;
    }

    isUserAdmin() {
        const user = this.getCurrentUser();
        return user && user.isAdmin;
    }

    redirectIfNotLoggedIn() {
        if (!this.isUserLoggedIn()) {
            window.location.href = "/html/login.html";
            return false;
        }
        return true;
    }

    redirectIfNotAdmin() {
        if (!this.isUserAdmin()) {
            alert("You don't have permission to access this page. Admin access required.");
            window.location.href = /;
            return false;
        }
        return true;
    }
}

class LibraryManager {
    constructor() {
        this.initializeLibrary();
    }

    initializeLibrary() {
        if (!localStorage.getItem('userLibrary')) {
            localStorage.setItem('userLibrary', JSON.stringify([]));
        }
    }

    addBookToLibrary(bookId, status = "Want to Read", startDate = null, endDate = null) {
        const currentUser = new UserManager().getCurrentUser();
        if (!currentUser) return { success: false, message: "User not logged in" };

        const library = this.getLibrary();
        
        if (library.some(item => item.bookId === bookId)) {
            return { success: false, message: "Book already in library" };
        }

        const book = getBookById(bookId);
        const libraryItem = {
            id: library.length + 1,
            bookId: bookId,
            userId: currentUser.id,
            title: book.title,
            author: book.author,
            image: book.image,
            status: status,
            startDate: startDate,
            endDate: endDate,
            rating: 0,
            notes: "",
            addedAt: new Date().toISOString()
        };

        library.push(libraryItem);
        localStorage.setItem('userLibrary', JSON.stringify(library));
        
        return { success: true, message: "Book added to library", item: libraryItem };
    }

    removeBookFromLibrary(bookId) {
        const library = this.getLibrary();
        const filtered = library.filter(item => item.bookId !== bookId);
        localStorage.setItem('userLibrary', JSON.stringify(filtered));
        return { success: true, message: "Book removed from library" };
    }

    updateBookStatus(bookId, status, rating = 0, notes = "", endDate = null) {
        const library = this.getLibrary();
        const item = library.find(i => i.bookId === bookId);
        
        if (item) {
            item.status = status;
            if (rating) item.rating = rating;
            if (notes) item.notes = notes;
            if (endDate) item.endDate = endDate;
            localStorage.setItem('userLibrary', JSON.stringify(library));
            return { success: true, message: "Book status updated" };
        }
        
        return { success: false, message: "Book not found in library" };
    }

    getLibrary() {
        const library = localStorage.getItem('userLibrary');
        return library ? JSON.parse(library) : [];
    }

    getLibraryByStatus(status) {
        const library = this.getLibrary();
        if (!status) return library;
        return library.filter(item => item.status === status);
    }

    isBookInLibrary(bookId) {
        const library = this.getLibrary();
        return library.some(item => item.bookId === bookId);
    }
}

const userManager = new UserManager();
const libraryManager = new LibraryManager();

function initSiteEffects() {
    const style = document.createElement('style');
    style.textContent = `
        .site-effect-btn,
        .site-effect-bg {
            transition: transform 0.35s ease, box-shadow 0.35s ease, filter 0.35s ease;
            will-change: transform, filter;
        }

        .site-effect-btn:hover {
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 18px 35px rgba(0, 0, 0, 0.16);
            filter: brightness(1.08);
        }

        .site-effect-bg:hover {
            transform: scale(1.02);
            filter: brightness(1.08) saturate(1.08);
        }

        .fade-in-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .visible-on-scroll {
            opacity: 1;
            transform: translateY(0);
        }

        .site-ripple {
            position: relative;
            overflow: hidden;
        }

        .site-ripple-circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: siteRipple 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes siteRipple {
            to {
                transform: scale(1);
                opacity: 0;
            }
        }

        @keyframes pulseSlow {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }

        .pulse-slow {
            animation: pulseSlow 4s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);

    const buttonSelectors = 'button, .btn, .search button, .btn-submit, .btn-reset, .btn-browse, .filter-btn, .status-select, .back-btn';
    document.querySelectorAll(buttonSelectors).forEach(element => {
        element.classList.add('site-effect-btn', 'site-ripple');
    });

    const backgroundSelectors = [
        '.hero',
        '.fifth-s',
        '.fourth-s .one',
        '.fourth-s .two',
        '.fourth-s .three',
        '.fourth-s .four',
        '.fourth-s .five',
        '.fourth-s .six',
        '.sixth-s .first',
        '.sixth-s .snd',
        '.sixth-s .thrd',
        '.sixth-s .rth',
        '.sixth-s .first2',
        '.sixth-s .snd2',
        '.sixth-s .thrd2',
        '.sixth-s .rth2',
        '.sixth-s .first3',
        '.sixth-s .snd3',
        '.sixth-s .thrd3',
        '.sixth-s .rth3'
    ];

    backgroundSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.classList.add('site-effect-bg'));
    });

    const fadeSelectors = [
        '.cards',
        '.mini-s',
        '.sixth-s',
        '.seventh-s',
        '.hero',
        '.book-detail',
        '.results-container',
        '.library-container',
        '.auth-box',
        '.results-grid'
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible-on-scroll');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    fadeSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('fade-in-on-scroll');
            observer.observe(el);
        });
    });

    document.addEventListener('click', (event) => {
        const button = event.target.closest('.site-ripple');
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const circle = document.createElement('span');
        circle.className = 'site-ripple-circle';
        const size = Math.max(rect.width, rect.height) * 1.5;
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.left = `${event.clientX - rect.left - size / 2}px`;
        circle.style.top = `${event.clientY - rect.top - size / 2}px`;
        button.appendChild(circle);

        setTimeout(() => {
            circle.remove();
        }, 600);
    });

    const randomElementAnimation = () => {
        const elements = document.querySelectorAll('.btn, .search button, img');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        if (!randomElement) return;

        randomElement.classList.add('pulse-slow');
        setTimeout(() => {
            randomElement.classList.remove('pulse-slow');
        }, 1600);
    };
    setInterval(randomElementAnimation, 16000);
}

window.addEventListener('DOMContentLoaded', initSiteEffects);
