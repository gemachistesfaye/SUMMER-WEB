// Get references to HTML elements
const nameInput = document.getElementById('nameInput');
const greetButton = document.getElementById('greetButton');
const greetingMessage = document.getElementById('greetingMessage');

// Function to update and animate the greeting message
function updateGreeting() {
    const name = nameInput.value.trim();

    // Temporarily remove the 'animate' class to reset the animation state
    // This allows the animation to play again even if the text doesn't change
    greetingMessage.classList.remove('animate');

    // Force a reflow/repaint to ensure the class removal takes effect immediately
    // This is a common trick to re-trigger CSS transitions/animations
    void greetingMessage.offsetWidth; // Accessing offsetWidth forces the browser to re-calculate layout

    if (name) {
        greetingMessage.textContent = `Happy Birthday, ${name}!`;
    } else {
        greetingMessage.textContent = 'Happy Birthday!';
        // Optionally, you might not want an alert if it's just reverting to default
        // alert('Please enter a name!');
    }

    // Add the 'animate' class to trigger the fade-in/scale-up transition
    greetingMessage.classList.add('animate');
}

// Add an event listener to the button
greetButton.addEventListener('click', updateGreeting);

// Allow greeting by pressing Enter in the input field
nameInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        updateGreeting(); // Call the same function
    }
});

// Initial animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Set the initial state before adding the animate class
    greetingMessage.style.opacity = '0';
    greetingMessage.style.transform = 'scale(0.8)';

    // A small delay before applying the class for a smoother initial load animation
    setTimeout(() => {
        greetingMessage.textContent = 'Happy Birthday!'; // Ensure initial text is set
        greetingMessage.classList.add('animate');
    }, 100);
});