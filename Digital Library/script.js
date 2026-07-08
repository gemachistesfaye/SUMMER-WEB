// ===== Book Data =====
const books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "fiction", year: 1925, pages: 180, rating: 4.5, featured: true, desc: "A story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, set against the backdrop of the Roaring Twenties.", color: "#2e86c1", icon: "fa-book" },
    { id: 2, title: "A Brief History of Time", author: "Stephen Hawking", category: "science", year: 1988, pages: 256, rating: 4.7, featured: true, desc: "A landmark volume in science writing that explores the nature of time, the Big Bang, black holes, and the search for a grand unified theory.", color: "#8e44ad", icon: "fa-atom" },
    { id: 3, title: "Sapiens", author: "Yuval Noah Harari", category: "history", year: 2011, pages: 443, rating: 4.6, featured: true, desc: "A sweeping narrative of humanity's creation and evolution, exploring how biology and history have defined us.", color: "#d35400", icon: "fa-globe-americas" },
    { id: 4, title: "Clean Code", author: "Robert C. Martin", category: "technology", year: 2008, pages: 464, rating: 4.4, desc: "A handbook of agile software craftsmanship, teaching principles and practices for writing clean, readable code.", color: "#27ae60", icon: "fa-code" },
    { id: 5, title: "The Republic", author: "Plato", category: "philosophy", year: -380, pages: 420, rating: 4.3, desc: "A Socratic dialogue that discusses justice, the order of a just city-state, and the just man.", color: "#7f8c8d", icon: "fa-landmark" },
    { id: 6, title: "Atomic Habits", author: "James Clear", category: "self-help", year: 2018, pages: 320, rating: 4.6, featured: true, desc: "An easy and proven way to build good habits and break bad ones, backed by scientific research.", color: "#e74c3c", icon: "fa-bolt" },
    { id: 7, title: "1984", author: "George Orwell", category: "fiction", year: 1949, pages: 328, rating: 4.7, featured: true, desc: "A dystopian novel set in a totalitarian society ruled by Big Brother, exploring themes of surveillance and propaganda.", color: "#c0392b", icon: "fa-eye" },
    { id: 8, title: "The Origin of Species", author: "Charles Darwin", category: "science", year: 1859, pages: 502, rating: 4.5, desc: "The foundation of evolutionary biology, presenting the theory of natural selection.", color: "#16a085", icon: "fa-dna" },
    { id: 9, title: "Guns, Germs, and Steel", author: "Jared Diamond", category: "history", year: 1997, pages: 480, rating: 4.4, desc: "A transdisciplinary non-fiction book that attempts to explain why Eurasian and North African civilizations have survived and conquered others.", color: "#f39c12", icon: "fa-shield-halved" },
    { id: 10, title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", category: "technology", year: 1999, pages: 352, rating: 4.5, desc: "A guide to becoming a better programmer through practical advice and techniques.", color: "#2980b9", icon: "fa-laptop-code" },
    { id: 11, title: "Meditations", author: "Marcus Aurelius", category: "philosophy", year: 180, pages: 254, rating: 4.6, desc: "Personal writings of the Roman Emperor, offering Stoic philosophy and self-reflection.", color: "#34495e", icon: "fa-feather-pointed" },
    { id: 12, title: "Think and Grow Rich", author: "Napoleon Hill", category: "self-help", year: 1937, pages: 320, rating: 4.3, desc: "A personal development and self-help book that has inspired millions to achieve success.", color: "#1abc9c", icon: "fa-lightbulb" },
    { id: 13, title: "To Kill a Mockingbird", author: "Harper Lee", category: "fiction", year: 1960, pages: 281, rating: 4.8, featured: true, desc: "A novel about racial injustice in the American South, seen through the eyes of young Scout Finch.", color: "#8e44ad", icon: "fa-dove" },
    { id: 14, title: "Cosmos", author: "Carl Sagan", category: "science", year: 1980, pages: 396, rating: 4.7, desc: "A sweeping tour of the universe with Carl Sagan, exploring galaxies, stars, and the nature of life.", color: "#2c3e50", icon: "fa-star" },
    { id: 15, title: "The Art of War", author: "Sun Tzu", category: "history", year: -500, pages: 128, rating: 4.4, desc: "An ancient Chinese military treatise that has become a classic strategy guide.", color: "#c0392b", icon: "fa-chess" },
    { id: 16, title: "Design Patterns", author: "Gang of Four", category: "technology", year: 1994, pages: 395, rating: 4.2, desc: "The definitive guide to software design patterns, covering 23 essential patterns.", color: "#7d3c98", icon: "fa-puzzle-piece" },
    { id: 17, title: "Beyond Good and Evil", author: "Friedrich Nietzsche", category: "philosophy", year: 1886, pages: 240, rating: 4.2, desc: "A philosophical work that challenges traditional morality and truth.", color: "#2c3e50", icon: "fa-brain" },
    { id: 18, title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", category: "self-help", year: 1989, pages: 381, rating: 4.5, desc: "A principle-centered approach to solving personal and professional problems.", color: "#d4ac0d", icon: "fa-chart-line" },
    { id: 19, title: "Pride and Prejudice", author: "Jane Austen", category: "fiction", year: 1813, pages: 432, rating: 4.6, desc: "A romantic novel following Elizabeth Bennet as she navigates issues of class, morality, and marriage.", color: "#e91e63", icon: "fa-heart" },
    { id: 20, title: "The Selfish Gene", author: "Richard Dawkins", category: "science", year: 1976, pages: 360, rating: 4.4, desc: "A gene-centered view of evolution, arguing that genes are the basis of natural selection.", color: "#00897b", icon: "fa-microscope" }
];

// ===== Color Themes =====
const themes = ['', 'theme-green', 'theme-red', 'theme-purple', 'theme-orange', 'theme-teal', 'theme-pink'];
let currentTheme = 0;

// ===== Category Colors =====
const categoryColors = {
    fiction: { bg: '#eaf2f8', text: '#2e86c1' },
    science: { bg: '#f4ecf7', text: '#8e44ad' },
    history: { bg: '#fdf2e9', text: '#d35400' },
    technology: { bg: '#e8f8f5', text: '#1abc9c' },
    philosophy: { bg: '#f2f3f4', text: '#7f8c8d' },
    'self-help': { bg: '#fdedec', text: '#e74c3c' }
};

// ===== DOM Elements =====
const searchBar = document.getElementById('searchBar');
const bookGrid = document.getElementById('bookGrid');
const noResults = document.getElementById('noResults');
const resultsCount = document.getElementById('resultsCount');
const colorButton = document.getElementById('colorButton');
const mainHeader = document.getElementById('mainHeader');
const modal = document.getElementById('bookModal');
const modalClose = document.getElementById('modalClose');
const filters = document.getElementById('filters');

let activeCategory = 'all';
let searchTerm = '';

// ===== Render Books =====
function renderBooks() {
    const filtered = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                            book.author.toLowerCase().includes(searchTerm) ||
                            book.category.toLowerCase().includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || book.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
        bookGrid.innerHTML = '';
        noResults.classList.remove('hidden');
        resultsCount.textContent = 'No books found';
    } else {
        noResults.classList.add('hidden');
        resultsCount.textContent = `Showing ${filtered.length} of ${books.length} books`;

        bookGrid.innerHTML = filtered.map((book, i) => `
            <div class="book-card" data-id="${book.id}" style="animation-delay: ${i * 0.05}s">
                <div class="book-cover" style="background: linear-gradient(135deg, ${book.color}, ${book.color}dd)">
                    <i class="fas ${book.icon}"></i>
                    ${book.featured ? '<span class="book-featured"><i class="fas fa-star"></i> Featured</span>' : ''}
                </div>
                <div class="book-info">
                    <span class="book-category" style="background: ${categoryColors[book.category]?.bg || '#eee'}; color: ${categoryColors[book.category]?.text || '#666'}">${book.category}</span>
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                    <div class="book-rating">
                        ${getStars(book.rating)} <span>${book.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click listeners
        document.querySelectorAll('.book-card').forEach(card => {
            card.addEventListener('click', () => {
                const book = books.find(b => b.id === parseInt(card.dataset.id));
                if (book) openModal(book);
            });
        });
    }
}

function getStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '<i class="fas fa-star"></i>'.repeat(full) +
           '<i class="fas fa-star-half-alt"></i>'.repeat(half) +
           '<i class="far fa-star"></i>'.repeat(empty);
}

// ===== Modal =====
function openModal(book) {
    document.getElementById('modalCover').style.background = `linear-gradient(135deg, ${book.color}, ${book.color}dd)`;
    document.getElementById('modalCover').innerHTML = `<i class="fas ${book.icon}"></i>`;
    document.getElementById('modalCategory').textContent = book.category;
    document.getElementById('modalCategory').style.background = categoryColors[book.category]?.bg || '#eee';
    document.getElementById('modalCategory').style.color = categoryColors[book.category]?.text || '#666';
    document.getElementById('modalTitle').textContent = book.title;
    document.getElementById('modalAuthor').textContent = `by ${book.author}`;
    document.getElementById('modalRating').innerHTML = getStars(book.rating) + ` <span style="color:#888;margin-left:5px">${book.rating}</span>`;
    document.getElementById('modalDesc').textContent = book.desc;
    document.getElementById('modalYear').textContent = book.year < 0 ? `${Math.abs(book.year)} BC` : book.year;
    document.getElementById('modalPages').textContent = book.pages;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// ===== Search =====
searchBar.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    renderBooks();
});

// ===== Filters =====
filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.category;
    renderBooks();
});

// ===== Color Changer =====
colorButton.addEventListener('click', () => {
    currentTheme = (currentTheme + 1) % themes.length;
    themes.forEach(t => mainHeader.classList.remove(t));
    if (themes[currentTheme]) mainHeader.classList.add(themes[currentTheme]);
});

// ===== Stats =====
function updateStats() {
    document.getElementById('totalBooks').textContent = books.length;
    const categories = [...new Set(books.map(b => b.category))];
    document.getElementById('totalCategories').textContent = categories.length;
    document.getElementById('featuredCount').textContent = books.filter(b => b.featured).length;
}

// ===== Keyboard: Escape to close modal =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// ===== Init =====
updateStats();
renderBooks();
