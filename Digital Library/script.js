const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E74C3C', '#3498DB'];

function changeColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const header = document.querySelector('header'); // Select the header element

    if (header) {
        header.style.backgroundColor = colors[randomIndex]; // Change header's background
    } else {
        console.error("Header element not found!");
    }
}

const colorButton = document.getElementById('colorButton');

if (colorButton) {
    colorButton.addEventListener('click', changeColor);
} else {
    console.error("Color button not found!");
}

document.addEventListener('DOMContentLoaded', function() { // Ensure DOM is fully loaded
  const searchBar = document.getElementById('search-bar');
  const books = document.querySelectorAll('#books li');

  if (searchBar) {
      searchBar.addEventListener('input', function() {
          const searchTerm = this.value.toLowerCase();

          books.forEach(book => {
              if (book.textContent.toLowerCase().includes(searchTerm)) {
                  book.style.display = 'block';
              } else {
                  book.style.display = 'none';
              }
          });
      });
  } else {
      console.error("Search bar not found!");
  }
});